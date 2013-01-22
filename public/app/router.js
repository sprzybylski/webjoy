define([
    'app',

    'jquery',
    'lodash',
    'backbone',

    'modules/chat',
    'modules/wall',

    'io'
],

function(app, $, _, Backbone, Chat, Wall, io) {

    'use strict';

    var Router = Backbone.Router.extend({
        routes: {
            '': 'index',
            'chat': 'chat',
            '*actions': 'index'
        },

        index: function () {
            $('.options li.wall').addClass('active')
                .siblings().removeClass('active');

            Backbone.LayoutManager.configure({
                append: function(root, el) {
                    $(root).prepend(el);
                }
            });

            if (!app.wall) {
                app.wall = {};

                app.wall.posts = new Wall.Posts();
            }

            app.useLayout('wall').setViews({
                'form': new Wall.Views.Form({
                    collection: app.wall.posts
                }),

                '.posts': new Wall.Views.Posts({
                    collection: app.wall.posts
                })
            }).render();

            app.wall.posts.fetch();
        },

        chat: function () {
            $('.options li.chat').addClass('active')
                .siblings().removeClass('active');

            Backbone.LayoutManager.configure({
                append: function(root, el) {
                    $(root).append(el);
                }
            });

            if (!app.chat) {

                app.chat = {};

                app.chat.conversation = new Chat.Conversation();
                app.chat.usersList = new Chat.UsersList();

                app.socket = io.connect();

                app.socket.on('connect', function () {
                    app.socket.emit('connected', app.user);
                });
            }

            app.useLayout('chat').setViews({
                'form': new Chat.Views.Form({
                    collection: app.chat.conversation
                }),

                '.conversation': new Chat.Views.Conversation({
                    collection: app.chat.conversation
                }),

                '.users-list': new Chat.Views.UsersList({
                    collection: app.chat.usersList
                })
            }).render();
        }
    });

    return Router;
});