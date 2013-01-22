define([
    'app',

    'lodash',
    'backbone',

    'modules/chat/views'
],
function(app, _, Backbone, Views) {
    'use strict';

    var Chat = app.module();

    Chat.Message = Backbone.Model.extend({
        sync: function () {
            return false;
        }
    });

    Chat.Conversation = Backbone.Collection.extend({
        model: Chat.Message
    });

    Chat.User = Backbone.Model.extend({
        sync: function () {
            return false;
        }
    });

    Chat.UsersList = Backbone.Collection.extend({
        model: Chat.User
    });

    Chat.Views = Views;

    return Chat;

});
