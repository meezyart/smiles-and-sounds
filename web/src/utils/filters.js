const { DateTime } = require('luxon');
const CleanCSS = require("clean-css");



module.exports = {
    // https://www.11ty.io/docs/quicktips/inline-css/
    cssmin: function(code) {
        return new CleanCSS({}).minify(code).styles;
    },


    dateToFormat: function(date, format) {
        return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat(
            String(format)
        )
    },

    dateToISO: function(date) {
        return DateTime.fromJSDate(date, { zone: 'utc' }).toISO({
            includeOffset: false,
            suppressMilliseconds: true
        })
    },

    obfuscate: function(str) {
        const chars = []
        for (var i = str.length - 1; i >= 0; i--) {
            chars.unshift(['&#', str[i].charCodeAt(), ';'].join(''))
        }
        return chars.join('')
    }
}