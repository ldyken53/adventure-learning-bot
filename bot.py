# STL
import os
import random

# PDM
import discord
from discord.ext import commands
from discord_slash import SlashCommand, SlashContext

bot = commands.Bot(command_prefix="!")  # , intents=discord.Intents.all()
slash = SlashCommand(bot, sync_commands=True)


@bot.event
async def on_ready():
    print('We have logged in as {0.user}'.format(bot))


@slash.slash(name="test", description="Simple test command", guild_ids=[837844953790808074])
async def test(ctx: SlashContext) -> None:
    # embed = discord.Embed(title="embed test")
    await ctx.send(content="test")



@slash.slash(name="learn", guild_ids=[837844953790808074])
async def learn(ctx: SlashContext) -> None:
    await ctx.send(content="What would you like to learn?")


def start() -> None:
    token = os.getenv("DISCORD_BOT_TOKEN")
    bot.run(token)


if __name__ == "__main__":
    start()
