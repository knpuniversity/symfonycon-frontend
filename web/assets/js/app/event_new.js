/**
 * Module that's included on the "new event" page
 */
define(['jquery', 'domReady!', 'app/modules/event_new_form'], function ($, doc, EventNewForm) {
    var eventsNew = new EventNewForm($('.event-edit'));
});
