const fs = require('fs'); // Without this, "ReferenceError: fs is not defined"

function matchPreprocessingData(id, currency, amountToProcess) {
    const dataInFile = fs.readFileSync('./prettypay/records/inProgress.json');
    // MUST be sync or the function goes ahead and returns undefined which messes things up.
    dataArray = JSON.parse(dataInFile);
    for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i].uniqueTransactionToken === id) {
            if (dataArray[i].currency === currency && parseFloat(dataArray[i].amount) === amountToProcess) {
                rewriteFileWithoutItem(dataArray, i);
                return;
            } else {
                rewriteFileWithoutItem(dataArray, i);
                return 'discrepancy';
            }
        }
    }
    return 'idError';
}

function rewriteFileWithoutItem(dataArray, i) {
    dataArray = returnArrayWithoutItem(dataArray, i);
    while (dataArray.length > 200) dataArray.pop(); // To prevent file getting too long, limit to 200 in-progress transactions at once!
    const dataStringForSending = JSON.stringify(dataArray);
    fs.writeFile('./prettypay/records/inProgress.json', dataStringForSending, (err) => {
        if (err) throw err;
    });
}

function returnArrayWithoutItem(array, i) {
    array.push(array.splice(i, 1)[0]);
    array.pop();
    // Using push then pop() intended to neutralise the effects of simultaneous deletions interfering with one another, 
    // as even if at same time, number of pops should match number of items already moved to end for deletion.
    return array;
}

function recordTransaction(responseObject) {
    if (responseObject.successful === true) {
        fileToRecordIn = './prettypay/records/transactions.json';
    } else {
        fileToRecordIn = './prettypay/records/nontransactions.json';
    }
    fs.readFile(fileToRecordIn, function(error, dataInFile) {
        if (error) {
            console.log(error);
        } else {
            try {
                const dataArray = JSON.parse(dataInFile);
                dataArray.unshift(responseObject);
                while (dataArray.length > 100) dataArray.pop(); // To prevent either file getting too long, 100 records each!
                const dataStringForSending = JSON.stringify(dataArray);
                fs.writeFile(fileToRecordIn, dataStringForSending, (err) => {
                    if (err) throw err;
                });
            } catch (error) {
                fs.writeFile(fileToRecordIn, '[]', (err) => {
                    if (err) throw err;
                });
            }
        }
    })
}

function checkCardExpiry(input) {
    if (input === '' || input === null) return 'Prettypay failed to receive processable information for card expiry date.'

    const inputArray = input.match(/\d+/g);
    const monthInput = parseInt(inputArray[0]);
    const yearInput = parseInt(inputArray[1]);

    if (monthInput < 1 || monthInput > 12 || yearInput < 0 || yearInput > 99) return 'Faulty information for card expiry date.'

    const rightNow = new Date(); 
    const yearNow = rightNow.getYear() -100;
    const monthNow = rightNow.getMonth() + 1;

    monthifiedInput = monthInput + yearInput * 12;
    monthifiedNow = monthNow + yearNow * 12;

    if (monthifiedInput < monthifiedNow) {
        return 'Card error: The expiry date provided indicates the card has expired.'
    };
    if (monthifiedInput > monthifiedNow + 48) {
        return 'Card error: Expiry date not valid as more than four years in the future.'
    };

    return 'good';
}

function generateUUID() { // generateUUID() is copied for processing simulation purposes; this function has a Public Domain/MIT license.
    var d = new Date().getTime(); // Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16; // random number between 0 and 16
        if(d > 0){ // Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else { // Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function formatNumberToString(number) {
    // parseFloat(number) is because some numbers actually come into the function as strings! To check, use:
    // console.log(typeof number)
    number = parseFloat(number);
    if (!Number.isInteger(number)) {
        numberString = number.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
     } else {
        numberString = number.toLocaleString();
     }
     return numberString;
}

function prepareData(filename) {
    let data;
    try {
        data = fs.readFileSync(`./prettypay/records/${filename}`);
        data = JSON.parse(data);
    } catch (error) {
        data = [{"Note": "There are currently no historic data available here."}];
        fs.writeFile(`./prettypay/records/${filename}`, '[]', (err) => {
            if (err) throw err;
        });
    }
    if (data[0] === undefined) data = [{"Note": "There are currently no relevant data to report."}];
    return data
}

module.exports = { matchPreprocessingData, recordTransaction, checkCardExpiry, generateUUID, formatNumberToString, prepareData };
