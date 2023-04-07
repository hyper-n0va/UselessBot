import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { PokemonClient, Pokemon } from "pokenode-ts";
import { Chance } from "chance";
import { capitalizeFirstLetter } from "../constants";

const chance = new Chance();

const pokemon = new SlashCommandBuilder()
    .setName("pokemon")
    .setDescription("Gives you a random Pokemon")
;

const defaultEmbed = new EmbedBuilder()
    .setTitle("Ash's Dad")
    .setImage("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/122.png")
    .addFields(
        { name: "Type", value: "Normal" }
    )
;

async function getRandomPokemon(api: PokemonClient): Promise<Pokemon | undefined> {
    const pkmnList = await (await api.listPokemonSpecies(0, 905)).results;
    let randomPokemon = await api.getPokemonByName(pkmnList[Math.floor(Math.random() * pkmnList.length)].name);
    const sprites = randomPokemon.sprites;
    if (sprites.other === undefined) {
        getRandomPokemon(api);
    } else {
        return randomPokemon;
    }
}

async function getPokemonEmbed() {
    const api = new PokemonClient();
    let randomPokemon = await getRandomPokemon(api);
    if (randomPokemon !== undefined) {
        let pokemonImage = chance.weighted([randomPokemon.sprites.front_default, randomPokemon.sprites.front_shiny], [19/20, 1/20]);
        let pokemonSpecies = api.getPokemonSpeciesByName(randomPokemon.species.name);
        let engText = null;
        let types: string[] = [];

        randomPokemon.types.forEach((pkmnType) => {
            types.push(capitalizeFirstLetter(pkmnType.type.name));
        })

        let typeString = types.join(" / ");

        for (let flavorText of (await pokemonSpecies).flavor_text_entries) {
            if (flavorText.language.name === "en") {
                engText = flavorText.flavor_text;
            }
        }

        return new EmbedBuilder()
            .setTitle(capitalizeFirstLetter(randomPokemon.name))
            .setImage(pokemonImage!)
            .setDescription(engText)
            .addFields(
                { name: "Types", value: typeString }
            )
    } 
    throw new Error("random Pokemon is undefined");
}

export default {
    data: pokemon,
    async execute(interaction: CommandInteraction) {
        try {
            let embed = (await getPokemonEmbed()).toJSON();
            await interaction.reply({ embeds: [embed] })
            return;
        } catch (e) {
            await interaction.reply({ embeds: [defaultEmbed.toJSON()] });
        }
    }
}