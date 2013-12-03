/**
 * Application for the new event form page
 */
(function($, window, undefined){

    var app = function($eventsWrapper) {
        this.$wrapper = $eventsWrapper;

        this.initialize();
    };

    $.extend(app.prototype, {
        initialize: function() {
            console.log(this.$wrapper);
            this.$wrapper.on('submit', '.js-event-form', $.proxy(this._handleFormSubmit, this));
        },

        _handleFormSubmit: function(e) {
            e.preventDefault();
            var $form = $(e.currentTarget);
            var $wrapper = $form.parent();

            $.ajax({
                // cute little hack to get the JSON version
                url: $form.attr('action')+'.json',
                type: 'POST',
                data: $form.serialize(),
                success: function(data) {
                    if (data.success) {
                        window.location = data.redirect_url;
                    } else {
                        $wrapper.html(data.form);
                    }
                }
            });
        }
    });

    window.NewEventApp = app;

})(jQuery, window);