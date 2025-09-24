---
title: Obsidian as blog admin
description: How to configure Obsidian to create blog posts easily
date: 2025-09-23
tags:
  - writing
  - obsidian
draft: false
---
As I'm fiddling with my [homelab](/homelab/) and trying to post more here, it occurred to me to see if [Obsidian](https://obsidian.md) can be used as a lightweight blog admin frontend to remove some friction. This entire site is [code I can work with](https://github.com/dlimeb/dieter.ca), but oddly seeing *writing* in my editor is a disjoint --- I keep fighting with linting, autocomplete, syntax highlighting, etc and I don't want/need to.

[Obsidian Sync](https://obsidian.md/sync) exists if you want no friction and to support the team financially to boot. But if that's not a fit and you have a similar setup to mine -- your blog uses a Markdown-based static site generator, is a repo checked out on your local machine, and you publish with `git commit` -- it turns out getting started was pretty straightforward. These instructions are a bit specific to [Eleventy](https://11ty.dev0) but the principles should be similar for other engines. (This is not a new idea, BTW; others have posted similar things elsewhere.) 

## Create vault

First, create a new vault in Obsidian. Open the vault menu and choose `Manage vaults`. Don't create a new vault from scratch, but instead `Open folder as vault` and select the root folder of your blog's repo (eg mine is `~/code/dieter.ca`). This will create a new vault using that folder's name, and should open and display your repo's files in Obsidian's file tree navigator.

This will also create a new hidden `.obsidian` folder in your blog repo, where Obsidian will store its config. Add that to your repo's `.gitignore` if you don't want to commit it.

## Basic config

Since this vault is just for writing posts and each vault has its own config, you can now set up Obsidian for just that usecase (on top of whatever you like for themes, core settings, hotkeys, etc). Things I set:

- Turn *on* spellchecking. In other vaults I dislike it, but it's helpful here.
- Turn *off* most core plugins. I really only need Command palette, File recovery, Files, Quick switcher, and Search. But of course you have all community plugins at your disposal to build the blog admin of your dreams.
- In Settings > Files and links > 
	- In *Excluded files*, add any repo directories you don't want Obsidian to see. For example, I added `node_modules` because IIRC Obsidian would show any Markdown files from there in search results.
	- You probably want to point Obsidian to the subdirectory of your repo where new notes should go. For me this is `/content/posts`. Set Default location for new notes (In the folder specified below) and Folder to create new notes in (content/notes)
	- Turn *off* Use Wikilinks (see below)

Run your local SSG server however you do (`npm run start` for me). Then you can go `cmd-n` in Obsidian and give it a filename and some content. That should create a file where your SSG expects it, your server will rebuild if it does hot-reloading, and you can see that new post in your browser. Nice! (If you type more content, you'll see your server dutifully reloading every few keystrokes as Obsidian auto-saves. Thanks for workin' so hard lil' buddy.)

## Blogging config

We can improve this a bit with templates. 

We first need to create a directory for Obsidian to store templates in. This needs to be in the vault/repo so I created an `_obs` directory (IIRC it won't see anything in the `.obsidian` directory). 

Obsidian has a built-in templates plugin, but we'll need some features that the [Templater](https://silentvoid13.github.io/Templater/) community plugin provides, so install that instead and disable the former.

Then we can make a template to use when creating new blog posts. The nice thing about both Obsidian and 11ty using YAML frontmatter is we can have a setup that makes both happy. Here's my new post template:

```yaml
<%*
let title = tp.file.title
if (title.startsWith("Untitled")) {
  title = await tp.system.prompt("Title");
}
await tp.file.rename(title)
-%>
---
title: <% title %>
description:
date: <% tp.date.now("YYYY-MM-DD") %>
tags:
draft: true
---

```

The javascript at the beginning makes Obsidian open a dialog to prompt for a title, and then renames the file accordingly. Then you can put whatever YAML you need for your blogging setup, and take advantage of Templater features to fill in or calculate whatever, as I'm doing with `date`. I also set `draft` true by default, which allows me to see this locally but prevents accidentally publishing WIP on the deployed build.

Then, in Templater settings:

- Point its Template folder location to whatever you made above
- Enable Trigger Templater on new file creation
- Enable Enable folder templates and click Add new template
- Set the folder to wherever your posts go (`content/posts` for me) and select the template you created (`_obs/templates/Blog post.md` for me)

You should now be able to `cmd-n` in Obsidian again, but this time get prompted for a title --- if I enter "Hello world", I end up with `content/posts/Hello world.md` and Obsidian gives me a blank page. Now just type your post!

With the SSG YAML above displayed as [Properties](https://help.obsidian.md/properties), we have nice UI widgets to enter data, and can use things like the Tags view in the sidebar to see all tags used across the site.

Depending on how your SSG templates are set up, you may want/need to fiddle further. For example, I turned off Obsidian's "Show inline title" setting because my templates use the `title` property instead of me needing to put `# Hello world` in the markdown itself.

## Publish

For now I still pop into a terminal to publish. The `Hello world.md` file is sitting untracked. If it's good to go, I simply:

```bash
git add content/posts/Hello world.md
git ci -m "Publish post"
git push
```

(I do all that against `main` instead of creating a branch, bc yolo.)

This is a bit manual, but it's fast and has the benefit of decoupling writing from publishing. I can create new post(s) arbitrarily and stub them in, and then just leave them untracked for later. So long as I'm careful not to use `git add .` I won't commit/publish them accidentally, and the `draft` prop is an extra safeguard.


## Enhancements

This is a very workable system for now, but below are a couple other things to consider.

**Publishing:** Theoretically I could also use a [Templater user script](https://silentvoid13.github.io/Templater/user-functions/script-user-functions.html) to keep everything inside Obsidian. I'll punt that to the maybe-later pile.

**Additional post types:** Right now this just handles blog posts upon `cmd-n`. It's easy to extend this to create other types of pages (eg maybe a regular non-blog page, or a specific type of blog post with preset tags). That would involve creating additional templates, handling the default new note location, and then using the [QuickAdd](https://quickadd.obsidian.guide/docs/) plugin to create named processes and assign them to a hotkey.

**Images:** For my current setup, including images is a teensy bit clunky. I need to add images by entering a string like `<img eleventy:widths="[widths]" src="[path]" alt="[text]" />` into markdown. I created another template to make inserting that easy, and set Obsidian's location for new attachments to a different directory (`content/images`).

**Filenames:** If you don't like the new file being named directly from the title you enter --- maybe you want to specify your a different filename, or munge it to `hello-world-<whatever>.md` --- then you'll want to fiddle with the title handling js in the template.

**Linking:** Right now if you type `[[` you'll get Obsidian's file autocomplete popup to pick what to link to. With "Use Wikilinks" enabled, that will net you `[[Hello world]]`, which isn't parseable and will output as-is. With that *disabled*, you get `[Hello world](Hello%20world.md)`. This does work for me in the built HTML output, because of the [InputPath to URL plugin](https://www.11ty.dev/docs/plugins/inputpath-to-url/) added in Eleventy `3.0.0`.  But what *might* be preferable in the source Markdown is `[Hello world](/hello-world/)`. There are a bunch of ways to think about or handle this, I'm not doing anything with Obsidian backlinking or plugins, URL setups may intersect 11ty's `permalink` prop or other internals, and webserver rewriting ([Pretty URLs](https://docs.netlify.com/build/post-processing/overview/) for Netlify) is also in here somewhere. I'm leaving as-is for now.

 

