import fs from "fs";
import crypto from "crypto";

import { Bot } from "mineflayer";
import { PlayerDB } from "../types";


function addDeath(IGN: string, playerDB: PlayerDB) {
	if (!playerDB[IGN]) {
		playerDB[IGN] = {
			messages: [],
			kills: 0,
			deaths: 0
		};
	}

	playerDB[IGN].deaths++;
	fs.writeFileSync("./db/playerDB.json", JSON.stringify(playerDB));
}

function addKill(victimIGN: string, killerIGN: string, playerDB: PlayerDB) {
	if (!playerDB[victimIGN]) {
		playerDB[victimIGN] = {
			messages: [],
			kills: 0,
			deaths: 0
		};
	}

	if (!playerDB[killerIGN]) {
		playerDB[killerIGN] = {
			messages: [],
			kills: 0,
			deaths: 0
		};
	}

	playerDB[victimIGN].deaths++;
	playerDB[killerIGN].kills++;
	fs.writeFileSync("./db/playerDB.json", JSON.stringify(playerDB));
}

function handleServerMessage(bot: Bot, rawMessage: string, playerDB: PlayerDB) {
	console.log("[SERVER] " + rawMessage);

	if (rawMessage.includes("Welcome to 6b6t.org")) {
		console.log("[INFO] Logged on...");
		bot.afk.setOptions({ fishing: false, chatting: false });
		bot.afk.start();

		bot.chat("/deathmsgs on");
		bot.chat("/connectionmsgs on");

		const junk = crypto.randomBytes(4).toString("hex");
		setInterval(() => {
			bot.sendMessage("Teleport to spawn with /tpa " + bot.username + " | " + junk);
		}, 60000);
	}

	if (rawMessage.includes("wants to teleport to you.")) {
		const IGN = rawMessage.split(" ")[0];
		bot.chat("/tpy " + IGN);
	}

	const deathTriggers = ["died.", "was killed by", "fell from a high place", "burned to death", "drowned", "starved to death"];
	if (deathTriggers.some((trigger) => rawMessage.includes(trigger))) {
		const IGN = rawMessage.split(" ")[0];

		addDeath(IGN, playerDB);
	}

	if (rawMessage.includes("using an end crystal")) {
		const splitMessage = rawMessage.split(" ");
		const victimIGN = splitMessage[0];
		const killerIGN = splitMessage[splitMessage.length - 5];

		addKill(victimIGN, killerIGN, playerDB);
	}
}

export default handleServerMessage;