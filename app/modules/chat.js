module.exports = function (app) {
    'use strict';

    var io = require('socket.io').listen(app),
        sanitize = require('validator').sanitize,
        users = {};

    io.sockets.on('connection', function (socket) {

        socket.on('connected', function (user) {
            var msg;

            socket.user = user;

            users[user.id] = user;

            io.sockets.emit('user-joined', user);

            socket.emit('users-list', users);

            msg = {
                time: new Date(),
                content: socket.user.name + ' has joined'
            };

            io.sockets.emit('message', msg);
        });

        socket.on('disconnect', function () {
            var msg;

            io.sockets.emit('user-left', socket.user.id);

            msg = {
                time: new Date(),
                content: socket.user.name + ' has left'
            };

            io.sockets.emit('message', msg);

            delete users[socket.user.id];
        });

        socket.on('message', function (msg) {
            msg.time = new Date();
            msg.content = sanitize(msg.content).xss();
            io.sockets.emit('message', msg);
        });
    });
};