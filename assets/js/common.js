/**
 * The main requirejs configuration (except for baseUrl)
 *
 * This file is included in ::_requirejs.html.twig and in Gruntfile.js. The
 * baseUrl is not here so we can dynamically vary it in ::_requirejs.html.twig
 */
requirejs.config({
    paths: {
        /**
         * Paths are relative to baseUrl, which should be set before including
         * this file to the web/assets directory.
         */
        domReady: '../vendor/requirejs-domready/domReady',
        /**
         * Things like this only work because the library has code in it to
         * detect if require.js is present, and manually register the module
         * if it is. Normally, if a library you're including doesn't support
         * AMD, you will likely need a paths entry and also an entry in
         * shim (beyond what you see for the bootstrap shim).
         */
        jquery: '../vendor/jquery/jquery.min',
        bootstrap: '../vendor/bootstrap/dist/js/bootstrap.min'
    },
    shim: {
        /**
         * bootstrap does not support AMD. This means that require.js doesn't
         * now that jquery needs to be downloaded first, before bootstrap.
         * This accomplishes this.
         *
         * Unlike most modules, we don't actually care about receiving some
         * sort of "bootstrap" object, we simply require the "bootstrap"
         * module so that all of its jQuery plugins are available. If we
         * needed to capture some sort of return object (like the $ in jQuery,
         * except that it fortunately supports AMD), we would need to do
         * a little more work here.
         */
        bootstrap: ['jquery']
    }
});
