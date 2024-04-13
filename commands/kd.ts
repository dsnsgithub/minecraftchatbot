import { Bot } from "mineflayer";
import { PlayerDB } from "../types";

export default async function kd(bot: Bot, IGN: string, args: string[], playerDB: PlayerDB) {
	let user = IGN;

	if (args[0]) {
		const lowercaseArg = args[0].toLowerCase();
		const matchingPlayer = Object.keys(playerDB).find((key) => key.toLowerCase() === lowercaseArg);
		if (matchingPlayer) {
			user = matchingPlayer;
		} else {
			if (bot.players[lowercaseArg]) {
				user = lowercaseArg;
			}
		}
	}

	if (!playerDB[user]) {
		playerDB[user] = {
			messages: [],
			kills: 0,
			deaths: 0
		};
	}

	bot.sendMessage(`${user} has ${playerDB[user]["kills"]} kill${playerDB[user]["kills"] == 1 ? "" : "s"} and ${playerDB[user]["deaths"]} death${playerDB[user]["deaths"] == 1 ? "" : "s"}.`);
}
