const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res) => {
    res.render('home');
})

router.get('/accepted/:id/:amount/:currency', (req, res) => {
    res.render('accepted', {
        id: req.params.id,
        amount: req.params.amount,
        currency: req.params.currency
    });
})

// Simpler version of handling a get request for the /accepted page.
//
// router.get('/accepted/:id', (req, res) => {
//     res.render('accepted', {
//         id: req.params.id,
//         amount: null,
//         currency: null
//     });
// })

router.post('/initiatePayment', (req, res) => {
    const totalToCharge = req.body.total;
    // Router can readfile() to subsequently check prices and quantities with the backend at this point.
    fs.readFile('items.json', (error, itemsData) => {
        if (error) {
            console.log(error);
            res.status(500).end()
        } else {
            const itemsJSON = JSON.parse(itemsData);
            // Router can hypothetically check prices and quantities with the backend at this point.
            // Code to do this would go here. However such code is superfluous for this demo.
            let transactionInitialisationStatus = 'bad';
            if (totalToCharge %2 !== 0) { 
            // Hypothetical acceptance criterion... note that prettypay will have already excluded zero or less.
                transactionInitialisationStatus = 'good'
            }
            res.json({
                transactionInitialisationStatus: transactionInitialisationStatus,
                message: `Parent directory's routes.js: Fictional purchase successfully initiated by server; total charge of ${totalToCharge}`,
                totalToCharge: totalToCharge
            })
        }
    })
})

// Not in use, but below is an example of how a basic route could work for Prettypay.postTransaction();
//
// router.post('/prettypay_post', (req, res) => {
//     const transaction = req.body.transaction;
//     console.log('/prettypay_post receiving Prettypay.postTransaction() data at parent router')
//     console.log(transaction);
//     res.end();
// })

module.exports = router;
