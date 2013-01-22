var express = require('express'),
    MongoStore = require('connect-mongodb'),
    everyauth = require('everyauth');

exports.boot = function (app) {
    'use strict';

    app.configure(function () {
        app.use(express.static(__dirname + '/public'));
        app.set('views', __dirname + '/app/views');
        app.set('view engine', 'ejs');
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.cookieParser());
        app.use(express.session({
            secret: config.session.secret,
            store: new MongoStore({
                url: config.db.url,
                collection : 'sessions'
            })
        }));
        app.use(mongooseAuth.middleware());
    });

    app.configure('development', function () {
        app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
    });
};