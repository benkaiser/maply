## Installation

Dependencies: postgres

Installing the project node modules:

```
npm install
```

Setting up postgres (make sure you already have a postgres user in your username):

```
createdb maply
```

Then run the server once with a special flag to sync the db:

```
npm run syncdb
```

## Running

```
npm start
```
