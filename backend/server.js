'use strict';

const express = require('express');
const cors = require('cors');

const { isObjectIdValid, ObjectId } = require('./src/db')

const inventory = require('./routes/inventory');

const app = express();

app.use(express.json());
app.use(cors());

// handle body parser errors 
app.use((err, req, res, next) => {
    if (err) {
        if (err instanceof SyntaxError &&
            err.status >= 400 && err.status < 500 &&
            err.message.indexOf('JSON')) {
                return res.status(400).send('Badly Formatted JSON Request');
        }
        else {
            return res.status(500).send('Server Error');
        }
    }
    return next();
})

// handle object id errors
app.use((req, res, next) => {
    if (req.body._id) {
        if (!isObjectIdValid(req.body._id)) {
            return res.status(400).send('Invalid inventory item id');
        }
        res.locals.id = new ObjectId(req.body._id)
    }
    return next();
})

// handle any generic internal server errors
app.use((err, req, res, next) => {
    if (err) {
        if (err instanceof Error && err.message.indexOf('ObjectId')) {
            return res.status(400).send('Invalid inventory item');
        }
        console.error(err);
        return res.status(500).send('Internal server error');
    }
    return next();
})

app.use('/inventory', inventory);

app.listen(5000);