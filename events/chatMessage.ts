import { load } from "ts-dotenv";

import fs from "fs";
import crypto from "crypto";

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

	const junk = crypto.randomBytes(4).toString("hex");
	const [left, right] = rawMessage.split(" » ");

	const IGN = left.split(" ").length > 1 ? left.split("] ")[1] : left.split(" ")[0];
	const cmd = right.split(" ")[0];
	const args = right.split(" ").slice(1);
	const command = right.split(" ")[0].substring(1);

	if (IGN == env["IGN"]) return;

	// chat history
	if (cmd.charAt(0) != env["PREFIX"]) {
		if (!playerDB[IGN]) {
			playerDB[IGN] = {
				messages: [],
				kills: 0,
				deaths: 0
			};
		}

		playerDB[IGN]["messages"].push(right);

		if (playerDB[IGN]["messages"].length > 10) {
			playerDB[IGN]["messages"].splice(0, playerDB[IGN]["messages"].length - 10);
		}

		fs.writeFileSync("./db/playerDB.json", JSON.stringify(playerDB));

		return;
	}

	if (command == "translate") translate(bot, IGN, args, playerDB, junk);
	if (command == "help") help(bot, IGN, args, playerDB, junk);
	if (command == "coords") coords(bot, IGN, args, playerDB, junk);
	if (command == "kd") kd(bot, IGN, args, playerDB, junk);
	if (command == "mostkills") mostkills(bot, IGN, args, playerDB, junk);
	if (command == "mostdeaths") mostdeaths(bot, IGN, args, playerDB, junk);
}

export default handleChatMessage;
