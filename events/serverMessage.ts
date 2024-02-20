import fs from "fs";

import { Bot } from "mineflayer";
import { PlayerDB } from "../types";

function addDeath(IGN: string, playerDB: PlayerDB) {
	if (!playerDB[IGN]) {
		playerDB[IGN] = {
			messages: [],
			kills: 0,
			deaths: 0
		};
	}

	playerDB[IGN].deaths++;
	fs.writeFileSync("./db/playerDB.json", JSON.stringify(playerDB));
}

function addKill(victimIGN: string, killerIGN: string, playerDB: PlayerDB) {
	if (!playerDB[victimIGN]) {
		playerDB[victimIGN] = {
			messages: [],
			kills: 0,
			deaths: 0
		};
	}

	if (!playerDB[killerIGN]) {
		playerDB[killerIGN] = {
			messages: [],
			kills: 0,
			deaths: 0
		};
	}

	playerDB[victimIGN].deaths++;
	playerDB[killerIGN].kills++;
	fs.writeFileSync("./db/playerDB.json", JSON.stringify(playerDB));
}

function handleServerMessage(bot: Bot, rawMessage: string, playerDB: PlayerDB) {
	console.log("[SERVER] " + rawMessage);

	if (rawMessage.includes("Welcome to 6b6t.org")) {
		console.log("[INFO] Logged on...");

		bot.setControlState("forward", true);
		bot.setControlState("jump", true);
		setInterval(() => {
			bot.look(Math.random() * 2 * Math.PI - Math.PI, Math.random() * Math.PI - Math.PI / 2);
			bot.swingArm("right", Math.random() > 0.5);
		}, 1000);

		bot.chat("/deathmsgs on");
		bot.chat("/connectionmsgs on");

		const preMadeSentences = [
			"Teleport to spawn with /tpa DSNSbot",
			"/tpa DSNSbot to teleport back to spawn",
			"Want to get back to spawn? /tpa DSNSbot",
			"Interested in going back to spawn? Try /tpa DSNSbot",
			"Use /tpa DSNSbot to instantly teleport to the spawn area",
			"Want to respawn quickly? Use /tpa DSNSbot",
			"Ready to teleport to spawn? Type /tpa DSNSbot",
			"Teleport directly to spawn by typing /tpa DSNSbot"
		];

		setInterval(() => {
			const randomSentence = preMadeSentences[Math.floor(Math.random() * preMadeSentences.length)];
			bot.sendMessage(`${randomSentence}`);
		}, 300000);
	}

	if (rawMessage.includes("wants to teleport to you.")) {
		const IGN = rawMessage.split(" ")[0];
		bot.chat("/tpy " + IGN);
	}

	const deathTriggers = [
		"died",
		"was killed by",
		"fell from a high place",
		"burned to death",
		"drowned",
		"starved to death",
		"withered away",
		"killed themselves",
		"thought they could swim forever",
		"shot by",
		"blew up"
	];
	if (deathTriggers.some((trigger) => rawMessage.includes(trigger))) {
		const IGN = rawMessage.split(" ")[0];

		addDeath(IGN, playerDB);
	}

	if (rawMessage.includes("using an end crystal")) {
		const splitMessage = rawMessage.split(" ");
		const victimIGN = splitMessage[0];
		const killerIGN = splitMessage[splitMessage.length - 5];

		addKill(victimIGN, killerIGN, playerDB);
	}

	if (rawMessage.includes("crystalled")) {
		const splitMessage = rawMessage.split(" ");
		const killerIGN = splitMessage[0];
		const victimIGN = splitMessage[2];

		addKill(victimIGN, killerIGN, playerDB);
	}
}

export default handleServerMessage;
