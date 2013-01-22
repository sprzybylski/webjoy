var express = require('express'),
    fs = require('fs'),
    yamlConfig = require('yaml-config'),
    auth = require('./authorization'),
    settings = require('./settings'),
    modelsPath = __dirname + '/app/models',
    modelFiles = fs.readdirSync(modelsPath),
    controllersPath = __dirname + '/app/controllers',
    controllerFiles = fs.readdirSync(controllersPath),
    port,
    app;

//globals
config = yamlConfig.readConfig('config/app.yml');
User = {};

//setting up connection to mongodb
require('./db-connect');

//bootstrap models
modelFiles.forEach(function (file) {
    'use strict';

    if (file == 'user.js') {
        User = require(modelsPath + '/' + file);
    } else {
        require(modelsPath + '/' + file);
    }
});

//booting app
app = express.createServer();

settings.boot(app);

//bootstrap controllers
controllerFiles.forEach(function (file) {
    'use strict';

    require(controllersPath + '/' + file)(app, auth);
});

//loading chat module
require('./app/modules/chat')(app);

app.get('/', function (req, res) {
    'use strict';

    if (req.loggedIn) {
        res.render('index', {layout: false, user: req.user});
    } else {
        res.render('login', {layout: false});
    }
});

mongooseAuth.helpExpress(app);

everyauth.helpExpress(app, {userAlias: 'current_user'});

port = process.env.PORT || 8080;

app.listen(port);