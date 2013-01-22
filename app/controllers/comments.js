module.exports = function (app, auth) {
    'use strict';

    var sanitize = require('validator').sanitize;

    //create comment
    app.post('/api/posts/:id/comments', auth.requiresLogin, function (req, res) {
        Post.findById(req.params.id, function (error, post) {
            if (error) {
                return res.json(error);
            }

            User.findById(req.user._id, function (error, user) {
                var comment;

                if (error) {
                    return res.json(error);
                }

                comment = {
                    body: req.body.body,
                    user: req.user.name
                };

                post.comments.push(comment);

                post.save(function (error) {
                    if (!error) {
                        return res.json(comment);
                    } else {
                        return res.json(error, 500);
                    }
                });
            });
        });
    });

};