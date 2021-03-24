import { Client as GClient } from "gupi";
import Discord from "discord.js";
import * as config from "../config.json";

const gClient = new GClient(config.auth);
const dClient = new Discord.Client();
let dcReady = false;
let gReady = false;

const gToD = config.channels;
const dToG = {};

for (const channel in gToD) {
  if (gToD.hasOwnProperty(channel)) {
    dToG[gToD[channel]] = channel;
  }
}

console.log(gToD, dToG);

dClient.once("ready", () => {
  dcReady = true;
  console.log("Discord connected");
});

dClient.on("message", (message) => {
  if (!gReady) return;
  if (message.author.id === dClient.user.id) return;
  const c = dToG[message.channel.id];
  console.log(c);
  if (c) {
    gClient.requestManager.sendMessage(c, {
      confirmed: false,
      messageId: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          let r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      ),
      content: {
        object: "value",
        document: {
          object: "document",
          data: {},
          nodes: [
            {
              object: "block",
              type: "markdown-plain-text",
              data: {},
              nodes: [
                {
                  object: "text",
                  leaves: [
                    {
                      object: "leaf",
                      text: `<${message.author.tag}> ${message.content}`,
                      marks: [],
                    },
                  ],
                },
              ],
            },
            {
              object: "block",
              type: "webhookMessage",
              data: {
                embeds: [],
              },
              nodes: [],
            },
          ],
        },
      },
    });
  }
});

gClient.channels.maxSize = 100;

gClient
  .once("ready", () => {
    gReady = true;
    console.log("Guilded Connected");
  })
  .on("messageCreated", (message) => {
    if (!dcReady) return;
    const c = gToD[message.channelId];
    if (c) {
      const user = gClient.users.get(message.authorId);
      if (user.id === gClient.user.id) return;
      dClient.channels.cache.get(c).send(`<${user.name}> ${message.content}`);
    }
  })
  .on("unknown", console.log);

dClient.login(config.discordtoken);
gClient.connect();
