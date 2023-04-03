---
createdAt: 2023-03-25T18:00:03Z
description: TypeScript, SvelteKit, Supabase, TailwindCSS, Stripe, SendGrid, Twilio, Vitest, Playwright, Github Actions, Vercel
hidden: false
hiddenRepo: true
image: projects/transform-writing.jpg
keywords: [sveltekit, full-stack project]
repository: null
site: https://transformwriting.com
summary: Turn in proofread essays with confidence
tag: fullstack
title: Transform Writing
updatedAt: null
---

<script>
     // components
    import Lightbox from "$components/utilities/Lightbox.svelte"
    import Link from "$components/utilities/Link.svelte"
</script>

## Summary

This is a software-as-a-service (SaaS) I put together for a client, Sam, in 2022 that helps students submit their essays for proofreading.

Sam mentioned to me that their current contract development team wasn't close to meeting their vision for the web app, so I offered some advice. That advice ended up with me programming the application myself, which worked out well for both parties.

I had my sights on creating [Leadgeek v2](./leadgeek-v2) in the near future and wanted a chance to build and test a design system from scratch.

The game plan for the current dev team was just to mash together WordPress plugins, so I stepped in to provide an actual solution that achieved Sam's vision for the project.

## Goals

Sam's goal for Transform Writing is to have a bit of a side-hustle running in the background as he pursues his full-time career.

He expected for it to take a bit of time to ramp up customer acquisition, so I wanted to build him something that would be inexpensive to maintain but also scale with his growth.

You can read more about the [tech stack](#tech-stack), but I believe the tools that I used to build it is the most optimized, high-quality suite that can be assembled to meet his needs.

## Results

I could write about what I think, but I'd rather just let you know what Sam had to say:

> "During the initial stages of Transform Writing's formation, we encountered challenges with three different website developers who were unable to handle the complexity of the project. I approached Jake with our concerns and inquired whether our expectations for the website were unreasonable.
>
> <br/> Transform Writing is a platform for students to submit their written assignments for proofreading and light editing. Each student must have an account that provides a private upload portal for their documents. The Transform administrators must be able to download the submitted documents and return the proofed version to the respective students.
> <br/><br/> In addition, the website needed a clean and user-friendly interface that would enable first-time customers to navigate easily while enjoying an appealing page design and layout.
>
> <br/><br/> After carefully evaluating the project's requirements, Jake assured me that he could complete the project without any issues. Moreover, he proposed modifications to key functionalities that made the administrative process more efficient.
>
> <br/><br/> For instance, before Jake's revisions, Transform's administrators were required to access each student's account separately to verify submissions and upload/download the relevant documents. However, Jake suggested a more streamlined approach by designing an admin page that consolidates allsubmissions. The administrators can download the documents from a single admin page, eliminating the need to interact with hundreds of account pages.
>
> <br/><br/> Furthermore, Jake established a notification system for both students and Transform's administrators. Students receive updates through customizable text messages or emails, while the admin team receives notifications in their Slack channel whenever a new submission appears in the system. This is a significant breakthrough as it eliminates the need for periodic manual checks, especially since Transform guarantees 24-hour turnaround times to its customers.
>
> <br/><br/> Throughout the development process, Jake proactively sought our input and feedback, which enabled us to make timely revisions and course corrections as required.
>
> <br/><br/> The final product is a remarkable asset to our company, offering unparalleled convenience and efficiency, enhancing customer experience, and maintaining our reputation among existing clients.
>
> <br/><br/> We are confident that Jake will excel in handling similarly complex projects, and we will undoubtedly consult him for any future website development requirements."
> <br/><br/> &mdash; <cite>Samuel Broadbent, Founder of Transform Writing</cite>

## Tech stack

- TypeScript
- SvelteKit
- Supabase
- TailwindCSS
- Stripe
- SendGrid
- Twilio
- Vitest
- Playwright
- Github Actions
- Vercel

I intentionally picked the tech stack I wanted to build [Leadgeek v2](./leadgeek-v2) in. The knowledge and experience I gained on Transform Writing was directly transferrable to being able to create Leadgeek v2 relatively quickly.

### TypeScript and SvelteKit

Prior to working on this project, I had just scrapped a Chrome extension that I had written with Svelte. My goals for that project had changed, so I didn't publish my work on it; however, I fell in love with building things with this extremely modern and succinct framework.

When Sam mentioned that his current developer wasn't working out, I offered to help him. I thought it would be a good opportunity to learn SvelteKit and provide a more polished product than he was expecting to receive by hiring another developer.

While SvelteKit is an amazing tool, and I would use it for any new production project _now_, it probably wasn't the right pick _then_. I write more about why in [hindsight](#hindsight).

### Supabase

I hadn't built a project with Supabase before, but I chose it for 3 reasons:

1. I wanted to learn relational databasing
2. I wanted to offload handling auth
3. It was talked up like crazy by other devs in the community

In the end, I'm really glad I got some experience with it. I think I would choose it for almost every side-project in the future.

### SendGrid and Twilio

One of Sam's asks was to have email and SMS notifications for clients and admins when a submitted document was updated. I hadn't worked with either of these services before, but I knew they were pretty much the industry-standard for their respective notification methods.

Their API is easy to pick up and the documentation is great.

## Overview

// progressively loading images
// security with docs
// affordable while scalable

## Showcase

### Product

<Lightbox description="The home page's hero section">
    <img alt="The home page's hero section" src="./index-hero.jpg" />
</Lightbox>

<Lightbox description="The home page's pricing section">
    <img alt="The home page's pricing section" src="./index-pricing-compare.jpg" />
</Lightbox>

<Lightbox description="The home page's FAQ section">
    <img alt="The home page's FAQ section" src="./index-faq-footer.jpg" />
</Lightbox>

<Lightbox description="The sign up page">
    <img alt="The sign up page" src="./sign-up.jpg" />
</Lightbox>

<Lightbox description="The sign in page">
    <img alt="The sign in page" src="./sign-in.jpg" />
</Lightbox>

<Lightbox description="The submission page">
    <img alt="The submission page" src="./submission.jpg" />
</Lightbox>

### Settings

<Lightbox description="The profile page">
    <img alt="The profile page" src="./profile.jpg" />
</Lightbox>

<Lightbox description="The billing page">
    <img alt="The billing page" src="./billing.jpg" />
</Lightbox>

<Lightbox description="The security page">
    <img alt="The security page" src="./security.jpg" />
</Lightbox>

## Hindsight

## Wrapping up

This project was an amazing experience to be able to build a rock-solid design system from the ground up. I can't state enough how much it allowed me to be able to iterate on [Leadgeek v2](./leadgeek-v2) faster than I should have been able.

I'm also glad Sam was pleased with the finished product. I expect to maintain this code base to some degree in the future to create additional features and landing pages.

Recently, I ported a lot of the code I wrote in this project into a Next.js starter called [Graphene](./graphene). Now, I'm working on a React Native app powered by GPT-3 called [Doom Scheme](./doom-scheme).
