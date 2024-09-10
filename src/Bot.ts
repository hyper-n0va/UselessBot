import { Client } from "discord.js";
import dotenv from "dotenv";
import { client, logger } from "./constants";
import { importCommands } from "./Commandler";

dotenv.config({ path:"./.env" });

logger.info("UselessBot is starting...");

const TOKEN = process.env.DISCORD_TOKEN;

if (TOKEN === undefined) {
    logger.info("You have not set the DISCORD_TOKEN environment variable");
    process.exit(0);
}

async function ready(client: Client): Promise<void> {
    const commandMap = await importCommands();
    client.on("ready", async (client) => {
        const guildList = client.guilds.cache.map(guild => guild.id);
        logger.info(client.user.username + " is running in these Guilds: " + guildList.join(", "));
        
        logger.info("Loading commands from src/commands");
        commandMap.forEach((cmd) => {
            logger.debug(`/${ cmd.CommandData.name } loaded`);
        });
    });

    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) return;
        
        const { commandName, guild } = interaction;
        const user = interaction.user;
        let serverId;

        if (guild !== null) {
            serverId = guild.id;
        } else {
            serverId = "None";
        }    
        
        logger.info(`${ user.username }${user.discriminator === "0" ? "" : "#" + user.discriminator } (${ user.id }) invoked /${ commandName } in Guild: ${ serverId }`);
        
        const usedCommand = commandMap.get(commandName);
        if (usedCommand !== undefined) {
            usedCommand.CommandExecution(interaction);
        }
    });

    client.on("messageCreate", (message) => {
        if (!message.author.bot) {
            if (message.content.toLowerCase().includes("sus")) {
                logger.info(`Sus Reacted to a message from ${ message.author.username } in ${ message.guildId }`);
                message.react("<:sus:1011595741631885342>");
            }
            if (message.content.toLowerCase().includes("lamp")) {
                logger.info(`Moth Reacted to a message from ${ message.author.username } in ${ message.guildId }`);
                message.react("<:moth:1011626571930542202>");
            }
            if (message.content.toLowerCase().includes("bread")) {
                logger.info(`Bread Reacted to a message from ${ message.author.username } in ${ message.guildId }`);
                message.react("🍞");
            }
        }
    });

    client.on("messageReactionAdd", async (reaction) => {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (err) {
                logger.error(err);
                return;
            }
        }
    });
}

ready(client);

client.login(TOKEN).catch((err) => {
    if (err.code === "TokenInvalid") {
        logger.error("An invalid token was provided.");
    } else {
        logger.error(err);
    }
} );