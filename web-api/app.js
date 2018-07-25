const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
var swStats = require('swagger-stats');

// Routes from '.api/routes
const routes = require('./api/routes/index');

const global_db = mongoose.connect('mongodb://node-api:node-api@node-rest-api-xpense-shard-00-00-4rwxc.mongodb.net:27017,node-rest-api-xpense-shard-00-01-4rwxc.mongodb.net:27017,node-rest-api-xpense-shard-00-02-4rwxc.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-api-xpense-shard-0&authSource=admin&retryWrites=true', { useNewUrlParser: true });

// const global_db = mongoose.connect('mongodb://localhost:27017/xpense-logger-db', { useNewUrlParser: true });

// Swagger stats for api statistics
app.use(swStats.getMiddleware());

// Logs every incoming requests on the console
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Add CORS Security
app.use(cors({
    origin: '*',
    credentials: false
}));

app.use((res, req, next) => {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }
    next();
});

// Middlewares that handle the Routes
app.use('/users', routes.users);
app.use('/categories', routes.categories);
app.use('/expenses', routes.expenses);

// Handles every request that reaches this line
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Handles error
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;