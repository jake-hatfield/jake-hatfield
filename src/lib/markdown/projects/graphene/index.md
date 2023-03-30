---
createdAt: 2023-03-21T18:00:05Z
description: TypeScript, Next.js, TailwindCSS, Stripe, SendGrid, Twilio, Vitest, Playwright, Vercel
hidden: false
image: flip.jpg
keywords: []
repository: https://github.com/jake-hatfield/graphene
site: null
summary: An opinionated starter for Next.js projects
tag: open-source
title: Graphene
updatedAt: null
---

<script>
    // components
    import Lightbox from "$components/utilities/Lightbox.svelte"
    import Link from "$components/utilities/Link.svelte"
</script>

## Summary

This is a highly opinionated starter for your next Next.js project. It's full of utility functions, helpful libraries, and a component system heavily inspired by <Link href="https://carbondesignsystem.com/" isExternal isUnderlined title="IBM's Carbon design system"/>, which is why its called Graphene (refined from carbon).

I came up with it when creating <Link href="https://leadgeek.io" isExternal isUnderlined title="Leadgeek v2"/>, so it's really just set up with the technologies I enjoy using. I've found what works well for me, and I ported it over from SvelteKit to Next.js so I and others could build with these technologies.

## Goals

I wanted to learn Next.js. I hadn't touched React.js since using the MERN stack in the [Leadgeek v1 app](./leadgeek-v1-app) and I wanted to refresh my knowledge of the library while also creating something useful for other people. Therefore, my first thought was to open source a starter.

I was already pretty familiar with the concept of server-side rendering (SSR) in Next.js since I built the [Leadgeek v1 site](./leadgeek-v1-site) with Gatsby.js and [Leadgeek v2](./leadgeek-v2) and [Transform Writing](./transform-writing) with SvelteKit.

In my opinion, `SvelteKit > Next.js > Gatsby.js`, but I still wanted to learn Next.js in case I needed a solid, reliable, and scalable production project. SvelteKit's greatest weakness is that the framework is still young, and introduces breaking changes often.
