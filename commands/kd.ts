import { Bot } from "mineflayer";
import { PlayerDB } from "../types";

export default async function kd(bot: Bot, IGN: string, args: string[], playerDB: PlayerDB, junk: string) {
	let user = IGN;

	if (args[0]) {
		if (playerDB[args[0]]) {
			user = args[0];
		} else {
			if (bot.players[args[0]]) {
				user = args[0];
			}
		}
	}

	if (!playerDB[user]) {
		playerDB[IGN] = {
			messages: [],
			kills: 0,
			deaths: 0
		};
	}

	bot.sendMessage(`${user} has ${playerDB[user]["kills"]} kills and ${playerDB[user]["deaths"]} deaths. | ${junk}`);
}