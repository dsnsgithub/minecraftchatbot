import { load } from "ts-dotenv";
import fs from "fs";

import handleServerMessage from "./events/serverMessage";
import handleChatMessage from "./events/chatMessage";

import mineflayer from "mineflayer";
import { mineflayer as prismarineViewer } from "prismarine-viewer"; // Corrected import
import antiafk from "mineflayer-antiafk";
import pathfinder from "mineflayer-pathfinder";
import { Vec3 } from "vec3";

import { Viewer, afk } from "./types";
import extendBot from "./mineflayer-extension";
declare module "mineflayer" {
	interface Bot {
		viewer: Viewer;
		afk: afk;
		queue: string[];
		lastMessageSentTime: number;
		sendMessage(message: string): void;
		sendMessageInstantly(message: string): void;
		sendQueuedMessage(): void;
	}
}

const playerDB = JSON.parse(fs.readFileSync("./db/playerDB.json", "utf8"));

const env = load({
	PASSWORD: String,
	WEB: Boolean,
	PREFIX: String,
	IGN: String,
	SERVER: String
});

function createBot() {
	const bot = mineflayer.createBot({
		host: env["SERVER"],
		username: env["IGN"],
		auth: "offline"
	});

	bot.loadPlugin(pathfinder.pathfinder);
	bot.loadPlugin(antiafk);
	extendBot(bot)

	let registered = false;

	bot.on("messagestr", async (rawMessage) => {
		if (!rawMessage.includes(" » ")) {
			handleServerMessage(bot, rawMessage, playerDB);
		} else {
			handleChatMessage(bot, rawMessage, playerDB);
		}
	});

	bot.on("path_update", (r) => {
		const path = [bot.entity.position.offset(0, 0.5, 0)];
		for (const node of r.path) {
			path.push(new Vec3(node.x, node.y, node.z));
		}
		bot.viewer.drawLine("path", path, 0xff00ff);
	});

	bot.once("spawn", () => {
		if (env["WEB"]) {
			// port is the minecraft server port, if first person is false, you get a bird's-eye view
			prismarineViewer(bot, { port: 3007, firstPerson: false });
		}

		console.log("[INFO] Logging in...");
		setTimeout(() => {
			console.log("[INFO] Moving towards portal...");
			if (!registered) {
				bot.chat("/login " + env["PASSWORD"]);
				registered = true;
			}

			// navigates towards portal
			bot.pathfinder.setGoal(new pathfinder.goals.GoalNear(-999.5, 101, -987.6265996179612, 0));
		}, 5000);
	});

	bot.on("kicked", (reason, loggedIn) => {
		console.error("Kicked:", reason);
		bot.end();
	});

	bot.on("error", (err) => {
		console.error("Error:", err);
		bot.end();
	});

	bot.on("end", () => {
		if (bot.viewer) {
			bot.viewer.close();
		}

		console.error("Disconnected... attempting to reconnect in 15 sec");
		setTimeout(createBot, 15000);
	});
}

createBot();
