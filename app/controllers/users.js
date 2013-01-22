module.exports = function (app, auth) {
    'use strict';

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};
