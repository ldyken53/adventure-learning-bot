# STL
import os, json, asyncio
from typing import Dict

# PDM
import discord
from discord.ext import commands
from discord_slash.utils.manage_commands import create_option, create_choice
from discord_slash import SlashCommand, SlashContext

bot = commands.Bot(command_prefix="!")  # , intents=discord.Intents.all()
slash = SlashCommand(bot, sync_commands=True)


num_to_emoji = {
    1: '1️⃣',
    2: '2️⃣',
    3: '3️⃣',
    4: '4️⃣'
}


@bot.event
async def on_ready():
    print("We have logged in as {0.user}".format(bot))


@bot.event
async def on_message(message):
    if message.author == bot.user:
        return

    if message.content.startswith("$hello"):
        await message.channel.send("Hello!")


@slash.slash(name="learn")
async def learn(ctx: SlashContext) -> None:
    await ctx.send(content="What would you like to learn?")


# @slash.slash(name="reply",
#             guild_ids=[837844953790808074],
#             description="give a response    ",
#             options=[
#                 create_option(
#                     name="options",
#                     description="Please pick an option",
#                     option_type=3,
#                     required=True,
#                     choices=[create_choice(**d) for d in global_choices],
#                 )
#             ])
# async def reply(ctx: SlashContext, options) -> None:
#     await ctx.send(content=f"Wow, you actually chose {options}? :(")


@slash.slash(name="poll", guild_ids=[837844953790808074])
async def poll(ctx: SlashContext) -> None:
    msg = await ctx.send(content="POLL: \n :one: \n :two: \n :three: \n :four: \n")
    await msg.add_reaction("1️⃣")
    await msg.add_reaction("2️⃣")
    await msg.add_reaction("3️⃣")
    await msg.add_reaction("4️⃣")


@slash.slash(name="start-test", guild_ids=[837844953790808074])
async def start(ctx: SlashContext) -> None:
    f = open("../sample_adventure.json")
    paths = json.loads(f.read())
    await ctx.send(f"Would you like to Learnabot \'{paths['name']}\' {num_to_emoji[1]} solo or {num_to_emoji[2]} together?")
    together_responses = dict.fromkeys(["solo", "1", num_to_emoji[1]], False)
    together_responses.update(dict.fromkeys(["together", "2", num_to_emoji[2]], True))
    def handle_together(m):
        return together_responses.get(m.content) is not None
    msg = await bot.wait_for('message', check=handle_together)
    together = together_responses[msg.content]
    await ctx.send(f"Get ready to Learnabot \'{paths['name']}\': {paths['description']}{' together' if together else ''}!")
    await asyncio.sleep(0.5)
    dest = await handle_path(ctx, paths["paths"][0], together)
    while(dest is not None):
        await asyncio.sleep(0.5)
        dest = await handle_path(ctx, paths["paths"][dest], together)
    await ctx.channel.send(f"You've reached the end of \'{paths['name']}\'! Good job!")
    

async def handle_path(ctx: SlashContext, path: Dict, together: bool):
    await ctx.channel.send(path["text"])
    if path["options"]:
        option_msg = ""
        response_to_dest = {}
        for i in range(len(path["options"])):
            response_to_dest.update(dict.fromkeys([path["options"][i]["text"], str(i+1), num_to_emoji[i+1]], path["options"][i]["dest"]))
            option_msg += num_to_emoji[i+1] + " " + path["options"][i]["text"] + '\n'
        def handle_option(m):
            return response_to_dest.get(m.content) is not None
        await asyncio.sleep(0.5)
        msg = await ctx.channel.send(option_msg)
        if together:
            for i in range(len(path["options"])):
                await msg.add_reaction(num_to_emoji[i+1])
        msg = await bot.wait_for('message', check=handle_option)
        await msg.add_reaction('👍')
        return response_to_dest[msg.content]


def start() -> None:
    token = os.getenv("DISCORD_BOT_TOKEN")
    bot.run(token)


if __name__ == "__main__":
    start()
