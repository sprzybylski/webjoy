define([
    'app',

    'lodash',
    'backbone',

    'modules/wall/views'
],
function (app, _, Backbone, Views) {
    var Wall = app.module();

    Wall.Post = Backbone.Model.extend({
        url: function () {
            var base = '/api/posts';

            if (this.isNew()) {
                return base;
            }

            return base + '/' + this.id;
        },

        idAttribute: '_id'
    });

    Wall.Posts = Backbone.Collection.extend({
        url: '/api/posts',

        model: Wall.Post,

        comparator: function (post) {
            var time = new Date(post.get('created_at'));
            return time.getTime();
        }
    });

    Wall.Views = Views;

    return Wall;
});
