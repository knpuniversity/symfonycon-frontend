SymfonyCon: JavaScript like a Frontend Developer
================================================

Well hello there! This is the example project used in the SymfonyCon 2013
presentation called "Cool like Frontend Developer: Grunt, RequireJS, Bower and other Tools".

This highlights some real-word usage of:

1. Require.js
1. Compass
1. Uglify
1. Grunt

See the **Installation** section or the **What to Look for** section that
explains what you should expect to see and where.

### Installation

1. Install the Composer vendors (download Composer first from http://getcomposer.org)

```
php composer.phar install
```

Follow the instructions at the end to make sure that you have the parameters.yml
file setup.

2. Make sure you DB is present and populated!

```
php app/console doctrine:database:create
php app/console doctrine:schema:create
php app/console doctrine:fixtures:load
```

3. Make sure you have node and npm installed and setup. If you do, the following
2 commands should work"

```
node -v
npm -v
```

4. Use npm to install bower, compass and grunt-cli

```
sudo npm install -g bower
sudo npm install -g compass
sudo npm install -g grunt-cli
```

5. Download the bower dependencies:

```
bower install
```

This should give you a populated `web/assets/vendor` directory.

6. Download the local node dependencies:

```
npm install
```

This should give you a `node_modules` directory.

7. Use grunt to initially compile the SASS files

```
grunt
```

Later, when you're actually developing, you'll use grunt to watch for file
changes and automatically re-compile:

```
grunt watch
```

8. Start up a web server and view it:

```
php app/console server:run
```

Then go to:

```
http://localhost:8000
```

### What to Look for

Once you have the app running, if you login as `admin:admin`, you'll see
the following JavaScript items:

1) a little edit button on the homepage for each event which allows inline editing.
2) When adding a new event, you'll see that the form is AJAX-submitted.
3) When adding a new event, if you click the map, its border changes colors.

All of these are driven by JavaScript included by Require.js. See the `::base.html.twig`
file as well as the `EventBundle::_requirejs.html.twig` file and notes.
Or, just watch the darn presentation :p.

Compass is also used - the SASS files are located at `web/assets/sass` and
compiled to `web/assets/css`.