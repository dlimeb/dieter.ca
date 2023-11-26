const { DateTime } = require("luxon");
const debug = require("debug")("dlimeb");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItFootnote = require("markdown-it-footnote");
const markdownItMark = require("markdown-it-mark");
var mila = require("markdown-it-link-attributes");
const typographyPlugin = require("@jamshop/eleventy-plugin-typography");

const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const pluginNavigation = require("@11ty/eleventy-navigation");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

const CleanCSS = require("clean-css");

const pluginDrafts = require("./eleventy.config.drafts.js");
const pluginImages = require("./eleventy.config.images.js");

module.exports = function(eleventyConfig) {
  // Copy the contents of the `assets` folder to the output folder
  // For example, `./assets/css/` ends up in `_site/assets/css/`
  // (Note this has been renamed; the eleventy-base-blog repo calls this `public`)
  eleventyConfig.addPassthroughCopy({
    "./assets/": "/assets/",
    // "./node_modules/prismjs/themes/prism-okaidia.css": "/assets/css/prism-okaidia.css"
  });

  // Run Eleventy when these files change:
  // https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

  // Watch content images for the image pipeline.
  eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

  // App plugins
  eleventyConfig.addPlugin(pluginDrafts);
  eleventyConfig.addPlugin(pluginImages);

  // Official plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    preAttributes: { tabindex: 0 }
  });
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(pluginBundle);

  // Other plugins
  eleventyConfig.addPlugin(typographyPlugin);

  // Filters
  eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
    // Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "LLLL d, yyyy");
  });

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    // dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if(!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if( n < 0 ) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  // Return the smallest number argument
  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  // Return all the tags used in a collection
  eleventyConfig.addFilter("getAllTags", collection => {
    let tagSet = new Set();
    for(let item of collection) {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    }
    return Array.from(tagSet).sort();
  });

  // Strip out internal 11ty tags
  eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
    return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
  });

  // Group sets of tags together corresponding to their first letter
  eleventyConfig.addFilter("groupedByLetter", function groupedByLetter(tags){
    const groupedByFirstLetter = tags.reduce((result, tag) => {
      const firstLetter = tag[0];

      // Check if there is already an object with the same letter in the result array
      const existingEntry = result.find(entry => entry.letter === firstLetter);

      // If there is, add the current tag to its 'tags' array
      if (existingEntry) {
        existingEntry.tags.push(tag);
      } else {
        // If not, create a new entry with the current letter and the current tag
        result.push({ letter: firstLetter, tags: [tag] });
      }

      return result;
    }, []);

    return (groupedByFirstLetter || []);
  });

  // Minify CSS
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Customize Markdown library settings:
  let markdownItOptions = {
    html: true,
    linkify: true,
    typographer: true,
  };
  let mdLib = markdownIt(markdownItOptions);

  const milaOptions = {
    matcher(href) {
      return href.match(/^https?:\/\//);
    },
    attrs: {
      target: "_blank",
      rel: "noopener"
    }
  };
  eleventyConfig.amendLibrary("md", mdLib => {
    mdLib
      .use(markdownItAnchor, {
        permalink: markdownItAnchor.permalink.ariaHidden({
          placement: "after",
          class: "header-anchor",
          symbol: "#",
          ariaHidden: false,
        }),
        level: [1,2,3,4],
        slugify: eleventyConfig.getFilter("slugify")
      })
      .use(markdownItFootnote)
      .use(markdownItMark)
      .use(mila, milaOptions);

    // strip [] from footnote numbers
    mdLib.renderer.rules.footnote_caption = (tokens, idx) => {
      let n = Number(tokens[idx].meta.id + 1).toString();
      if (tokens[idx].meta.subId > 0) {
        n += ":" + tokens[idx].meta.subId;
      }
      return n;
    };

    // update HTML used in footnotes list
    mdLib.renderer.rules.footnote_block_open = (tokens, idx, options) => {
    return '<aside class="footnotes">\n' +
           '<h2>Footnotes</h2>\n' +
           '<ol class="footnotes-list">\n';
    };
    mdLib.renderer.rules.footnote_block_close = () => {
      return '</ol>\n</aside>\n';
    };
  });

  eleventyConfig.setLibrary("md", mdLib);



  // Features to make your build faster (when you need them)

  // If your passthrough copy gets heavy and cumbersome, add this line
  // to emulate the file copy on the dev server. Learn more:
  // https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

  // eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid",
    ],

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",

    // These are all optional:
    dir: {
      input: "content",          // default: "."
      includes: "../_includes",  // default: "_includes"
      layouts: "../_includes/layouts",
      data: "../_data",          // default: "_data"
      output: "_site"
    },

    // -----------------------------------------------------------------
    // Optional items:
    // -----------------------------------------------------------------

    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

    // When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
    // it will transform any absolute URLs in your HTML to include this
    // folder name and does **not** affect where things go in the output folder.
    pathPrefix: "/",
  };
};
