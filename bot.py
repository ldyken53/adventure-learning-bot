# STL
import os

# PDM
import discord
from discord.ext import commands
from discord_slash import SlashCommand, SlashContext

bot = commands.Bot(command_prefix="!") # , intents=discord.Intents.all()
slash = SlashCommand(bot)


@slash.slash(name="test")
async def _test(ctx: SlashContext) -> None:
    embed = discord.Embed(title="embed test")
    await ctx.send(content="test", embeds=[embed])


def start() -> None:
    token = os.getenv("DISCORD_BOT_TOKEN")
    bot.run(token)


if __name__ == "__main__":
    start()
