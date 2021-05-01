# STL
import os
import random

# PDM
import discord
from discord.ext import commands
from discord_slash.utils import manage_commands
from discord_slash import SlashCommand, SlashContext

bot = commands.Bot(command_prefix="!")  # , intents=discord.Intents.all()
slash = SlashCommand(bot, sync_commands=True)


@bot.event
async def on_ready():
    print("We have logged in as {0.user}".format(bot))


@bot.event
async def on_message(message):
    if message.author == bot.user:
        return

    if message.content.startswith("$hello"):
        await message.channel.send("Hello!")


@slash.slash(name="test", description="Simple test command")
async def test(ctx: SlashContext) -> None:
    # embed = discord.Embed(title="embed test")
    await ctx.send(content="test")


@slash.slash(name="learn")
async def learn(ctx: SlashContext) -> None:
    await ctx.send(content="What would you like to learn?")


@slash.slash(name="reply", description="give a response to the prompt")
async def reply(ctx: SlashContext, *args) -> None:
    for i in args:
        print(i)
    await ctx.send(content="replying...")


@slash.slash(name="poll", guild_ids=[837844953790808074])
async def poll(ctx: SlashContext) -> None:
    msg = await ctx.send(content="POLL: \n :one: \n :two: \n :three: \n :four: \n")
    await msg.add_reaction("1️⃣")
    await msg.add_reaction("2️⃣")
    await msg.add_reaction("3️⃣")
    await msg.add_reaction("4️⃣")


def start() -> None:
    token = os.getenv("DISCORD_BOT_TOKEN")
    bot.run(token)


if __name__ == "__main__":
    start()
