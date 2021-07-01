/*eslint-disable */
const mix = require('laravel-mix');

mix.js('public/src/app.js', 'public/dist/app.js')
    .css('public/src/style.css', 'public/dist/style.css')
    .options({
        processCssUrls: false
    })
    
