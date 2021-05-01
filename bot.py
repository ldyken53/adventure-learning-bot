# STL
import os
import random

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




@bot.event
async def on_ready():
    print('We have logged in as {0.user}'.format(bot))


@bot.event
async def on_message(message):
    if message.author == bot.user:
        return

    if message.content.startswith('$hello'):
        await message.channel.send('Hello!')


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
    msg = await ctx.send(
        content="POLL: \n :one: \n :two: \n :three: \n :four: \n"
    )
    await msg.add_reaction('1️⃣')
    await msg.add_reaction('2️⃣')
    await msg.add_reaction('3️⃣')
    await msg.add_reaction('4️⃣')


def start() -> None:
    token = os.getenv("DISCORD_BOT_TOKEN")
    bot.run(token)


if __name__ == "__main__":
    start()
