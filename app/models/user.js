var exports = module.exports = everyauth = require('everyauth'),
    exports = module.exports = mongooseAuth = require('mongoose-auth'),
    Promise = everyauth.Promise,
    UserSchema = new mongoose.Schema({}),
    User;

everyauth.debug = true;

UserSchema.add({
    name: String,
    provider: String,
    avatar: String,
    created_at: {
        'type' : Date,
        'default' : Date.now
    }
});

UserSchema.plugin(mongooseAuth, {
    everymodule: {
        everyauth: {
            User: function () {
                'use strict';
                return User;
            }
        }
    },
    facebook: {
        everyauth: {
            myHostname: config.host,
            appId: config.facebook.appId,
            appSecret: config.facebook.appSecret,
            redirectPath: '/',
            findOrCreateUser: function (
                session,
                accessToken,
                accessTokExtra,
                fbUser
            ) {
                'use strict';

                var promise = this.Promise(),
                    User = this.User()();

                User.findOne({'fb.id': fbUser.id}, function (err, foundUser) {
                    var user;

                    if (err) {
                        return promise.fail(err);
                    }

                    if (foundUser) {
                        return promise.fulfill(foundUser);
                    }

                    user = new User({
                        name: fbUser.name,
                        provider: 'facebook',
                        avatar: 'http://graph.facebook.com/' +
                            fbUser.username + '/picture',
                        fb: {
                            id: fbUser.id,
                            accessToken: accessToken,
                            username: fbUser.username
                        }
                    });

                    user.save(function (err, savedUser) {
                        promise.fulfill(savedUser);
                    });
                });

                return promise;
            }
        }
    },
    twitter: {
        everyauth: {
            consumerKey: config.twitter.consumerKey,
            consumerSecret: config.twitter.consumerSecret,
            redirectPath: '/',
            findOrCreateUser: function (
                session,
                accessToken,
                accessTokenSecret,
                twitUser
            ) {
                'use strict';

                var promise = this.Promise(),
                    User = this.User()();

                User.findOne({'twit.id': twitUser.id}, function (err, foundUser) {
                    var user;

                    if (err) {
                        return promise.fail(err);
                    }

                    if (foundUser) {
                        return promise.fulfill(foundUser);
                    }

                    user = new User({
                        name: twitUser.name,
                        provider: 'twitter',
                        avatar: twitUser.profile_image_url,
                        twit: {
                            id: twitUser.id,
                            accessToken: accessToken,
                            username: twitUser.username
                        }
                    });

                    user.save(function (err, savedUser) {
                        promise.fulfill(savedUser);
                    });

                });

                return promise;
            }
        }
    }
});

exports = module.exports = User = mongoose.model('User', UserSchema);