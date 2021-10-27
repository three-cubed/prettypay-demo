# Prettypay
<br>
Prettypay is a web development tool. It is a moderately simple simulated payment processing system used with javascript and EJS pages. It is designed to be included within the parent directory.
<br><br>

## To use
First, the Prettypay directory must be cloned and placed in the parent file that you wish to use it in.<br>

You will presumably not wish to retain the transaction records of the directory which you cloned, so if applicable, you can delete all information **within** each file in prettypay/records (do not delete the files themselves!).<br>

In index.js (or whatever you have named the server), you must include the lines:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`const prettypayRouter = require('./prettypay/routes/routes')`<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`app.use('/prettypay', prettypayRouter)`<br>
This assumes you have called your instance of express.js "app". If not, amend accordingly!

On the appropriate EJS page, on which you wish to fire the payment processor, you must include:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`<%- include('../prettypay/views/view.ejs')%>`<br>

You may then use all the Prettypay functions on any javascript page linked to the EJS page.<br>

Unless you are sure you will not use `Prettypay.postTransaction()`, you should also install the node-fetch package from NPM, at a version prior to version 3, the most recent available being 2.6.5: `npm install node-fetch@2.6.5`. Versions from 3 onwards will not work.
<br><br>

## Some potential problems

### Potential path problems
The file `/prettypay/views/view.ejs` begins with a javascript `script src` tag and a CSS import. These should link to the appropriate javascript and CSS pages in the `/prettypay` directory. 

However, when you include `<%- include('../prettypay/views/view.ejs')%>` in a file, the location of that file in the parent directory and the manner in which it is routed may change the paths that must be followed in order to access Prettypay's javascript and CSS. Note that the paths must be in relation to the location of the file in which the Prettypay view is placed, not the location of the Prettypay view file.

Therefore, the javascript `script src` tag and CSS import at the top of `/prettypay/views/view.ejs` have paths which may need amending to fit your file structure.

### Potential loading order problems
As is often the case with javascript functions for frontend pages, you will need to avoid invoking Prettypay functions prior to the loading of the page, or you will get an error such as `Uncaught ReferenceError: Prettypay is not defined`. 

Such errors are unlikely in practical usage, as Prettypay would be linked to some purchase button that will not exist prior to page loading. If, however, you were initially playing with Prettypay by placing a Prettypay function straight into your javascript page, this error might occur.
<br><br>

## Functions
Prettypay functions are used in javascript source for the EJS page:<br>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.open( `*amount*` )` ...the amount being an amount passed to Prettypay to charge.<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.abort( `'Optional string explaining why the transaction has been aborted'` )`<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.setSuccessFunction( `*Function to perform on successful completion of transaction*` )`<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.setNotSuccessFunction( `*Function to perform on abortion of transaction*` )` ...for unsuccessful transactions that did reach the payment form stage.<br>

Note that both `Prettypay.setSuccessFunction()` and `Prettypay.setNotSuccessFunction()` provide data from the relevant (un)successful transaction as an argument (see function examples (1) below).<br>

Neither `Prettypay.setSuccessFunction()` nor `Prettypay.setNotSuccessFunction()` need be set. If, at a certain stage in your code, you wish to nullify the functions set previously, use a `null` argument (see function examples (1)(b) below).<br>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.postTransaction( `*Absolute URL*` )` ...will post to your router, on the route of the specified URL, on the outcome of a transaction that did reach the payment form stage. The post will occur at the successful or unsuccessful conclusion of the transaction.<br>

You may wish to pay attention to timing this to get the information you want. `Prettypay.postTransaction()` might well follow a  `Prettypay.open()` function (see function examples (2) below) to inform the router of the outcome of that transaction. The user then chooses how to handle this post on their routes page (see function examples (3) below).<br>
<br>

## Function examples
(1)<br>
&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.setSuccessFunction((data) => {`<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`// Do something with the data provided!`<br>
&nbsp;&nbsp;&nbsp;&nbsp;`});`<br>

(1)(b)<br>
&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.setSuccessFunction(null);`<br>

(2)<br>
&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.open(myExampleAmount);`<br>
&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.postTransaction('http://www.mywebsite.com/data');`<br>

(3)<br>
&nbsp;&nbsp;&nbsp;&nbsp;`router.post('/data', function(req, res) {`<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`const data = req.body.transaction;`<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`// Do something with the data provided!`<br>
&nbsp;&nbsp;&nbsp;&nbsp;`}`<br>
<br>

## Prettypay.open() options
To make the payment form autofill itself for speed of use:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.open(amount, { autofill: true })`<br>
<br>
By default, the payment form requests the customer's postal address and email. If you do not wish to request this information, you can use options:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.open(amount, { askAddress: false })`<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.open(amount, { askEmail: false })`<br>
<br>
Prettypay uses £ by default, but accepts all currencies except €. To use a different currency instead of £ (in this example, Japanese ¥):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.open(amount, { currency:  '¥' })`<br>
<br>
If you wish to do so, you can, of course, use more than one option at once, for example:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.open(amount, {`<br>
&emsp;&emsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`currency:  '¥',`<br>
&emsp;&emsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`autofill: true,`<br>
&emsp;&emsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`askAddress: false`<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`})`<br>
<br>

## Processing
Prettypay applies checks to the fictional transaction. For example:
- Prettypay checks that the transaction amount is greater than zero.
- Prettypay checks that the card expiry date is appropriate.
- Prettypay checks for anomalies indicating that the transaction data has been tampered with on the payment form.

Where a check is failed, Prettypay will automatically abort the transaction. The developer may, however, add their own criteria and invoke `Prettypay.abort()` where they wish, as demonstrated in this example website.<br>
<br>

## Data report
To view your Pretttypay data report, detailing your recorded transactions, go to the URL:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*your_directory_name* + `/prettypay/report`<br>
<br>

## Trademark
Prettypay is not really a registered trademark - It's for effect! Nonetheless, check `LICENCE.md` for details of the attribution, non-commercial, no derivative licence.<br>
<br>
