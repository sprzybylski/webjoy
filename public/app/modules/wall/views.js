define([
    'app',

    'lodash',
    'backbone'
],
function (app, _, Backbone) {
    var Views = {};

    Views.Form = Backbone.View.extend({
        template: 'wall/form',

        tagName: 'form',

        events: {
            'submit': 'submit'
        },

        submit: function (evt) {
            evt.preventDefault();

            var input = this.$el.find('input'),
                body = input.val();

            this.collection.create({body: body}, {
                wait: true,
                success: function () {
                    $('#alert').removeClass('alert-error').find('span.text')
                        .html('<strong>Successfully</strong> added a post.')
                        .end().addClass('alert-success').slideDown('normal', function () {
                            var self = this;
                            setTimeout(function () {
                                $(self).slideUp('normal');
                            }, 1500);
                        });

                    input.val('');
                },
                error: function () {
                    $('#alert').removeClass('alert-success').find('span.text')
                        .html('Adding post <strong>failed</strong>.')
                        .end().addClass('alert-error').slideDown('normal', function () {
                            var self = this;
                            setTimeout(function () {
                                $(self).slideUp('normal');
                            }, 1500);
                        });
                }
            });
        }

    });

    Views.Posts = Backbone.View.extend({
        tagName: 'ul',

        render: function(manage) {
            this.collection.each(function (post) {
                this.renderPost(post);
            }, this);

            return manage(this).render();
        },

        initialize: function () {
            this.collection.on('reset', function () {
                this.render();
            }, this);

            this.collection.on('add', function (post) {
                this.renderPost(post);
            }, this);
        },

        renderPost: function (post) {
            this.insertView(new Views.Post({
                model: post
            })).render();
        }
    });

    Views.Post = Backbone.View.extend({
        template: 'wall/post',

        tagName: 'li',

        events: {
            'click .close': 'removePost',
            'click .show-comments': 'showComments',
            'submit form': 'submitComment'
        },

        serialize: function () {
            return {
                id: this.model.id,
                body: this.model.get('body'),
                comments: this.model.get('comments'),
                created_at: moment(this.model.get('created_at')).fromNow(),
                user: this.model.get('user')
            };
        },

        initialize: function () {
           this.model.on('change', function () {
                this.render();
            }, this);

            this.model.on('destroy', function () {
                this.remove();
            }, this);
        },

        removePost: function (evt) {
            evt.preventDefault();

            this.model.destroy({
                wait: true,
                success: function () {
                    $('#alert').removeClass('alert-error').find('span.text')
                        .html('<strong>Successfully</strong> removed a post.')
                        .end().addClass('alert-success').slideDown('normal', function () {
                            var self = this;
                            setTimeout(function () {
                                $(self).slideUp('normal');
                            }, 1500);
                        });
                },
                error: function () {
                    $('#alert').removeClass('alert-success').find('span.text')
                        .html('Removing post <strong>failed</strong>.')
                        .end().addClass('alert-error').slideDown('normal', function () {
                            var self = this;
                            setTimeout(function () {
                                $(self).slideUp('normal');
                            }, 1500);
                        });
                }
            });
        },

        submitComment: function (evt) {
            var commentsContainer, postId, body;

            evt.preventDefault();

            commentsContainer = $('#comments');
            postId = commentsContainer.find('form').data('postId');
            body = commentsContainer.find('input').val();

            $.ajax({
                type: 'POST',
                url: '/api/posts/' + postId + '/comments',
                data: {
                    body: body
                },
                success: function (data) {
                    commentsContainer.find('input').val('');

                    $('[data-post-id="' + postId +'"]')
                        .parent().find('ul').append(
                            '<li>' +
                                '<strong>' + data.user + '</strong>:' +
                                '<br />' +
                                '<p>' + data.body + '</p>' +
                            '</li>'
                        );
                }
            });
        },

        showComments: function (evt) {
            evt.preventDefault();

            var top = this.$el.offset().top,
                width = $('#comments').width(),
                left = $('#comments').css('margin-left'),
                comments = $(this.$el.find('.comments').clone().removeClass('hidden')[0]);

            console.log(left);

            $('#comments').find('.icon-circle-arrow-left')
                .css('left', '-' + left).css('top', top - 20);

            $('#comments').removeClass('hidden')
                .find('.well').width(width - 40).css('top', (top - 60)  + 'px');

            $('#comments .well').html(comments.html());

            $('#comments form').on('submit', this.submitComment);
        }
    });

    return Views;
});