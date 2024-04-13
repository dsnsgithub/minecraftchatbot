import { load } from "ts-dotenv";

import fs from "fs";

import { Bot } from "mineflayer";
import { PlayerDB } from "../types";

import translate from "../commands/translate";
import help from "../commands/help";
import coords from "../commands/coords";
import kd from "../commands/kd";
import mostkills from "../commands/mostkills";
import mostdeaths from "../commands/mostdeaths";

const env = load({
	PASSWORD: String,
	WEB: Boolean,
	PREFIX: String,
	IGN: String,
	SERVER: String
});

async function handleChatMessage(bot: Bot, rawMessage: string, playerDB: PlayerDB) {
	console.log("[CHAT] " + rawMessage);

	const [left, right] = rawMessage.split(" » ");

	const IGN = left.split(" ").length > 1 ? left.split("] ")[1] : left.split(" ")[0];
	const command = right.split(" ")[0];
	const commandName = right.split(" ")[0].substring(1);
	const args = right.split(" ").slice(1);

	if (IGN == env["IGN"]) return;
	if (!IGN) return;

	// chat history
	if (command.charAt(0) != env["PREFIX"]) {
		if (!playerDB[IGN]) {
			playerDB[IGN] = {
				messages: [],
				kills: 0,
				deaths: 0
			};
		}

		playerDB[IGN]["messages"].push(right);

		if (playerDB[IGN]["messages"].length > 5) {
			playerDB[IGN]["messages"].splice(0, playerDB[IGN]["messages"].length - 5);
		}

		fs.writeFileSync("./db/playerDB.json", JSON.stringify(playerDB));

		return;
	}

	if (commandName == "translate") translate(bot, IGN, args, playerDB);
	if (commandName == "help") help(bot, IGN, args, playerDB);
	if (commandName == "coords") coords(bot, IGN, args, playerDB);
	if (commandName == "kd") kd(bot, IGN, args, playerDB);
	if (commandName == "mostkills") mostkills(bot, IGN, args, playerDB);
	if (commandName == "mostdeaths") mostdeaths(bot, IGN, args, playerDB);
}

export default handleChatMessage;
