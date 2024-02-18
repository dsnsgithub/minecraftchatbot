import { load } from "ts-dotenv";

import axios from "axios";
import fs from "fs";
import { Bot } from "mineflayer";

import crypto from "crypto";

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

	// checks if they have a rank
	const IGN = left.split(" ").length > 1 ? left.split(" ")[1] : left.split(" ")[0];

	const cmd = right.split(" ")[0];
	const args = right.split(" ").slice(1);

	const command = right.split(" ")[0].substring(1);

	if (IGN == env["IGN"]) return;

	// chat history
	if (cmd.charAt(0) != env["PREFIX"]) {
		if (IGN == "kazwqi") return;

		if (!playerDB[IGN]) {
			playerDB[IGN] = {
				messages: [],
				kills: 0,
				deaths: 0
			};
		}

		playerDB[IGN]["messages"].push(right);

		fs.writeFileSync("./db/playerDB.json", JSON.stringify(playerDB));

		return;
	}

	if (command == "translate") {
		if (!args || !args[0]) {
			bot.chat("Usage: ?translate [IGN] [optional: messagesSinceLast] [optional: language] | " + junk);
			return;
		}

		if (!playerDB[args[0]] || playerDB[args[0]]["messages"].length == 0) {
			bot.chat("Haven't seen the user send a message yet. | " + junk);
			return;
		}

		const userMessages = playerDB[args[0]]["messages"];

		let index = userMessages.length - 1;
		let language = "en";

		if (args[1] && Number(args[1])) {
			if (Number(args[1]) > userMessages.length) {
				bot.chat("Haven't seen the user send that many messages yet. | " + junk);
			}

			if (Math.floor(Number(args[1])) >= 1) {
				index = userMessages.length - Math.floor(Number(args[1]));
			}
		} else if (args[1] && args[1].length == 2) {
			const allowedLanguages = ["en", "es", "ru", "zh", "vi", "ta", "te"];

			if (allowedLanguages.includes(args[1].toLowerCase())) {
				language = args[1].toLowerCase();
			}
		}

		if (args[2] && args[2].length == 2) {
			const allowedLanguages = ["en", "es", "ru", "zh", "vi", "ta", "te"];

			if (allowedLanguages.includes(args[2].toLowerCase())) {
				language = args[2].toLowerCase();
			}
		}

		const translateMessage = userMessages[index];
		try {
			const { data } = await axios.get("https://t.song.work/api", {
				params: {
					text: translateMessage,
					from: "auto",
					to: language,
					lite: true
				}
			});

			bot.chat("Translated: " + data.result + " | " + junk);
		} catch (e) {
			console.log(e);
		}
	}

	if (command == "help") {
		bot.chat("Commands: ?translate [IGN], ?help, ?coords | " + junk);
	}

	if (command == "coords") {
		bot.chat(`My Coords: X: ${bot.entity.position.x.toFixed(1)} Y: ${bot.entity.position.y.toFixed(1)} Z: ${bot.entity.position.z.toFixed(1)}`);
	}

	if (command == "kd") {
		let user = IGN;

		if (args[0] && playerDB[args[0]]) {
			user = args[0];
		}

		bot.chat(`Kills: ${playerDB[user]["kills"]} | Deaths: ${playerDB[user]["deaths"]} | ${junk}`);
	}
}

export default handleChatMessage;
