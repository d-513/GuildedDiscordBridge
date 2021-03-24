# GuildedDiscordBridge

Discord <---> Guilded bridge

### Install

1. Clone the repo
2. npm install
3. Rename config.example.json to config.json
4. Fill the required fields in config

auth:

- email: guilded email
- password: guilded password

discordtoken: discord bot token  
channels: object mapping guilded channel id -> discord channel id

### How to get channel IDS

Guilded: create an invite and copy the I parameter of the link  
Discord: enable devloper mode in settings, right click a channel and click copy ID
