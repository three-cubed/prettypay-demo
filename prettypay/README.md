# Prettypay
<br>
Prettypay is a web development tool. It is a simple simulated payment processing system used with javascript and EJS pages. It is designed to be included within the parent directory.
<br><br>

## To use
First, the Prettypay directory must be cloned and placed in the parent file that you wish to use it in.<br>

You will presumably not wish to retain the reocrds of the directory which you cloned, so you can delete all information **within*** each file in prettypay/records (**do not** delete the files themselves!).<br>

In index.js (or whatever you have named the server), you must include the lines:<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`const prettypayRouter = require('./prettypay/routes/routes')`<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`app.use('/prettypay', prettypayRouter)`

On the appropriate EJS page, on which you wish to be able to fire the payment processor, you must include:<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`<%- include('../prettypay/views/view.ejs')%>`<br />

You may then use all the Prettypay functions on any javascript page linked to the EJS page.
<br><br>

## Functions
Prettypay functions are used in javascript for the EJS page:<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.open( `amount` )` ...the amount being an amount passed to Prettypay to charge.<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.abort( `*'Optional string explaining why the transaction has been aborted.'*` )`<br />
<br>

## Function options
To make the payment form prefill itself for speed of use:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.open( amount, { prefill: true })`<br />
<br>
By default, the payment form requests the customer's postal address and email. If you do not wish to request this information, you can use:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.open( amount, { askAddress: false })`<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.open( amount, { askEmail: false })`<br />
<br>
Prettypay uses £ by default, but accepts all currencies except €. To use a different currency instead of £ (in this example, Japanese ¥):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.open( amount, { currency:  `'¥'` })`<br />
<br>
If you wish to do so, you can, of course, use more than one option, for example:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Prettypay.open( amount, {`<br />
&emsp;&emsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`currency:  '¥',`<br />
&emsp;&emsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`prefill: true,`<br />
&emsp;&emsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`askAddress: false,`<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`})`<br />
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

Where a check is failed, Prettypay will automatically abort the transaction. The developer may, however, add their own criteria and invoke `Prettypay.abort()` where they wish.
<br><br>

## Trademark
Prettypay is not really a registered trademark - It's for effect!
<br>
