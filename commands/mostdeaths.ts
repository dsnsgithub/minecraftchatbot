import { Bot } from "mineflayer";
import { PlayerDB } from "../types";

export default async function mostdeaths(bot: Bot, IGN: string, args: string[], playerDB: PlayerDB, junk: string) {
	let mostDeaths = 0;
	let mostDeathsUser = "";

	for (const user in playerDB) {
		if (playerDB[user]["deaths"] > mostDeaths) {
			mostDeaths = playerDB[user]["deaths"];
			mostDeathsUser = user;
		}
	}

	bot.chat(`${mostDeathsUser} died the most with ${mostDeaths} deaths. | ${junk}`);
}
