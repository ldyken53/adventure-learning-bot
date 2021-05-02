# STL
import os, json, asyncio, requests
from typing import Dict

# PDM
import discord
from discord.ext import commands
from discord_slash.utils.manage_commands import create_option, create_choice
from discord_slash import SlashCommand, SlashContext


bot = commands.Bot(command_prefix="!")
slash = SlashCommand(bot, sync_commands=True)
num_emoji = {0: "0️⃣", 1: "1️⃣", 2: "2️⃣", 3: "3️⃣", 4: "4️⃣", 5: "5️⃣", 6: "6️⃣", 7: "7️⃣", 8: "8️⃣", 9: "9️⃣"}

def num_to_emoji(num):
    emoji = ""
    while True:
        emoji = num_emoji[num%10] + emoji
        num = num // 10
        if not num:
            break
    return emoji


STARTING_NODE = "00000000-0000-0000-0000-000000000000"


def fetch_stories():
    r = requests.get('https://adventure-api-57rkjmf5la-uc.a.run.app/get-adventures')
    return json.loads(r.text)


def fetch_genres():
    r = requests.get('https://adventure-api-57rkjmf5la-uc.a.run.app/get-genres')
    return json.loads(r.text)


async def select_story(ctx: SlashContext, stories: list) -> dict:
    responses = {}
    stream = "Please select an adventure: \n"
    for index, story in enumerate(stories):
        index += 1
        stream += f"{num_to_emoji(index)} {story['name']}\n\t by: {story['creator']}\n\n"
        responses.update(dict.fromkeys([story["name"], str(index), num_to_emoji(index)], index - 1))
    await ctx.send(stream)

    def handle_response(m):
        return responses.get(m.content) is not None

    msg = await bot.wait_for("message", check=handle_response)
    story_index = responses[msg.content]
    return stories[story_index]


async def select_genre(ctx: SlashContext, genres: list):
    responses = {}
    stream = "Please select a genre: \n"
    for index, genre in enumerate(genres):
        index += 1
        stream += f"{num_to_emoji(index)}    {genre['name'].capitalize() + ' ' + genre['emoji']}\n\t      {genre['description']}\n\n"
        responses.update(dict.fromkeys([genre["name"], str(index), num_to_emoji(index)], index - 1))
    await ctx.send(stream)

    def handle_response(m):
        return responses.get(m.content) is not None

    msg = await bot.wait_for("message", check=handle_response)
    genre_index = responses[msg.content]
    return genres[genre_index]

@bot.event
async def on_ready():
    print("We have logged in as {0.user}".format(bot))


@slash.slash(name="start", description="Begin your adventure!", guild_ids=[837844953790808074])
async def start(ctx: SlashContext) -> None:
    paths = fetch_stories()
    genres = fetch_genres()
    genre = await select_genre(ctx, genres)
    paths = [path for path in paths if path["genre_id"] == genre["id"]]
    if not paths:
        embed = discord.Embed()
        embed.description = "Sadly no adventures have been made in this genre yet. Check again later, or make your own [here!](https://directed-beacon-307320.uc.r.appspot.com/home)"
        await ctx.send(embed=embed)
        return
    story = await select_story(ctx, paths)
    await ctx.send(f"You selected: {story['name']}")
    await ctx.send(
        f"Would you like to Learnabot '{story['name']}' {num_to_emoji(1)} solo or {num_to_emoji(2)} together?"
    )
    together_responses = dict.fromkeys(["solo", "1", num_to_emoji(1)], False)
    together_responses.update(dict.fromkeys(["together", "2", num_to_emoji(2)], True))

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
                    [path["options"][i]["text"], str(i + 1), num_to_emoji(i + 1)],
                    path["options"][i]["dest"],
                )
            )
            option_msg += num_to_emoji(i + 1) + " " + path["options"][i]["text"] + "\n"

        def handle_option(m):
            return response_to_dest.get(m.content) is not None

        def handle_together(m):
            return m.content == "END POLL"

        await asyncio.sleep(0.5)
        msg = await ctx.channel.send(option_msg)
        if together:
            for i in range(len(path["options"])):
                await msg.add_reaction(num_to_emoji(i + 1))
            await ctx.channel.send("Send 'END POLL' to end the poll and take the most popular path")
            await bot.wait_for("message", check=handle_together)
            cache_msg = discord.utils.get(bot.cached_messages, id=msg.id) 
            msg.content = max(cache_msg.reactions, key = lambda k: k.count).emoji
        else:
            msg = await bot.wait_for("message", check=handle_option)
            await msg.add_reaction("👍")
        return response_to_dest[msg.content]


def run_bot() -> None:
    token = os.getenv("DISCORD_BOT_TOKEN")
    bot.run(token)


if __name__ == "__main__":
    run_bot()
