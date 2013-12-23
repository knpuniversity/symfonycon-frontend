/**
 * The default module that's run on every page
 */
define(['jquery', 'domReady!'], function ($, doc) {
    // simple functionality to change the border color when clicking the map
    $('.event-show article .map-container').on('click', function() {
        var isGreen = $(this).data('green');

        if (isGreen) {
            $(this).css('border-color', '#ffffff');
        } else {
            $(this).css('border-color', '#e1ff9a');
        }
        $(this).data('green', !isGreen);
    });
});
