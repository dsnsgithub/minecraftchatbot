import fs from "fs";
import { load } from "ts-dotenv";

import { Bot } from "mineflayer";
import { PlayerDB } from "../types";

const env = load({
	PASSWORD: String,
	WEB: Boolean,
	PREFIX: String,
	IGN: String,
	SERVER: String
});

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
			`Teleport to spawn with /tpa ${env["IGN"]}`,
			`/tpa ${env["IGN"]} to teleport back to spawn`,
			`Want to get back to spawn? /tpa ${env["IGN"]}`,
			`Interested in going back to spawn? Try /tpa ${env["IGN"]}`,
			`Use /tpa ${env["IGN"]} to instantly teleport to the spawn area`,
			`Want to respawn quickly? Use /tpa ${env["IGN"]}`,
			`Ready to teleport to spawn? Type /tpa ${env["IGN"]}`,
			`Teleport directly to spawn by typing /tpa ${env["IGN"]}`
		];

		setInterval(() => {
			const randomSentence = preMadeSentences[Math.floor(Math.random() * preMadeSentences.length)];
			bot.sendMessage(`${randomSentence}`);
		}, 180000);
	}

	if (rawMessage.includes("wants to teleport to you.")) {
		const IGN = rawMessage.split(" ")[0];
		bot.chat("/tpy " + IGN);
	}

	const deathTriggers = [
		"died",
		"was killed by",
		"high place",
		"burned to death",
		"drowned",
		"starved to death",
		"withered away",
		"killed themselves",
		"thought they could swim forever",
		"shot by",
		"blew up",
		"slain by a Zombie",
	];

	if (deathTriggers.some((trigger) => rawMessage.includes(trigger))) {
		const IGN = rawMessage.split(" ")[0];

		addDeath(IGN, playerDB);
		return;
	}

	const messageKeywords = {
		"using an end crystal": { victimIndex: 0, killerIndex: -5 },
		crystalled: { victimIndex: 2, killerIndex: 0 },
		"was slain by": { victimIndex: 0, killerIndex: 4 }
	};

	for (const keyword in messageKeywords) {
		if (rawMessage.includes(keyword)) {
			let { victimIndex, killerIndex } = messageKeywords[keyword as keyof typeof messageKeywords];
			const splitMessage = rawMessage.split(" ");

			if (victimIndex < 0) {
				victimIndex = splitMessage.length + victimIndex;
			}
			
			if (killerIndex < 0) {
				killerIndex = splitMessage.length + killerIndex;
			}

			const victimIGN = splitMessage[victimIndex];
			const killerIGN = splitMessage[killerIndex];

			addKill(victimIGN, killerIGN, playerDB);
			return; // Assuming only one condition can match
		}
	}
}

export default handleServerMessage;
