---
title: Colophon
description: Details about how this site is built
date: 2025-09-24
tags:
draft: false
---
_Colophon_ is a $10 word to describe providing details of the publication process. It has a long history in [print](<https://en.wikipedia.org/wiki/Colophon_(publishing)>), but has been evolved to be a convention used by [websites](https://indieweb.org/colophon) as well, where it's often one of many [slash pages](https://slashpages.net).

## History

I've had this domain since 2001, when I received it as a gift from [my Dad](https://rudy.ca). This site has been online since then. I used to write on it a lot in the early days of the web. But then various life, career, and family things happened (as they are wont to do) and it was parked with a placeholder for many years.

It also fell prey to the cycle of "I'm gonna start writing! Better redesign my site first" → fiddle endlessly with the styling and code → never actually post anything → lol. I've repeated this more times than I can count.

## Philosophy

I am, for the moment, keeping the design minimal. There are many reasons for this, but it's mostly intending to serve as a gentle reminder/nudge to myself on my priorities. Will this work? Who knows.

First, I want to focus on expressing things via writing, not styling. The temptation to bring my design experience to bear here is real, but that can be done elsewhere. This design is by no means [original](https://deadsimplesites.com), and I'm not even going to worry about doing minimalism "properly". I have features I want to add (eg webmentions, indieweb cards) but those really only make sense if I keep writing.

I also love the technical side, and want to focus on that here too.

- A simple design means easier templates and CSS to jump back into.
- Using [OS default typography](https://modernfontstacks.com) helps performance and keeps the bytes you need to download low.
- The [rule of least power](https://adactio.com/journal/14327) is a philosophy that always bears repeating. 
- I want a reminder that what I'm looking at when I design this site is likely *not* what you're seeing. You might be using another OS, have browser overrides, be reading in RSS, maybe I cross-post to a newsletter, maybe I [POSSE](https://indieweb.org/POSSE) this to who knows where, maybe I get wacky and do something with [Gopher](https://en.wikipedia.org/wiki/Gopher_(protocol)) or [Gemini](https://en.wikipedia.org/wiki/Gemini_(protocol)).
- This site cares about your privacy and will not track you via analytics or anything similar.
  
## Technology

This site is built using [11ty](11ty.dev), a simple static site generator that processes Markdown files. I also use a handful of plugins for a bit nicer default typography:

- [eleventy-plugin-typography](https://github.com/jamshop/eleventy-plugin-typography) (a wrapper around [typogr.js](https://github.com/ekalinin/typogr.js)) adds `<spans>` for better handling of widows, orphans, ordinals, smallcaps, etc
- [markdown-it-mark](https://github.com/markdown-it/markdown-it-mark) allows text to be marked for nice highlights
- [markdown-it-abbr](https://github.com/markdown-it/markdown-it-abbr) allows usage of the HTML `<abbr>` tag
- [markdown-it-link-attributes](https://github.com/crookedneighbor/markdown-it-link-attributes) allows attributes like classname/target to be added to link elements
- [markdown-it-sub](https://github.com/markdown-it/markdown-it-sub) allows usage of the HTML `<sub>` tag (H2O) and [markdown-it-sup](https://github.com/markdown-it/markdown-it-sup) the `<sup>` tag (19th day of 2nd month)
- [markdown-it-admonition](https://github.com/docarys/markdown-it-admonition) enables easy creation of “callout” style boxes

I code everything by hand in `vim` ([dotfiles](codeberg.org/dlimeb/dotfiles) for the curious).

I also extracted a bunch of CSS I keep using into a lightweight personal framework I called [CSSium](https://github.com/dlimeb/cssium), because of course I did.

The code for this site is stored on [GitHub](https://github.com/dlimeb/dieter.ca), which is set to automatically deploy to [Netlify](https://www.netlify.com) upon a commit to the `main` branch. Netlify also checks and reports on my [Lighthouse](https://developers.google.com/web/tools/lighthouse) score. This setup is quite frictionless, which I need. But I'm also in the process of extracting myself from big tech companies, especially where I'm on a free *I am the product* tier, which is the case for both of the above. I'll eventually switch to a VPS, where for bonus points I can also focus on green hosting.