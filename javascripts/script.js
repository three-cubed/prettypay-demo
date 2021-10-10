const quantityInput = document.getElementById('item-quantity-input');
const priceToPay = document.getElementById('price-to-pay');
const buyBtn = document.getElementById('buyBtn');

if (document.readyState == 'loading') {
	document.addEventListener('DOMContentLoaded', addEventListeners)
} else {
	addEventListeners();
}

function addEventListeners() {
    quantityInput.addEventListener('change', setPrice);
    buyBtn.addEventListener('click', () => {
        startPay();
    })
}

function setPrice() {
    priceToPay.innerText = quantityInput.value;
} 

function startPay() {
    let transactionInitialisationStatus;
    let totalToCharge;
    fetch('/initiatePayment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            total: quantityInput.value
        })
    }).then(function(res) {
        return res.json();
    }).then(function(resJSON) {
        transactionInitialisationStatus = resJSON.transactionInitialisationStatus;
        totalToCharge = resJSON.totalToCharge; 
        // i.e. the payment amount from the backend will be applied, overriding any shenanigans at the frontend.
        // This feature is in fact superfluous, or at least a double-check, if transactionInitialisationStatus is
        // being used to trigger, or not, the abortTransactionModal.
    }).then(function() {if (transactionInitialisationStatus == 'good') {
            Prettypay.open(totalToCharge, { prefill: true });
            // Prettypay.open(totalToCharge, { currency: '¥' });
            // Prettypay.open(totalToCharge, { prefill: true, currency: '¥' });
        } else {
            Prettypay.abort('Aborted by parent directory (not prettypay directory).<br><br>Example rejection criterion of the parent directory\'s routes.js (even number) fulfilled.<br><br>This example optional message passed to Prettypay.abort() by parent directory\'s scripts.js.');
        }
    }).catch(function(error) {
        console.error(error);
    })
}
