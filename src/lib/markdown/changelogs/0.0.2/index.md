---
createdAt: 2023-4-04T18:00:00Z
description: null
hidden: false
image: changelogs/v0.0.2.jpg
keywords: []
isFeatured: false
isIndexed: true
repository: null
site: null
summary: Back to building
tag: technical
title: v0.0.2
updatedAt: null
---

<script>
    // components
    import CTA from "$components/layout/item/CTA.svelte"
    import Lightbox from "$components/utilities/Lightbox.svelte"
    import Link from "$components/utilities/Link.svelte"
</script>

I've been chipping away at <Link href="https://github.com/jake-hatfield/doom-scheme" isExternal isUnderlined title="Doom Scheme"/>. I'm not under any pressure to release this, as I don't really expect to monetize it and it's a purely personal project. So, I'd like for it to be a pretty polished app when I publish it. That said, the work I did today to kick things off was pretty broad-strokes.

## Added

- A README to the repo
- _Rough_ wireframes in Figma for most major screens of the app

<Lightbox description="Figma wireframes">
    <img alt="Figma wireframes" src="./wireframes.jpg" />
</Lightbox>

## Updated

- The profile screen in the app with static data. Previously it was just a screen that displayed "Profile."

<Lightbox description="Profile screen">
    <img alt="Profile screen" src="./profile.jpg" />
</Lightbox>

<CTA/>
