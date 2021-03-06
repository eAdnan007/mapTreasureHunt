var elixir = require('laravel-elixir');
/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    mix.sass('app.scss', 'htdocs/asset/css');
    mix.copy('node_modules/bootstrap-sass/assets/fonts', 'htdocs/asset/fonts');
    mix.copy('node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js', 'htdocs/asset/js/');
    mix.copy('node_modules/jquery/dist/jquery.min.js', 'htdocs/asset/js/');
    mix.scripts('app.js', 'htdocs/asset/js/');
    mix.scripts('game.js', 'htdocs/asset/js/');
    mix.scripts('game-admin.js', 'htdocs/asset/js/');

    mix.browserSync({
        proxy: 'treasurehunt.sites.dev'
    });
});
