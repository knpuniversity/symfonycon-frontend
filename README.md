NOTES
=====

Bower
-----

- sudo npm install -g bower
- create the .bowerrc
    {
      "directory": "web/components"
    }
- bower init
- bower install bootstrap --save
- included that stuff

RequireJS
---------
- use bower to get requirejs
- create a new template we can include that will bring in require js,
    load in common.js, then require our real page
- this error is caused by bring in some AMD-ish module manually
    Mismatched anonymous define() module: function setup
  In our case, jquery.blockUI was being brought in manually, and it was
  using define() to add itself as a module. But, I believe you can't do
  this - it's being brought in too early (or something)
- bower install requirejs-domready --save
- organized things into pages and modules

Optimization
------------

- npm --init
- npm install requirejs --save-dev
- create a build.js file
    - common.js is special, because it doesn't have any dependencies to
        read - we're basically abusing it
- ./node_modules/.bin/r.js -o app/config/build.js
- temporarily added a path to js-built inside Twig
- added more items to common.js beyond just jQuery
- optimized a single page
- changed the baseUrl to load the compiled stuff correctly

Grunt
-----

- sudo npm install -g grunt-cli
- added the grunt dependencies to package.json
    "grunt": "~0.4.2",
    "grunt-contrib-jshint": "~0.6.3",
    "grunt-contrib-nodeunit": "~0.2.0",
    "grunt-contrib-uglify": "~0.2.2"
- brought in the base Gruntfile.js, which just uses uglify
- running grunt -v
- added jshint to grunt
    grunt jshint -v
- realized that all (many?) tasks have sub-parts
    grunt uglify:foo
    grunt jshint:test

    These would look for the "foo" and "test" keys under each config. These
    function like separate config "profiles".
- npm install grunt-contrib-requirejs --save-dev

Compass
-------

- grab bootstrap-sass via bower
- install compass via npm
    - sudo npm install -g compass
    --> check this
- compile manually
    compass compile --css-dir=web/assets/compiled --sass-dir=web/assets/vendor/sass-bootstrap/lib

QQ) How did it know to only compile bootstrap.scss? Is it because all the
    other files start with an undescore?