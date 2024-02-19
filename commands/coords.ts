import { Bot } from "mineflayer";
import { PlayerDB } from "../types";

export default async function coords(bot: Bot, IGN: string, args: string[], playerDB: PlayerDB, junk: string) {
	bot.chat(`My Coords: X: ${bot.entity.position.x.toFixed(1)} Y: ${bot.entity.position.y.toFixed(1)} Z: ${bot.entity.position.z.toFixed(1)}`);
}
