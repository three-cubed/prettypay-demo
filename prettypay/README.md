# Prettypay
<br>
Prettypay is a web development tool. It is a simple simulated payment processing system used with EJS pages. It is designed to be included within the parent directory.
<br><br>

## To use
First, the Prettypay directory must be cloned and placed in the root file that you wish to use it in.<br>

On index.js (or whatever you have named the server), you must include the lines:<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`const prettypayRouter = require('./prettypay/routes/routes');`<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`app.use('/prettypay', prettypayRouter);`

On the appropriate EJS page, you must include:<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`<%- include('../prettypay/views/view.ejs')%>`<br />

You may then use all the Prettypay functions on any javascript page linked to the EJS page.
<br><br>

## Functions
Prettypay functions are used in javascript for the EJS page:<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.open(` number `);` ...the number being the amount to charge.<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.abort(` 'Optional string explaining why the transaction has been aborted.' `)`<br />
<br>

## Function options
To make the payment form prefill itself for speed of use:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.open(` number `, { prefill: true });`<br />
<br>
Prettypay uses £ by default, but accepts all currencies except €. To use a different currency instead of £ (in this example, using Japanese ¥):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.open(` number `, { currency: '`¥`' });`<br />
<br>

## Data report
To view your Pretttypay data report, go to the URL:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*your_directory_name* + `/prettypay/report`<br />
<br>

## Processing
Prettypay applies checks to the fictional transaction. For example:
- Prettypay checks that the transaction amount is greater than zero.
- Prettypay checks that the card expiry date is appropriate.
- Prettypay checks for anomalies indicating that the transaction data has been tampered with on the payment form.
<br><br>

## Trademark
Prettypay is not really a registered trademark - It's for effect!
<br>
