# Translation Chat Bot in Minecraft
This is a Minecraft Chat Bot that allows for communication between people who speak different languages, mainly designed for anarchy servers.

![image](https://github.com/dsnsgithub/minecraftchatbot/assets/48170013/9ae69b9c-b152-4c45-800e-745eaeeef5a2)


## Features

#### 1. Translate Command
- **Description**: This command allows users to request translation of messages from other players using the [Translateer API](https://t.song.work/).
- **Usage**: Users can utilize the `?translate [IGN] [optional: messagesSinceLast] [optional: language]` command to translate messages from one language to another.
   
#### 2. Help Command
- **Description**: This command provides users with a list of available commands.
- **Usage**: Users can trigger this command by typing `?help` in the chat.

#### 3. Coordinates Display Command
- **Description**: This command allows users to see the bot's current coordinates within the Minecraft world.
- **Usage**: Users can use the `?coords` command to request the bot's coordinates.

#### 4. KD (Kill/Death Ratio) Command
- **Description**: This command provides information about a player's kill and death counts, or the kill and death counts of a specified player.
- **Usage**: Users can either check their own kill/death ratio or specify another player's IGN to check theirs.

#### 5. Most Kills Command
- **Description**: This command displays the player who has the highest number of kills along with their kill count.
- **Usage**: Users can use this command to find out who has the most kills in the server.

#### 6. Most Deaths Command
- **Description**: This command displays the player who has the highest number of deaths along with their death count.
- **Usage**: Users can use this command to find out who has the most deaths in the server.


## Components

- **Mineflayer**: A library for creating Minecraft bots in Node.js.
  
- **Prismarine Viewer**: Provides visualization capabilities for the Minecraft world.

- **Mineflayer Pathfinder**: Adds pathfinding functionality to the bot, allowing it to navigate through the game world.

- **Mineflayer Anti-AFK**: Plugin to prevent the bot from going AFK (Away From Keyboard).

- **Axios**: HTTP client for making requests to external APIs.

## Usage

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up environment variables in a `.env` file. Required variables include:
   - `SERVER`: Minecraft server host.
   - `IGN`: Bot's in-game name.
   - `PREFIX`: Prefix for bot commands (e.g., `?`).
   - `PASSWORD`: Bot's login password (if applicable).
   - `WEB`: Whether to enable web visualization (`true` or `false`).
4. Run the bot using `node .`.
