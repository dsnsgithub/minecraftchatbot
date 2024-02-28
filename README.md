# Minecraft Chat Bot
This is a Minecraft Chat Bot that allows for communication between people who speak different languages, mainly designed for anarchy servers.

![image](https://github.com/dsnsgithub/minecraftchatbot/assets/48170013/9ae69b9c-b152-4c45-800e-745eaeeef5a2)


## Features

1. Translate Command
- **Description**: This command allows users to request translation of messages from other players using the [Translateer API](https://t.song.work/).
- **Usage**: `?translate [IGN] [optional: messagesSinceLast] [optional: language]`
   
2. Help Command
- **Description**: This command provides users with a list of available commands.
- **Usage**: `?help`

3. Coordinates Display Command
- **Description**: This command allows users to see the bot's current coordinates within the Minecraft world.
- **Usage**: `?coords`

4. KD (Kill/Death Ratio) Command
- **Description**: This command provides information about a player's kill and death counts, or the kill and death counts of a specified player.
- **Usage**: `?kd [optional: IGN]`

5. Most Kills Command
- **Description**: This command displays the top 3 players with the most kills along with their kill count.
- **Usage**: `?mostkills`

6. Most Deaths Command
- **Description**: This command displays the top 3 players with the most deaths along with their death count.
- **Usage**: `?mostdeaths`


## Components
- **Mineflayer**: A library for creating Minecraft bots in Node.js.
- **Prismarine Viewer**: Provides visualization capabilities for the Minecraft world.
- **Mineflayer Pathfinder**: Adds pathfinding functionality to the bot, allowing it to navigate through the game world.
- **Axios**: HTTP client for making requests to external APIs.

## Usage

1. Clone the repository
2. Install dependencies using `npm install`
3. Set up environment variables in a `.env` file. Required variables include:
   - `SERVER`: Minecraft server host
   - `IGN`: Bot's in-game name
   - `PREFIX`: Prefix for bot commands (e.g., `?`)
   - `PASSWORD`: Bot's login password (if applicable)
   - `WEB`: Whether to enable web visualization (`true` or `false`)
4. Run the bot using `node .`
