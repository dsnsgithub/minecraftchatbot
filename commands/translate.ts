import { Bot } from "mineflayer";
import { PlayerDB } from "../types";

import axios from "axios";

const allowedLanguages = [
    "af", "sq", "am", "ar", "hy", "as", "ay", "az", "bm", "eu", "be", "bn", "bho", "bs", "bg", "ca", "ceb", "zh-CN", "zh-TW", "co", 
    "hr", "cs", "da", "dv", "doi", "nl", "en", "eo", "et", "ee", "fil", "fi", "fr", "fy", "gl", "ka", "de", "el", "gn", "gu", "ht", 
    "ha", "haw", "he", "hi", "hmn", "hu", "is", "ig", "ilo", "id", "ga", "it", "ja", "jv", "kn", "kk", "km", "rw", "gom", "ko", "kri", 
    "ku", "ckb", "ky", "lo", "la", "lv", "ln", "lt", "lg", "lb", "mk", "mai", "mg", "ms", "ml", "mt", "mi", "mr", "mni-Mtei", "lus", 
    "mn", "my", "ne", "no", "ny", "or", "om", "ps", "fa", "pl", "pt", "pa", "qu", "ro", "ru", "sm", "sa", "gd", "nso", "sr", "st", 
    "sn", "sd", "si", "sk", "sl", "so", "es", "su", "sw", "sv", "tl", "tg", "ta", "tt", "te", "th", "ti", "ts", "tr", "tk", "ak", 
    "uk", "ur", "ug", "uz", "vi", "cy", "xh", "yi", "yo", "zu"
];

export default async function translate(bot: Bot, IGN: string, args: string[], playerDB: PlayerDB, junk: string) {
	if (!args || !args[0]) {
		bot.sendMessage("Usage: ?translate [IGN] [optional: messagesSinceLast] [optional: language] | " + junk);
		return;
	}

	if (!playerDB[args[0]] || playerDB[args[0]]["messages"].length == 0) {
		bot.sendMessage("Haven't seen the user send a message yet. | " + junk);
		return;
	}

	const userMessages = playerDB[args[0]]["messages"];

	let index = userMessages.length - 1;
	let language = "en";

	if (args[1] && Number(args[1])) {
		if (Number(args[1]) > userMessages.length) {
			bot.sendMessage("Haven't seen the user send that many messages yet. | " + junk);
		}

		if (Math.floor(Number(args[1])) >= 1) {
			index = userMessages.length - Math.floor(Number(args[1]));
		}
	} else if (args[1] && args[1].length == 2) {
		if (allowedLanguages.includes(args[1].toLowerCase())) {
			language = args[1].toLowerCase();
		}
	}

	if (args[2] && args[2].length == 2) {
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

		bot.sendMessage("Translated: " + data.result + " | " + junk);
	} catch (e) {
		bot.sendMessage("An error occurred while translating. Try again later." + " | " + junk);
		console.error(e)
	}
}
