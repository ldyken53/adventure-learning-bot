# STL
import os, json, asyncio
from typing import Dict

# PDM
import discord
from discord.ext import commands
from discord_slash.utils.manage_commands import create_option, create_choice
from discord_slash import SlashCommand, SlashContext

# LOCAL
from psqlconnect import database_fetch

bot = commands.Bot(command_prefix="!")
slash = SlashCommand(bot, sync_commands=True)
num_to_emoji = {1: "1️⃣", 2: "2️⃣", 3: "3️⃣", 4: "4️⃣"}

STARTING_NODE = "00000000-0000-0000-0000-000000000000"


def fetch_stories():
    records = database_fetch("SELECT * FROM adventure;", ())
    print(records)
    f = open("../sample_adventure.json")
    paths = json.loads(f.read())
    return [paths]


async def select_story(ctx: SlashContext, stories: list) -> dict:
    responses = {}
    stream = "Please select an adventure: \n"
    for index, story in enumerate(stories):
        index += 1
        stream += f"{index}.) {story['name']}\n\t by: {story['creator']}\n\n"
        responses.update(dict.fromkeys([story["name"], str(index)], index - 1))
    await ctx.send(stream)

    def handle_response(m):
        return responses.get(m.content) is not None

    msg = await bot.wait_for("message", check=handle_response)
    story_index = responses[msg.content]
    return stories[story_index]


@bot.event
async def on_ready():
    print("We have logged in as {0.user}".format(bot))


@bot.event
async def on_message(message):
    if message.author == bot.user:
        return

    if message.content.startswith("$hello"):
        await message.channel.send("Hello!")


@slash.slash(name="start", description="Begin your adventure!", guild_ids=[837844953790808074])
async def start(ctx: SlashContext) -> None:
    paths = fetch_stories()
    story = await select_story(ctx, paths)
    await ctx.send(f"You selected: {story['name']}")
    await ctx.send(
        f"Would you like to Learnabot '{story['name']}' {num_to_emoji[1]} solo or {num_to_emoji[2]} together?"
    )
    together_responses = dict.fromkeys(["solo", "1", num_to_emoji[1]], False)
    together_responses.update(dict.fromkeys(["together", "2", num_to_emoji[2]], True))

    def handle_together(m):
        return together_responses.get(m.content) is not None

    msg = await bot.wait_for("message", check=handle_together)
    together = together_responses[msg.content]
    await ctx.send(
        f"Get ready to Learnabot '{story['name']}': {story['description']}{' together' if together else ''}!"
    )
    await asyncio.sleep(0.5)

    dest = await handle_path(ctx, story["paths"][STARTING_NODE], together)
    while dest is not None:
        await asyncio.sleep(0.5)
        dest = await handle_path(ctx, story["paths"][dest], together)
    await ctx.channel.send(f"You've reached the end of '{story['name']}'! Good job!")


async def handle_path(ctx: SlashContext, path: Dict, together: bool):
    await ctx.channel.send(path["text"])
    if path["options"]:
        option_msg = ""
        response_to_dest = {}
        for i in range(len(path["options"])):
            response_to_dest.update(
                dict.fromkeys(
                    [path["options"][i]["text"], str(i + 1), num_to_emoji[i + 1]],
                    path["options"][i]["dest"],
                )
            )
            option_msg += num_to_emoji[i + 1] + " " + path["options"][i]["text"] + "\n"

        def handle_option(m):
            return response_to_dest.get(m.content) is not None

        await asyncio.sleep(0.5)
        msg = await ctx.channel.send(option_msg)
        if together:
            for i in range(len(path["options"])):
                await msg.add_reaction(num_to_emoji[i + 1])
        msg = await bot.wait_for("message", check=handle_option)
        await msg.add_reaction("👍")
        return response_to_dest[msg.content]


def run_bot() -> None:
    token = os.getenv("DISCORD_BOT_TOKEN")
    bot.run(token)


if __name__ == "__main__":
    run_bot()
