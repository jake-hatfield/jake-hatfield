---
createdAt: 2023-03-20T18:00:00Z
description: TypeScript, Node.js, Express.js, Discord.js, Railway
hidden: false
hiddenRepo: false
image: projects/c-meme30.jpg
keywords: [node.js, express.js, backend project]
isIndexed: true
repository: https://github.com/jake-hatfield/c-meme30
site: null
summary: Play Star Wars prequel voice lines in your Discord server
tag: backend
title: C-Meme30
updatedAt: null
---

## Summary

This Discord bot is the first thing I ever programmed. More specifically, a Discord bot with a huge `if` / `else if` block was the first thing I ever programmed.

Originally, it played a Star Wars prequel `.gif` on command from a member of the server. Since then, it's been upgraded to instead join the voice channel the member is in and play a random voice line. I cut those voice lines from the movies myself - it's a lot of Anakin and Jar Jar Binks.

I'm including this in my portfolio to show that I don't just give up on old projects, but that I apply what I've learned to refactor and improve them.

The current code for this project is much more modularized, DRY, and readable, but there are still a few features I'd like to add in the future to make it better.

## Goals

In 2019, I wanted to learn how to program, but I didn't really know where to start. Back then, I knew if programming was going to stick, I needed to build something usable and fun. Thus, C-Meme30 (pronounced `see-mēm-three-oh`) was born.

Over the years, I've picked the project up for enjoyment and refactored the code as I've learned more. It went from that disgusting `if` / `else` block → picking a random element from an array → Discord.js v14 responding to `/` commands.

## Results

I never built this project to become a massive success, it was just something fun to build to learn and iterate on. My friends and I have gotten a lot of laughs out of it, and now that it's deployed on Railway, anyone can plug it into their Discord server.

On the extremely off-chance that it takes off, it's built for scale to serve hundreds of Discord servers at one time. I've also put some thought into hosting this on a Raspberry Pi in my home just for the fun of setting up a local, persistent server.

## Tech stack

- JavaScript (initially) / TypeScript (refactor)
- Node.js
- Express.js
- Discord.js
- FFmpeg
- Heroku (initially) / Railway (refactor)

I originally wrote the bot up in JavaScript and refactored to TypeScript later. No shot I could have written this in TypeScript when I was first learning, but it's a simple task now.

I deployed the bot using Express.js with Heroku initially. However, since they've become a progressively worse service over time in my opinion (and they no longer have a free tier), I decided to deploy it on Railway with the newest iteration.

I would have liked to deploy it on Cyclic, which is what I used to push the [Doom Scheme API](./doom-scheme) to production, but Cyclic doesn't support projects that require Python in their dependencies. No sweat, I think I like Railway better anyway 👍.

## Overview

The bot has increased in functionality and quality on each version.

### Code quality

The Discord.js API has gotten more complicated since the initial release of this project. Not only have their methods and schema changed, but their permissions have gotten a lot more strict. It's understandable, though, since Discord has grown a lot since 2019.

Overall, v14 of the API has a higher learning curve, but it's _much_ more powerful than it used to be. My initial bot was 2 files:

1. The Express.js server and logic for choosing the response, connecting, and replying
2. The content itself (`.gif` and `.mp3`)

As the logic has grown since then, it's been modularized into 18 files:

- The `index` file
- The `ready` state handlers
- The `interaction` creation and execution handlers
- The `command` handlers
- The content creation handlers
- The content itself (`.mp3` voice lines)

Some of it is definitely overkill. For instance, the project uses module aliases even though pretty much everything is in the `lib` folder. Is it necessary? No. But I just like the look of aliased imports better. I just want it to be clean, what can I say?

### Interactivity

Previous iterations of the bot would require a special character, `!`, before the body of the message in order to generate a response. People had to completely guess what messages would trigger a response. To play a voice line from Anakin, is it `!ani` or `!anakin` or even misspellings like `!anikin`?

The new slash commands in Discord.js v14 take care of this uncertainty by displaying a list of possible options when you precede your message with the new special character, `/`. I think it leads to a better experience and really shows off the functionality to the fullest extent.

There are now 13 commands that the bot can respond to with over 130 voice lines:

#### Specific character's lines

- `/anakin`
- `/yoda`
- `/palpatine`
- `/padme`
- `/mace` (Mace Windu)
- `/dooku`
- `/obi-won`
- `/trade` (Trade Federation)
- `/jar-jar`

#### Specific lines

- `/working`
- `/die`
- `/good`

#### Random lines

- `/random`

### Message clutter

In the newest iteration, these messages from user → bot and responses from bot → user can possess the `ephemeral` option. This means that the interactions to trigger the bot are only shown to the initiator of those actions.

This prevents the Discord server's text message thread from being completely cluttered with interactions, making human → human messages the priority.

### Audio quality

Streaming audio to the voice channel using FFmpeg was sub-par at first. The stream was somewhat laggy and cut out about half a second before the track was finished playing.

However, using the Opus codec really increased the quality of the stream. Especially with Discord.js v14, the audio quality is great, though it required a refactor to use the new audio resource creation methods.

## Hindsight

No regrets on this project. Its purpose was to help me learn and apply new programming skills over time, so I'm not embarrassed by the code quality from years ago.

It's not like this is a complicated project, but I'm happy with its ability to just allow me and my friends to have a better time while gaming together. Life gets in the way, so nowadays it's pretty rare to sit down and game. It's a bit nostalgic for C-Meme30 to help us have a laugh like we did back in 2019.

### Future updates

However, there are a few little quality-of-life fixes that should be made.

For example, if a member isn't in a voice channel but initiates a command, there's no response from the bot to indicate that they must first join a voice channel.

Also, if all human members leave the voice channel, the bot stays in for a few minutes after.

Nothing major, but there are just some tweaks to give the bot some polish.

## Wrapping up

I don't have any plans for this bot to possess auto-moderation capabilities, integrations with AI, or complex logic. I could do things like that with it, but that's not the point of the project.

No major features will probably be added to it for a while. But if I come up with a funny idea that can be thrown together in a few hours, I'll probably add a cheeky lil' update.

Maybe one day it'll get it's own website? 🤷‍♂️

Recently, I've been working on much more complex projects like [Leadgeek v2](./leadgeek-v2) and [Doom Scheme](./doom-scheme).
