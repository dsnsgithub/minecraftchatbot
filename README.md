# Translation Chat Bot in Minecraft
This is a Minecraft Chat Bot that allows for communication between people who speak different languages.

![image](https://github.com/dsnsgithub/minecraftchatbot/assets/48170013/9ae69b9c-b152-4c45-800e-745eaeeef5a2)


## Features

1. **Message Translation**: Users can request translation of messages from other players. The bot utilizes [Translateer API](https://t.song.work/) to translate messages from one language to another.
   
2. **Help Command**: Users can request a list of available commands using the `?help` command.

3. **Coordinates Display**: Users can request the bot's current coordinates within the Minecraft world using the `?coords` command.

4. **Pathfinding**: The bot utilizes pathfinding algorithms to navigate within the Minecraft world. It can navigate towards specific goals such as portals or other locations.

5. **TPA Accept**: The bot will automatically accept any TPAs for servers that use it, making it easier to travel around spawn.

6. **Anti-AFK Mechanism**: The bot includes an anti-AFK plugin to prevent it from being automatically kicked due to inactivity.

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
