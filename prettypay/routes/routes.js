const express = require('express');
const router = express.Router();
const fs = require('fs');
const { 
    matchPreprocessingData, 
    recordTransaction, 
    checkCardExpiry, 
    generateUUID, 
    formatNumberToString,
    preprocessData,
    prepareData,
} = require('../javascripts/utils.js');

router.post('/preprocess', function(req, res) {
    const currentTransaction = req.body;
    const uniqueTransactionToken = generateUUID();
    currentTransaction.uniqueTransactionToken = uniqueTransactionToken;
    fs.readFile('./prettypay/records/inProgress.json', function(error, dataInFile) {
        if (error) {
            console.log(error);
        } else {
            try {
                preprocessData(currentTransaction, dataInFile);
            } catch (error) {
                fs.writeFile('./prettypay/records/inProgress.json', '[]', (err) => {
                    if (err) throw err;
                })
                try {
                    fs.readFile('./prettypay/records/inProgress.json', function(error, dataInFile) {
                        if (error) {
                            console.log(error);
                        } else {
                            preprocessData(currentTransaction, dataInFile);
                        }
                    })
                } catch (error) {
                    console.log(error);
                }
            }
        }
    });
    res.status(200).json({ uniqueTransactionToken: uniqueTransactionToken });
})

router.post('/process', function(req, res) {
    const abortMessage = 'Fictional purchase aborted by Prettypay backend with status 403 (forbidden)';
    const currency = req.body.currency;
    const amountToProcess = parseFloat(req.body.amountToProcess);
    const uniqueTransactionToken = req.body.uniqueTransactionToken;
    const responseObject = {
        time: new Date(),
        successful: false,
        currency: currency,
        amountToProcess: amountToProcess,
        uniqueTransactionToken: uniqueTransactionToken,
        contactName: req.body.contactName,
        contactEmail: req.body.contactEmail,
        customerMessage: ''
    };

    if (amountToProcess <= 0) {
        responseObject.devMessage = `${abortMessage}: total charge of ${req.body.bodyamountToProcess} is not greater than zero.`;
        responseObject.customerMessage = `The total charge of ${req.body.bodyamountToProcess} is not greater than zero.`;
        recordTransaction(responseObject);
        res.status(401).json(responseObject);
    } else if (isNaN(amountToProcess)) {
        responseObject.devMessage = `${abortMessage}: ${req.body.bodyamountToProcess} cannot be processed as an amount.`;
        responseObject.customerMessage = `Error: Prettypay has not received a recognisable amount to process.`;
        recordTransaction(responseObject);
        res.status(401).json(responseObject);
    } else if (checkCardExpiry(req.body.expiryString) !== 'good') {
        responseObject.devMessage = `${abortMessage}: Expiry received: ${req.body.expiryString}; ${checkCardExpiry(req.body.expiryString)}`;
        responseObject.customerMessage = `${checkCardExpiry(req.body.expiryString)}`;
        recordTransaction(responseObject);
        res.status(401).json(responseObject);
    } else if (req.body.currency === '€') {
        responseObject.devMessage = `${abortMessage}: Euro transactions forbidden.`;
        responseObject.customerMessage = '<p style="text-align: center">Prettypay does not accept euros.<br>🇬🇧&nbsp;God Save the Queen!&nbsp;🇬🇧</p>';
        recordTransaction(responseObject);
        res.status(401).json(responseObject);
    } else if (matchPreprocessingData(uniqueTransactionToken, currency, amountToProcess) === 'discrepancy') {
        const discrepancyMessage = 'There appears to be a discrepancy between amount & currency data received at preprocessing and corresponding data received at processing. You may wish to try again.'
        responseObject.devMessage = `${abortMessage}: ${discrepancyMessage}`;
        responseObject.customerMessage = `${discrepancyMessage}`;
        recordTransaction(responseObject);
        res.status(401).json(responseObject);
    } else if (matchPreprocessingData(uniqueTransactionToken, currency, amountToProcess) === 'idError') {
        responseObject.devMessage = `${abortMessage}: There does not seem to be a transaction with this unique identity recorded at the backend as having been initiated.`;
        responseObject.customerMessage = `There appears to be a problem with the transaction. You may wish to try again.`;
        recordTransaction(responseObject);
        res.status(401).json(responseObject);
    } else {
        responseObject.successful = true; // Very important line!
        responseObject.devMessage = `Successful fictional purchase processed by Prettypay backend; total charge of ${amountToProcess}.`;
        responseObject.customerMessage = `Amount debited: ${req.body.currency} ${formatNumberToString(req.body.amountToProcess)}<br><br><small>Transaction reference:<br>${uniqueTransactionToken}<small>`;
        responseObject.amountDebited = [amountToProcess, req.body.currency];
        recordTransaction(responseObject);
        res.status(200).json(responseObject);
    }
})

router.get('/report', function(req, res) {
    let dataToReport = prepareData('transactions.json');
    let nontransDataToReport = prepareData('nontransactions.json');

    res.render(require('path').resolve(__dirname, '..') + '/views/report.ejs', { 
        dataToReport: dataToReport,
        nontransDataToReport: nontransDataToReport
    });
    // __dirname would go from this routes directory, 
    // while (require('path').resolve(__dirname, '..') gives me the directory above.
})

module.exports = router;
