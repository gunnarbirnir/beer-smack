# BeerSmack

BeerSmack is an interactive beer tasting app.

## Prerequisites

You must have [node](https://nodejs.org) and [yarn](https://yarnpkg.com) installed. To connect to the database you must have the appropriate keys in a _.env_ file in the root of the project.

## Commands

`yarn start` Run the site locally.

`yarn deploy` Publish a new version of the site.

`yarn add-beer` Adds a beer to _beers.json_. The command accepts two arguments and one flag. By default the first argument is the [atvr](https://www.vinbudin.is/) ID of the beer, which tries to fetch the relevant information from the site. The second argument is the output file. The -e flag enables _empty mode_, so the first argument will be interpreted as the number of empty beers to add. If no arguments are provided one empty beer will be added to _beers.json_.

`yarn clear-beers` Clears _beers.json_. An argument can be provided to specify another file to clear.
