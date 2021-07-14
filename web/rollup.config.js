import { terser } from "rollup-plugin-terser";

export default {
    input: "./src/js/main.js",
    output: [{
        file: "dist/assets/js/min.js",
        format: "iife",
        sourcemap: true,
        plugins: [terser()],
    }, ],
};