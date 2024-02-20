import { Bot } from "mineflayer";
import { PlayerDB } from "../types";

import { load } from "ts-dotenv";
const env = load({
	PASSWORD: String,
	WEB: Boolean,
	PREFIX: String,
	IGN: String,
	SERVER: String
});

export default async function help(bot: Bot, IGN: string, args: string[], playerDB: PlayerDB) {
	bot.sendMessage(
		`Commands: ${env["PREFIX"]}translate [IGN], ${env["PREFIX"]}help, ${env["PREFIX"]}coords, ${env["PREFIX"]}kd, ${env["PREFIX"]}mostkills, ${env["PREFIX"]}mostdeaths, /tpa ${env["IGN"]}`
	);
}
