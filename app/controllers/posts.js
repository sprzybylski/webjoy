module.exports = function (app, auth) {
    'use strict';

    var sanitize = require('validator').sanitize;

    //create post
    app.post('/api/posts', auth.requiresLogin, function (req, res) {
        var post;

        User.findById(req.user._id, function (err, user) {
            post = new Post({
                body: sanitize(req.body.body).xss(),
                user: user,
                comments: []
            });

            post.save(function (error) {
                if (!error) {
                    return res.json(post);
                } else {
                    return res.json(error, 500);
                }
            });
        });
    });

    //update post
    app.put('/api/posts/:id', auth.requiresLogin, function (req, res) {
        Post.findById(req.params.id, function (error, post) {
            if (JSON.stringify(post.user._id) == JSON.stringify(req.user._id)) {
                post.body = sanitize(req.body.body).xss();

                post.save(function (error) {
                    if (!error) {
                        return res.json(post);
                    } else {
                        return res.json(error, 500);
                    }
                });
            } else {
                return res.json({
                    error: 'You don\'t have permisson to edit this post.'
                }, 500);
            }
        });
    });

    //list all posts
    app.get('/api/posts', auth.requiresLogin, function (req, res) {
        Post.find(function (error, posts) {
            if (!error) {
                return res.json(posts);
            } else {
                return res.json(error, 500);
            }
        });
    });

    //list post
    app.get('/api/posts/:id', auth.requiresLogin, function (req, res) {
        Post.findById(req.params.id, function (error, post) {
            if (!error) {
                return res.json(post);
            } else {
                return res.json(error, 500);
            }
        });
    });

    //delete all posts
    app.delete('/api/posts', auth.requiresAdmin, function (req, res) {
        Post.remove(function (error) {
            if (!error) {
                return res.json({success: 'All posts have been deleted.'});
            } else {
                return res.json(error, 500);
            }
        });
    });

    //delete post
    app.delete('/api/posts/:id', auth.requiresLogin, function (req, res) {
        Post.findById(req.params.id, function (error, post) {
            if (JSON.stringify(post.user._id) == JSON.stringify(req.user._id)) {
                Post.remove({_id: req.params.id}, function (error, post) {
                    if (!error) {
                        return res.json(post);
                    } else {
                        return res.json(error, 500);
                    }
                });
            } else {
                return res.json({
                    error: 'You don\'t have permisson to remove this post.'
                }, 500)
            }
        });
    });
};