# Map Treasure Hunt

![Build Status](https://img.shields.io/badge/stage-pre--alpha-red.svg)
[![License](https://img.shields.io/badge/licence-MIT-green.svg)](https://packagist.org/packages/laravel/framework)

A treasure hunt game with google maps integration. Unlike other online treasure hunt games, it does not relay only on map or questions. It uses both. Players need to answer questions to get a location clue which they will need to find in google maps to find more questions and more clue.

## Requirements
- PHP > 5.5.9
- Composer
- Gulp
- npm

## Installation
1. Clone the repository.
2. Run `composer install`
3. Run `npm install`
4. Run `gulp --production`
5. Rename _.env.example_ to _.env_ and edit the content to match your configuration.
6. Make the directory _storage_ writable.
7. Run `php artisan key:generate`
8. Run `php artisan migrate`


## License
The Map Treasure Hunt is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
