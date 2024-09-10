import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const CommandData = new SlashCommandBuilder()
    .setName("about")
    .setDescription("Info about UselessBot");

export const CommandExecution = async (interaction: CommandInteraction) => {
    const uselessBotEmbed = new EmbedBuilder()
        .setTitle("Hello!")
        .setDescription("I'm UselessBot. I have weird commands.")
        .setThumbnail("http://upload.wikimedia.org/wikipedia/commons/c/cf/Curious_Raccoon.jpg")
        .toJSON();

    const githubEmbed = new EmbedBuilder()
        .setTitle("GitHub Repo")
        .setURL("https://github.com/hyper-n0va/UselessBot")
        .setThumbnail("https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png")
        .setDescription("https://github.com/hyper-n0va/UselessBot")
        .toJSON();
    
    await interaction.reply({ ephemeral: true, embeds: [uselessBotEmbed, githubEmbed] });
};