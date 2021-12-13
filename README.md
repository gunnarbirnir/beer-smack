# BeerSmack

BeerSmack is an interactive beer tasting app.

## Prerequisites

You must have [node](https://nodejs.org) and [yarn](https://yarnpkg.com) installed. To connect to the database you must have the appropriate keys in a _.env_ file in the root of the project.

## Commands

`yarn start` Run the site locally.

`yarn deploy` Publish a new version of the site.

`yarn add-beer` Adds a beer to _beers.json_. The command accepts two arguments and one flag. By default the first argument is the [atvr](https://www.vinbudin.is/) ID of the beer, which tries to fetch the relevant information from the site. The second argument is the output file. The -e flag enables _empty mode_, so the first argument will be interpreted as the number of empty beers to add. If no arguments are provided one empty beer will be added to _beers.json_.

`yarn clear-beers` Clears _beers.json_. An argument can be provided to specify another file to clear.

`yarn download-beers` Download beers from the specified room. The first argument is the room code.

`yarn create-room` Create a new room. You will be prompted about the code, title and whether or not the tasting is blind. You will also have to provide a json file with the beers, _beers.json_ is the default.

`yarn update-room` Update an existing room. The first argument to this command is the room code. You will again be prompted about the title, blindness and a beer file.

`yarn reset-room` Reset the state of the room. All users and scores will be deleted. The first argument is the room code.
