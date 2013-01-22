/*jslint browser: true */
define([
    "jquery",
    "lodash",
    "backbone",

    "plugins/backbone.layoutmanager",
    "plugins/bootstrap"
],

function($, _, Backbone) {
    'use strict';

    var app = {
        root: "/"
    };

    var JST = window.JST = window.JST || {};

    Backbone.LayoutManager.configure({
        paths: {
            layout: "app/templates/layouts/",
            template: "app/templates/"
        },

        fetch: function(path) {
            path = path + ".html";

            if (!JST[path]) {
                $.ajax({
                    url: app.root + path,
                    async: false
                }).then(function(contents) {
                    JST[path] = _.template(contents);
                });
            }

            return JST[path];
        }
    });

    return _.extend(app, {
        module: function(additionalProps) {
            return _.extend({ Views: {} }, additionalProps);
        },

        useLayout: function(name) {
            if (this.layout && this.layout.options.template === name) {
                return this.layout;
            }

            if (this.layout) {
                this.layout.remove();
            }

            var layout = new Backbone.Layout({
                template: name,
                className: "layout " + name,
                id: "layout"
            });

            $("#main").empty().append(layout.el);

            layout.render();

            this.layout = layout;

            return layout;
        },

        user: {
            id: $('#user-name').data('id'),
            name: $('#user-name').text(),
            avatar: $('#user-avatar').prop('src'),
            provider: $('#user-avatar').next('i').prop('class')
        }
    }, Backbone.Events);

});
