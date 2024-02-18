import { load } from "ts-dotenv";
import mineflayer from "mineflayer";
import antiafk from "mineflayer-antiafk";
import pathfinder from "mineflayer-pathfinder";
import { mineflayer as prismarineViewer } from "prismarine-viewer"; // Corrected import
import handleServerMessage from "./events/serverMessages";
import handleChatMessage from "./events/chatMessage";
import { Vec3 } from "vec3";
import fs from "fs";

export interface Viewer {
	erase(id: string): void;
	drawBoxGrid(id: string, start: any, end: any, color?: string): void;
	drawLine(id: string, points: any[], color?: number): void;
	drawPoints(id: string, points: any[], color?: number, size?: number): void;
	close(): void;
}

export interface afk {
	/**
	 * bot starts to perform allowed actions sequentially, with randomized order, time and details(such as walking and looking direction, block choosing) If fishing is enabled, bot checks if it can start fishing(eg. if a fishing rod is available in eq) between all performed actions, and decides whether start to fish or stay in normal mode.
	 * @example
	 * bot.afk.start();
	 */
	start: () => Promise<void>;
	/**
	 * disables anti afk
	 */
	stop: () => Promise<void>;
	setOptions: (options?: afkOptions) => void;

	// Internal Functions
	fish: () => Promise<void>;
	rotate: () => Promise<void>;
	walk: (dir: "forward" | "back" | "left" | "right") => Promise<void>;
	jump: () => Promise<void>;
	jumpWalk: () => Promise<void>;
	swingArm: () => Promise<void>;
	placeBlock: () => Promise<void>;
	breakBlock: () => Promise<void>;
	chat: () => Promise<void>;

	// Internal Variables
	isFishing: boolean;
	config: afkOptions;
	enabled: boolean;
	killaura: {
		enabled: boolean;
		interval: any;
	};
}

export interface afkOptions {
	/**
	 * Array, allowed bot actions during normal mode(not fishing)
	 * @default
	 * ['rotate', 'walk', 'jump', 'jumpWalk', 'swingArm', 'placeBlock', 'breakBlock']
	 */
	actions?: afkAction[];

	/**
	 * Boolean, defining if bot can fish(it will start only when standing in water and having a fishing rod in equipment
	 * @default true
	 */
	fishing?: boolean;

	/**
	 * Integer, defines minimum time of action 'walk' in ms
	 * @default 2000
	 */
	minWalkingTime?: number;

	/**
	 * Integer, defines maximum time of action 'walk' in ms
	 * @default 4000
	 */
	maxWalkingTime?: number;

	/**
	 * Integer, defines minimum time between actions in ms
	 * @default 0
	 */
	minActionsInterval?: number;

	/**
	 * Integer, defines maximum time between actions in ms
	 * @default 500
	 */
	maxActionsInterval?: number;

	/**
	 * Array, block IDs allowed to break
	 * @default
	 * [2, 3, 5, 12, 13, 17]
	 */
	breaking?: number[];

	/**
	 * Array, block IDs allowed to place(if available in equipment)
	 * @default
	 * [3, 5, 12, 13, 17]
	 */
	placing?: number[];

	/**
	 * Boolean, defining if bot has to send chat messages
	 * @default true
	 */
	chatting?: boolean;

	/**
	 * Array, messages to be sent by bot
	 * @default
	 * ['!que', '!queue']
	 */
	chatMessages?: string[];

	/**
	 * Integer, interval between sent messages in ms
	 * @default 300000
	 */
	chatInterval?: number;

	/**
	 * Integer, defines if killaura should be enabled(only hostile mobs)
	 * @default true
	 */
	killauraEnabled?: boolean;

	/**
	 * Integer, defines if mineflayer-auto-eat should be enabled
	 * @default true
	 */
	autoEatEnabled?: boolean;

	// mineflayer-auto-eat has no type definition
	/**
	 * Object mineflayer-auto-eat configurations(look [here](https://github.com/LINKdiscordd/mineflayer-auto-eat#botautoeatoptions))
	 * @default
	 * {
	 *   priority: "foodPoints",
	 *   startAt: 14,
	 *   bannedFood: [],
	 * }
	 */
	autoEatConfig?: any;
}

export type afkAction = "rotate" | "walk" | "jump" | "jumpWalk" | "swingArm" | "placeBlock" | "breakBlock";

const playerDB = JSON.parse(fs.readFileSync("./db/playerDB.json", "utf8"));

declare module "mineflayer" {
	interface Bot {
		viewer: Viewer;
		afk: afk;
	}
}

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
