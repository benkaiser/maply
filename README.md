## Maply - Glympse for your browser
### Realtime location sharing in the browser

See a live demo at [maply.kaiserapps.com](http://maply.kaiserapps.com).

You'll want to create a room either by visiting that page and entering it, or appending your room onto the url like so: http://maply.kaiserapps.com/myroom

Once your friend joins you'll both be able to see each other's location!

![screenshot_20160113-182119_small](https://cloud.githubusercontent.com/assets/608054/12314184/75ff3572-ba23-11e5-8f5f-182133b47dd4.png)

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
