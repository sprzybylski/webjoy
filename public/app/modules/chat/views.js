define([
    'app',

    'lodash',
    'backbone',

    'plugins/moment'
],
function (app, _, Backbone, moment) {
    'use strict';

    var Views = {};

    Views.User = Backbone.View.extend({
        template: 'chat/user',

        tagName: 'li',

        serialize: function() {
            return {
                name: this.model.get('name'),
                avatar: this.model.get('avatar'),
                provider: this.model.get('provider')
            };
        },

        initialize: function() {
            this.model.on('change', function() {
                this.render();
            }, this);

            this.model.on('destroy', function() {
                this.remove();
            }, this);
        }

    });

    Views.UsersList = Backbone.View.extend({
        tagName: 'ul',

        render: function(manage) {
            this.collection.each(function(user) {
                this.insertView(new Views.User({
                    model: user
                }));
            }, this);

            return manage(this).render();
        },

        initialize: function() {
            this.$el.prop('class', 'nav nav-list');

            var collection = this.collection;

            app.socket.removeAllListeners('users-list');
            app.socket.on('users-list' , function (users) {
                var filtred = _.filter(users, function (user) {
                    return user.id !== app.user.id;
                });

                collection.add(filtred);
            });

            app.socket.removeAllListeners('user-joined');
            app.socket.on('user-joined', function(user) {
                if (user.id !== app.user.id) {
                    collection.create(user);
                }
            });

            app.socket.removeAllListeners('user-left');
            app.socket.on('user-left', function (userId) {
                var user = collection.get(userId);

                collection.remove(user);
            });

            this.collection.on('remove', function() {
                this.render();
            }, this);

            this.collection.on('add', function(user) {
                this.insertView(new Views.User({
                    model: user
                })).render();
            }, this);
        }
    });

    Views.Message = Backbone.View.extend({
        template: 'chat/message',

        tagName: 'li',

        serialize: function () {
            var time = this.model.get('time');

            return {
                userName: this.model.get('userName'),
                time: moment(time).format('HH:mm'),
                content: this.model.get('content')
            };
        },

        initialize: function () {
           this.model.on('change', function() {
                this.render();
            }, this);

            this.model.on('destroy', function() {
                this.remove();
            }, this);
        }
    });

    Views.Form = Backbone.View.extend({
        template: 'chat/form',

        events: {
            'keypress input': 'sendOnEnter',
            'click button': 'sendOnClick'
        },

        sendOnClick: function (event) {
            var input = this.$el.find('input');

            event.preventDefault();

            this.sendMessage(input);
        },

        sendOnEnter: function (event) {
            var input = this.$(event.target);

            if (event.keyCode !== 13) {
                return;
            }

            event.preventDefault();

            this.sendMessage(input);
        },

        sendMessage: function (input) {
            var msg = {
                content: input.val(),
                userName: app.user.name
            };

            app.socket.emit('message', msg);

            input.val('');
        }
    });

    Views.Conversation = Backbone.View.extend({
        tagName: 'ul',

        render: function(manage) {
            this.collection.each(function(msg) {
                this.insertView(new Views.Message({
                    model: msg
                }));
            }, this);

            return manage(this).render();
        },

        initialize: function () {
            var collection = this.collection;

            app.socket.removeAllListeners('message');
            app.socket.on('message', function (msg) {
                collection.create(msg);
            });

            this.collection.on('add', function(msg) {
                this.insertView(new Views.Message({
                    model: msg
                })).render();
            }, this);
        }

    });

    return Views;
});