const htmlmin = require('html-minifier');
const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItFootnote = require("markdown-it-footnote");
const markdownItMark = require("markdown-it-mark");
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const typographyPlugin = require("@jamshop/eleventy-plugin-typography");
const externalLinks = require('eleventy-plugin-external-links');
const path = require("path");
const eleventyImage = require("@11ty/eleventy-img");

module.exports = function(eleventyConfig) {
  // Define shortcode for Eleventy Image
  async function imageShortcode(src, alt, caption, sizes = "100vw") {
    if(alt === undefined) {
      throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
    }

    let captionHtml = (caption !== undefined) ? `<figcaption>${caption}</figcaption>` : "";
  
    let options = {
      widths: [300,600,1200],
      formats: ["webp", "jpeg"],
      urlPath: "/assets/images/",
      outputDir: "./dist/assets/images"
    }
    let file = "src/assets/images/" + src;

    eleventyImage(file, options);
    metadata = eleventyImage.statsSync(file, options);
  
    let lowsrc = metadata.jpeg[0];
    let highsrc = metadata.jpeg[metadata.jpeg.length - 1];
  
    return `<picture>
      ${Object.values(metadata).map(imageFormat => {
        return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
      }).join("\n")}
        <img
          src="${lowsrc.url}"
          width="${highsrc.width}"
          height="${highsrc.height}"
          alt="${alt}"
          loading="lazy"
          decoding="async">
        ${captionHtml}
      </picture>`;
  }
  // Add image shortcode
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  eleventyConfig.setUseGitIgnore(false);

  // Add plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(typographyPlugin);

  // Add filters
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("LLLL d, yyyy");
  });
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  // Watch our compiled assets for changes
  eleventyConfig.addWatchTarget('./src/compiled-assets/main.css');
  eleventyConfig.addWatchTarget('./src/compiled-assets/main.js');
  // eleventyConfig.addWatchTarget('./src/compiled-assets/vendor.js');

  // Copy src/compiled-assets to /assets
  eleventyConfig.addPassthroughCopy({ 'src/compiled-assets': 'assets' });
  // Copy all images
  eleventyConfig.addPassthroughCopy('src/assets/images');

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

  function filterTagList(tags) {
    return (tags || []).filter(tag => ["all", "nav", "article", "articles"].indexOf(tag) === -1);
  }

  eleventyConfig.addFilter("filterTagList", filterTagList)

  // Create an array of all tags
  eleventyConfig.addCollection("tagList", function(collection) {
    let tagSet = new Set();
    collection.getAll().forEach(item => {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    });

    return filterTagList([...tagSet]);
  });

  // Customize Markdown library and settings:
  let markdownLibrary = markdownIt({
    html: true,
    linkify: true,
    typographer: true
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: "after",
      class: "direct-link",
      symbol: "#"
    }),
    level: [1,2,3,4],
    slugify: eleventyConfig.getFilter("slugify")
  }).use(markdownItFootnote).use(markdownItMark);

  // strip [ and ] from footnote numbers
  markdownLibrary.renderer.rules.footnote_caption = (tokens, idx) => {
    let n = Number(tokens[idx].meta.id + 1).toString();
  
    if (tokens[idx].meta.subId > 0) {
      n += ":" + tokens[idx].meta.subId;
    }
  
    return n;
  };
  markdownLibrary.renderer.rules.footnote_block_open = (tokens, idx, options) => {
    return '<aside class="footnotes">\n' +
           '<h2>Footnotes</h2>\n' +
           '<ol class="footnotes-list">\n';
  };
  markdownLibrary.renderer.rules.footnote_block_close = () => {
    return '</ol>\n</aside>\n';
  };
  eleventyConfig.setLibrary("md", markdownLibrary);

  // Generate Atom XML feed
  eleventyConfig.addPlugin(pluginRss);

  // Process external links
  eleventyConfig.addPlugin(externalLinks, {
    name: 'external-links',         // Plugin name
    regex: /^(([a-z]+:)|(\/\/))/i,  // Regex that test if href is external
    target: "_blank",               // 'target' attribute for external links
    rel: "noopener",                // 'rel' attribute for external links
    extensions: [".html"],          // Extensions to apply transform to
    includeDoctype: true,           // Default to include '<!DOCTYPE html>' at the beginning of the file
  });


  if (process.env.ELEVENTY_ENV === 'production') {
    eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
      if (outputPath.endsWith('.html')) {
        const minified = htmlmin.minify(content, {
          collapseInlineTagWhitespace: false,
          collapseWhitespace: true,
          removeComments: true,
          sortClassName: true,
          useShortDoctype: true,
        });

        return minified;
      }

      return content;
    });
  }

  return {
    dir: {
      includes: '_includes',
      input: 'src',
      layouts: '_layouts',
      output: 'dist',
    },
    markdownTemplateEngine: 'njk',
    templateFormats: [
      'njk',
      'md',
    ],
  };
};
