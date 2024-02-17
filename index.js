require("dotenv").config();

const mineflayer = require("mineflayer");
const { mineflayer: mineflayerViewer } = require("prismarine-viewer");
const antiafk = require("mineflayer-antiafk");

const pathfinder = require("mineflayer-pathfinder").pathfinder;
const { GoalNear } = require("mineflayer-pathfinder").goals;

const { translate } = require("@vitalets/google-translate-api");

function createBot() {
	const bot = mineflayer.createBot({
		host: process.env["SERVER"],
		username: process.env["IGN"],
		auth: "offline"
	});

	bot.loadPlugin(pathfinder);
	bot.loadPlugin(antiafk);

	let registered = false;
	let lastChatMessageDB = [];

	// sample message : Freddy37_ » be his femboy
	bot.on("messagestr", async (rawMessage) => {
		// check if message is from server or whispers
		if (!rawMessage.includes(" » ")) {
			if (rawMessage.includes("Welcome to 6b6t.org")) {
				console.log("Logged on...");
				bot.afk.setOptions({ fishing: false, chatting: false });
				bot.afk.start();
			}

			if (rawMessage.includes("wants to teleport to you.")) {
				const IGN = rawMessage.split(" ")[0]
				bot.chat("/tpy " + IGN);
			}

			return;
		}

		const [left, right] = rawMessage.split(" » ");

		// checks if they have a rank
		const IGN = left.split(" ").length > 1 ? left.split(" ")[1] : left.split(" ")[0];

		const cmd = right.split(" ")[0];
		const args = right.split(" ").slice(1);

		const command = right.split(" ")[0].substring(1);

		if (IGN == process.env["IGN"]) return;

		// chat history
		if (cmd.charAt(0) != process.env["PREFIX"]) {
			if (IGN == "kazwqi") return;

			if (!lastChatMessageDB[IGN]) {
				lastChatMessageDB[IGN] = [];
			}

			lastChatMessageDB[IGN].push(right);

			return;
		}

		if (command == "translate") {
			if (!args || !args[0]) {
				bot.chat("Usage: ?translate [IGN] [optional: messagesSinceLast]");
				return;
			}

			if (!lastChatMessageDB[args[0]] || lastChatMessageDB[args[0]].length == 0) {
				bot.chat("Haven't seen the user send a message yet.");
				return;
			}

			const userMessages = lastChatMessageDB[args[0]];

			let index = userMessages.length - 1;

			if (args[1] && Number(args[1])) {
				if (args[1] > userMessages.length) {
					bot.chat("Haven't seen the user send that many messages yet.");
				}

				if (Math.floor(Number(args[1])) >= 1) {
					index = userMessages.length - Math.floor(Number(args[1]));
				}
			}

			const translateMessage = userMessages[index];

			const { text } = await translate(translateMessage, { to: "en" }).catch((err) => console.log(err));

			bot.chat("Translated: " + text);
		}

		if (command == "help") {
			bot.chat("Commands: ?translate [IGN], ?help, ?coords");
		}

		if (command == "coords") {
			bot.chat(`My Coords: X: ${bot.entity.position.x.toFixed(1)} Y: ${bot.entity.position.y.toFixed(1)} Z: ${bot.entity.position.z.toFixed(1)}`);
		}
	});

	bot.on("path_update", (r) => {
		const path = [bot.entity.position.offset(0, 0.5, 0)];
		for (const node of r.path) {
			path.push({ x: node.x, y: node.y + 0.5, z: node.z });
		}
		bot.viewer.drawLine("path", path, 0xff00ff);
	});

	bot.once("spawn", () => {
		if (process.env["WEB"] == "true") {
			mineflayerViewer(bot, { port: 3007, firstPerson: false }); // port is the minecraft server port, if first person is false, you get a bird's-eye view
		}

		console.log("Logging in...");

		setTimeout(() => {
			console.log("Moving towards portal...");
			if (!registered) {
				bot.chat("/login " + process.env["PASSWORD"]);
				registered = true;
			}

			// navigates towards portal
			bot.pathfinder.setGoal(new GoalNear(-999.5, 101, -987.6265996179612, 0));
		}, 5000);
	});

	bot.on("kicked", (reason, loggedIn) => {
		console.log("Kicked:", reason);
		bot.viewer.close();

		// If bot was logged in before being kicked, attempt to reconnect
		if (loggedIn) {
			setTimeout(createBot, 15000); // Reconnect after 5 seconds
		}
	});

	bot.on("error", (err) => {
		console.log("Error:", err);
		bot.viewer.close();
		// Attempt to reconnect on error
		setTimeout(createBot, 15000); // Reconnect after 5 seconds
	});
	
	bot.on("end", () => {
		bot.viewer.close();
		console.log("Disconnected... attempting to reconnect in 15 sec");
		
		setTimeout(createBot, 15000);
	});
}

createBot();
