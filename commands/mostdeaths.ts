import { Bot } from "mineflayer";
import { PlayerDB } from "../types";

export default async function mostkills(bot: Bot, IGN: string, args: string[], playerDB: PlayerDB) {
	const top3 = Object.entries(playerDB)
		.sort((a, b) => b[1].deaths - a[1].deaths)
		.slice(0, 3);

	bot.sendMessage(`#1: ${top3[0][0]} with ${top3[0][1].deaths}, #2: ${top3[1][0]} with ${top3[1][1].deaths}, #3: ${top3[2][0]} with ${top3[2][1].deaths}`);
}
