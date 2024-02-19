import { Bot } from "mineflayer";
import { PlayerDB } from "../types";

export default async function mostkills(bot: Bot, IGN: string, args: string[], playerDB: PlayerDB, junk: string) {
	let mostKills = 0;
	let mostKillsUser = "";

	for (const user in playerDB) {
		if (playerDB[user]["kills"] > mostKills) {
			mostKills = playerDB[user]["kills"];
			mostKillsUser = user;
		}
	}

	bot.sendMessage(`${mostKillsUser} killed the most people with ${mostKills} kills. | ${junk}`);
}
