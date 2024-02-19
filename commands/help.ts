import { Bot } from "mineflayer";
import { PlayerDB } from "../types";

export default async function help(bot: Bot, IGN: string, args: string[], playerDB: PlayerDB, junk: string) {
	bot.sendMessage("Commands: ?translate [IGN], ?help, ?coords, ?kd, ?mostkills, ?mostdeaths | " + junk);
}
