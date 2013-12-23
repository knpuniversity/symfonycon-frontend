/**
 * A module that returns an object that can be used to allow JavaScript saving
 * of the new event form. Used by event_new.js
 */
define(['jquery', 'bootstrap'], function ($) {
    var app = function($eventsWrapper) {
        this.$wrapper = $eventsWrapper;

        this.initialize();
    };

    $.extend(app.prototype, {
        initialize: function() {
            this.$wrapper.on('submit', '.js-event-form', $.proxy(this._handleFormSubmit, this));
        },

        _handleFormSubmit: function(e) {
            e.preventDefault();
            var $form = $(e.currentTarget);
            var $wrapper = $form.parent();

            // cute/simple loading: http://dotnetspeak.com/2013/05/creating-simple-please-wait-dialog-with-twitter-bootstrap
            var $pleaseWaitDiv = $('<div class="modal fade" id="pleaseWaitDialog" data-backdrop="static" data-keyboard="false"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h1>Processing...</h1></div><div class="modal-body"><div class="progress progress-striped active"><div class="progress-bar" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: 100%;"></div></div></div></div></div></div>');
            $pleaseWaitDiv.modal();

            var save = function() {
                $.ajax({
                    // cute little hack to get the JSON version
                    url: $form.attr('action')+'.json',
                    type: 'POST',
                    data: $form.serialize(),
                    success: function(data) {
                        if (data.success) {
                            $pleaseWaitDiv.find('h1').text('Saved!');

                            // delay slightly before redirecting
                            setTimeout(function() {
                                window.location = data.redirect_url;
                            }, 1000)
                        } else {
                            $wrapper.html(data.form);
                            $pleaseWaitDiv.modal('hide');
                        }
                    }
                });
            };
            // delay it a little so you can see the saving screen
            setTimeout(save, 1000);
        }
    });

    return app;
});
