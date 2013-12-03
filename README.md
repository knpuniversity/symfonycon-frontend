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