import { Bot } from "mineflayer";
import { PlayerDB } from "../types";

export default async function mostkills(bot: Bot, IGN: string, args: string[], playerDB: PlayerDB) {
	const top3 = Object.entries(playerDB)
		.sort((a, b) => b[1].kills - a[1].kills)
		.slice(0, 3);

	bot.sendMessage(`${top3[0][0]}: ${top3[0][1].kills}, ${top3[1][0]}: ${top3[1][1].kills}, ${top3[2][0]}: ${top3[2][1].kills}`);
}
