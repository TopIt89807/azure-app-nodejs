// ----------------------------------------------------------------------------
// Copyright (c) 2015 Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var express = require('express'),
    bodyParser = require('body-parser'),
    
    router = express.Router();

// Retrieve all records in the specified category
router.get('/:category', (req, res, next) => {
    req.azureMobile.tables('items')
        .where({ category: req.params.category })
        .read()
        .then(results => res.json(results))
        .catch(next); // it is important to catch any errors and log them
});

// A simple API that constructs a record from the POSTed JSON
router.post('/:category/:id', bodyParser.json(), (req, res, next) => {
    var item = {
        category: req.params.category,
        id: req.params.id,
        content: JSON.stringify(req.body)
    };
            
    req.azureMobile.tables('items').insert(item)
        .then(() => res.status(201).send('Success!'))
        .catch(next);
});

module.exports = router;
