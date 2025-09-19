---
title: Homelab, summer 2025
description: The current state of my homelab
date: 2025-09-19
tags:
  - homelab
draft: true
---

Picking up from the [prelude](/homelab-prelude/), here's where my homelab is at as of late summer 2025.

## Hardware

The donated server motherboards I have are SuperMicro X10SLM-F or X9SCL+-F. They each have a 4-core Intel Xeon E3-1231 3.4GHz processor, and 32GB of DDR3 RAM. I also got a handful of misc 500GB - 2TB Western Digital hard disks.

These are now dated such that that I get they're no longer beefy enough to run a modern colo business from, so it makes sense to decommission them. And this was a generous donation to be sure; I feel very fortunate to have this stuff.

But on the other hand, it is driving me _absolutely bonkers_ that the economies of scale are such that it was probably not worth the colo owner's time to try and sell these boards. I needed to buy a [2U case](https://www.amazon.ca/RackChoice-MicroATX-Mini-ITX-Rackmount-Chassis/dp/B0CC2ZMC7M/ref=sr_1_7?dib=eyJ2IjoiMSJ9.IRLXVILpJCyx5bU5TM4HZ5IKd2BDA_2alrsovLunGHG6gOMtN0sSA37TrpjUJriwGM4_LV6cgy6K9kPiW6DCdV5FzK4o_fOmUPvxcBfyO2oAgUl0iRjTMMBW0vOWhjSmkodye30fJzOW5z_VzW0XC81GCm4J1gUsNGLNkeBAFcqXVvca7I1y0cj1FtXOKGlGjt5ox41_cb05eIWGsFoPYsN8xlzBMMSpprK1slhSI0ywvH3UN8OuX2qa4cg8Dm4lu3eRuElX-v4NjN_ZAGhWNGOLzrQ6Nsn3_PUQBxNT8ko.fZGyz4Tg0gWL6tbZawV4-nw5FJugpa4xp4BrGReDBLM&dib_tag=se&keywords=rackchoice&qid=1719372453&sr=8-7), a power supply, and 4 quiet [Noctua fans](https://noctua.at/en/nf-a8-pwm) to use them. For the same price as those parts you can find whole servers in your local marketplace app. So you don't even need the donation.

This is a weird and disappointing window, where we are drowning in hardware that is perfectly usable and _complete overkill_ for my usecase, but the previous owner was somehow rational in saying "meh, i was gonna toss em, you can have em if you want".

My product and design brain is chewing on what kind of opportunity this presents, but we're here to nerd out about homelab stuff.

Here's my current setup, sitting just to the left of my desk in my office. With the above-mentioned fans it's not noisy or distracting at all. I can hear a slight hum, about equivalent to the sound of crickets/wind/traffic coming through that window. And of course I love [das blinkenlights](https://en.wikipedia.org/wiki/Blinkenlights).

<img eleventy:widths="300,640,850" src="/images/homelab-in-rack.jpg" alt="A homemade server rack holding several servers, networking equipment, and an old monitor on top. The rack sits beside office desk storage, and in front of a window with visible trees outside" />

Top to bottom:

- Retro ThinkCentre monitor (found at the side of the road)
- Eero Pro 6E mesh wifi router (hardwired Cat6 into house)
- 5- and 8-port Netgear switches
- Frankenbox
- Empty spot where a Raspberry Pi Zero 2 W used to be (moved it indoors)
- Backup server
- Blank
- Main server

Feel free to poke fun at my good-enough-for-now cable management, and the 3D printed shelf that's not quite cutting it.

To keep this short, I'll put details on the other servers, networking, and the "rack" into separate posts, coming soon.

## Operating system

After briefly considering doing everything bare-metal on top of Debian, I landed on installing [Proxmox VE](https://www.proxmox.com/en/products/proxmox-virtual-environment/overview).

This is also somewhat ridiculous, as Proxmox is full of enterprise IT deployment features. The words "datacenter", "cluster", "distributed storage", and "high availability failover" belong _nowhere near_ what I'm doing.

But, you can just ignore all that. Proxmox was quite simple to install and get started with, and it makes spinning up VMs trivial to do. It also gives nice overviews of network and hardware utilization, and makes managing disks easier (I bought a 240GB SSD for Proxmox to live on, and configured 4 x 1TB drives into a 2.8TB RAID).

## Services

I'll spare you the details on my entire config (happy to share, though) and just summarize what I'm running at the moment.

Split across several VMs (each running Debian, with Docker and Portainer for easy installation and management) I have:

- [Docmost](https://docmost.com) --- Wiki/document sharing
- [Forgejo](https://forgejo.org) --- Project/issue tracker (not git hosting yet)
- [Opengist](https://opengist.io) --- Snippet storage
- [Miniflux](https://miniflux.app) --- RSS feed aggregator/reader
- [Jellyfin](https://jellyfin.org) --- Media server
- [Mafl](https://mafl.hywax.space) --- Dashboard
- [Calibre](https://calibre-ebook.com) --- E-book management
- [Radicale](https://radicale.org/) --- Contact & calendar management
- [Home Assistant](https://www.home-assistant.io) --- Smart home stuff (not really using)
- Raw SMB share to mount storage in Finder
- I briefly ran an LLM server with [Ollama](https://github.com/ollama/ollama) (worked fine as a POC, but inside an underpowered VM was of limited utility)

## Thoughts so far

I've been chipping away at this, very much on the side as a series of projects that occasionally drop off my radar, for probably a little over a year.

I'm not _fully_ running off this yet. There's more I want to do before it's usable and I feel confident, and I have a bunch of stuff to migrate and/or organize. But it's getting very close to that point.

My takeaways so far, FWIW:

This has been 90% really fun. It's great to be learning new skills, and reconnecting to and leveraging old ones. If only for the renewed sense of empowerment and possibility, it has been very worth it.

The remaining 10% is my awareness that I am, essentially, voluntarily acting a devops and network engineer, two whole entire separate jobs that most people consider _work_, for "fun". It does occasionally feel like why am I [cosplaying as a sysadmin](https://www.jeffgeerling.com/blog/2022/cosplaying-sysadmin)? Why am I doing _more work_ in my spare time? Why am I staring at a screen and a missing semicolon _again_? Maybe go outside for a bit? I am reminded that past this proof-of-concept point, there is not just work but risk and obligation. The idea of self-hosting feels empowering, if not rebellious, but to do it _for realz_ involves a lot more thought. This is probably a whole other post, but in the meantime, Drew Lyton's [The Future is NOT Self-Hosted](https://www.drewlyton.com/story/the-future-is-not-self-hosted/) is full of good things to consider.

But I'm not going to let that stop me, so don't let it stop you either. If you have some coding or command-line experience and can follow a decently-written "how to install x on y" article, then grab whatever spare bit of cheap or legacy hardware you can get your hands on and get started.
