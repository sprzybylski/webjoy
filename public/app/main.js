/*jslint browser: true */
require([
    "app",

    'jquery',
    'backbone',

    'router'
],
function(app, $, Backbone, Router) {
    'use strict';

    app.router = new Router();

    Backbone.history.start({ pushState: false, root: app.root });

    $(document).on("click", "a:not([data-bypass])", function(event) {
        var href = $(this).attr("href");

        if (href && href.indexOf("#") === 0) {
            event.preventDefault();

            Backbone.history.navigate(href, true);
        }
    });
});
