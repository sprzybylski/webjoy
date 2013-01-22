exports.requiresLogin = function (req, res, next) {
    'use strict';

    if (!req.loggedIn) {
        return res.json({
            error: 'Please login to do that'
        });
    } else {
        next();
    }
};

exports.requiresAdmin = function (req, res, next) {
    'use strict';

    //TODO add admin flag to User
    if (req.user.name !== 'Szymon Przybylski') {
        return res.json({
            error: 'You are not authorized to do that.'
        });
    } else {
        next();
    }
};