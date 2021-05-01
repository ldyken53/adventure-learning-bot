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



global_choices = [
    {
        "name": "option1",
        "value": "YES"
    },
    {
        "name": "option2",
        "value": "NO"
    }
]


num_to_emoji = {
    1: '1️⃣ ',
    2: '2️⃣ ',
    3: '3️⃣ ',
    4: '4️⃣ '
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


@slash.slash(name="reply",
            guild_ids=[837844953790808074],
            description="give a response    ",
            options=[
                create_option(
                    name="options",
                    description="Please pick an option",
                    option_type=3,
                    required=True,
                    choices=[create_choice(**d) for d in global_choices],
                )
            ])
async def reply(ctx: SlashContext, options) -> None:
    await ctx.send(content=f"Wow, you actually chose {options}? :(")


@slash.slash(name="poll", guild_ids=[837844953790808074])
async def poll(ctx: SlashContext) -> None:
    msg = await ctx.send(content="POLL: \n :one: \n :two: \n :three: \n :four: \n")
    await msg.add_reaction("1️⃣")
    await msg.add_reaction("2️⃣")
    await msg.add_reaction("3️⃣")
    await msg.add_reaction("4️⃣")


@slash.slash(name="start-test", guild_ids=[837844953790808074])
async def start(ctx: SlashContext) -> None:
    f = open("../sample_adventure.jsonc")
    paths = json.loads(f.read())
    await ctx.send(f"Get ready to Learnabot \'{paths['name']}\': {paths['description']}!")
    await asyncio.sleep(0.5)
    dest = await handle_path(ctx, paths["paths"][0])
    while(dest is not None):
        dest = await handle_path(ctx, paths["paths"][dest])
    await ctx.channel.send(f"You've reached the end of \'{paths['name']}\'! Good job!")
    

async def handle_path(ctx: SlashContext, path: Dict):

    def handle_option(m):
        return m.content in [option["text"] for option in path["options"]]

    await ctx.channel.send(path["text"])
    if path["options"]:
        option_msg = ""
        for i in range(len(path["options"])):
            option_msg += num_to_emoji[i+1] + path["options"][i]["text"] + '\n'
        await asyncio.sleep(0.5)
        await ctx.channel.send(option_msg)
        msg = await bot.wait_for('message', check=handle_option)
        await msg.add_reaction('👍')
        text_to_dest = {option["text"]: option["dest"] for option in path["options"]}
        return text_to_dest[msg.content]


def start() -> None:
    token = os.getenv("DISCORD_BOT_TOKEN")
    bot.run(token)


if __name__ == "__main__":
    start()
