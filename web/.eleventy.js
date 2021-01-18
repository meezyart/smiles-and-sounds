const util = require('util');
const { DateTime } = require("luxon");
const { promisify } = require("util");
const fs = require("fs");
const hasha = require("hasha");
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginNavigation = require('@11ty/eleventy-navigation');
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);
const execFile = promisify(require("child_process").execFile);
const GA_ID = require("./src/_data/metaData.js").googleAnalyticsId;


const filters = require('./src/utils/filters.js')
const transforms = require('./src/utils/transforms.js')
const shortcodes = require('./src/utils/shortcodes.js')
const iconsprite = require('./src/utils/iconsprite.js')

module.exports = function(eleventyConfig) {

    // Plugins
    eleventyConfig.addPlugin(pluginRss)

    // eleventyConfig.addPlugin(localImages, {
    //     distPath: "dist",
    //     assetPath: "/img/remote",
    //     selector: "img,amp-img,amp-video,meta[property='og:image'],meta[name='twitter:image'],amp-story",
    //     verbose: false,
    // });

    eleventyConfig.addPlugin(require("./_11ty/img-dim.js"));
    eleventyConfig.addPlugin(require("./_11ty/json-ld.js"));
    // eleventyConfig.addPlugin(require("./_11ty/optimize-html.js"));
    eleventyConfig.addPlugin(require("./_11ty/apply-csp.js"));


    // Filters
    Object.keys(filters).forEach((filterName) => {
        eleventyConfig.addFilter(filterName, filters[filterName])
    })

    // Transforms
    Object.keys(transforms).forEach((transformName) => {
        eleventyConfig.addTransform(transformName, transforms[transformName])
    })

    // Shortcodes
    Object.keys(shortcodes).forEach((shortcodeName) => {
        eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName])
    })


    // eleventyConfig.addLayoutAlias("post", "layouts/post.njk");
    eleventyConfig.addNunjucksAsyncFilter("addHash", function(
        absolutePath,
        callback
    ) {
        readFile(`dist${absolutePath}`, {
                encoding: "utf-8",
            })
            .then((content) => {
                return hasha.async(content);
            })
            .then((hash) => {
                callback(null, `${absolutePath}?hash=${hash.substr(0, 10)}`);
            })
            .catch((error) => callback(error));
    });

    async function lastModifiedDate(filename) {
        try {
            const { stdout } = await execFile("git", [
                "log",
                "-1",
                "--format=%cd",
                filename,
            ]);
            return new Date(stdout);
        } catch (e) {
            console.error(e.message);
            // Fallback to stat if git isn't working.
            const stats = await stat(filename);
            return stats.mtime; // Date
        }
    }
    // Cache the lastModifiedDate call because shelling out to git is expensive.
    // This means the lastModifiedDate will never change per single eleventy invocation.
    const lastModifiedDateCache = new Map();
    eleventyConfig.addNunjucksAsyncFilter("lastModifiedDate", function(
        filename,
        callback
    ) {
        const call = (result) => {
            result.then((date) => callback(null, date));
            result.catch((error) => callback(error));
        };
        const cached = lastModifiedDateCache.get(filename);
        if (cached) {
            return call(cached);
        }
        const promise = lastModifiedDate(filename);
        lastModifiedDateCache.set(filename, promise);
        call(promise);
    });

    eleventyConfig.addFilter("encodeURIComponent", function(str) {
        return encodeURIComponent(str);
    });

    // Icon Sprite
    // eleventyConfig.addNunjucksAsyncShortcode('iconsprite', iconsprite)


    eleventyConfig.addFilter("debug", function(value) {
        return util.inspect(value, { compact: false })
    });

    eleventyConfig.addFilter("readableDate", dateObj => {
        return new Date(dateObj).toDateString()
    });

    eleventyConfig.addFilter("readableDate2", (dateObj) => {
        return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
            "dd LLL yyyy"
        );
    });


    // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    eleventyConfig.addFilter('htmlDateString', (dateObj) => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
    });

    let markdownIt = require("markdown-it");
    let markdownItAnchor = require("markdown-it-anchor");
    let options = {
        html: true,
        breaks: true,
        linkify: true
    };
    let opts = {
        permalink: true,
        permalinkClass: "direct-link",
        permalinkSymbol: "#"
    };

    eleventyConfig.setLibrary("md", markdownIt(options)
        .use(markdownItAnchor, opts)
    );

    eleventyConfig.addFilter("markdownify", function(value) {
        const md = new markdownIt(options)
        return md.render(value)
    })

    eleventyConfig.addShortcode(
        'debug',
        (value) =>
        `<pre style="padding: 100px 0; font-size: 14px; font-family: monospace;">${JSON.stringify(
          value,
          null,
          2,
        )}</pre>`,
    )

    // watch targets

    eleventyConfig.addWatchTarget("./src/_data");
    eleventyConfig.addWatchTarget("./src/templates");
    eleventyConfig.addWatchTarget("./src/utils");
    eleventyConfig.addWatchTarget("./_11ty");

    eleventyConfig.addPassthroughCopy({ './src/assets': '/assets' })
    eleventyConfig.addPassthroughCopy({ './src/_headers': '/_headers' })


    // Browsersync Overrides
    eleventyConfig.setBrowserSyncConfig({
        callbacks: {
            ready: function(err, browserSync) {
                const content_404 = fs.readFileSync("./dist/404/index.html");

                browserSync.addMiddleware("*", (req, res) => {
                    // Provides the 404 content without redirect.
                    res.write(content_404);
                    res.end();
                });
            },
        },
        ui: false,
        ghostMode: false,
    });

    eleventyConfig.setDataDeepMerge(true);

    return {
        templateFormats: [
            "md",
            "njk",
            "html",
            "liquid"
        ],

        // If your site lives in a different subdirectory, change this.
        // Leading or trailing slashes are all normalized away, so don’t worry about it.
        // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
        // This is only used for URLs (it does not affect your file structure)
        pathPrefix: "/",

        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk",
        passthroughFileCopy: true,
        dir: {
            input: 'src/templates',
            data: '../_data',
            includes: 'includes',
            layouts: 'layouts',
            output: "dist"
        }
    };
}
11
