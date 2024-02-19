import { Bot } from "mineflayer";

export default function extendBot(bot: Bot) {
	bot.queue = [];
	bot.lastMessageSentTime = 0;

	bot.sendMessage = function (message: string) {
		const currentTime = new Date().getTime();
		const timeSinceLastMessage = currentTime - this.lastMessageSentTime;

		if (timeSinceLastMessage >= 3000) {
			// If it's been more than 3 seconds since the last message, send instantly
			this.sendMessageInstantly(message);
		} else {
			// If it's been less than 3 seconds, queue the message
			this.queue.push(message);
			setTimeout(() => {
				this.sendQueuedMessage();
			}, 3000 - timeSinceLastMessage);
		}
	};

	bot.sendMessageInstantly = function (message: string) {
		bot.chat(message);
		this.lastMessageSentTime = new Date().getTime();
	};

	bot.sendQueuedMessage = function () {
		if (this.queue.length > 0) {
			const message = this.queue.shift();

			if (message) {
				this.sendMessageInstantly(message);
			}
		}
	};
}
