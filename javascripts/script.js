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
            Prettypay.open(totalToCharge, { autofill: true, askAddress: false });
            Prettypay.postTransaction('http://localhost:3030/prettypay_post');
            Prettypay.setSuccessFunction((data) => {
                console.log('success function arrow function fired');
                priceToPay.innerText = 1;
                quantityInput.value = 1;
                // window.location.href = `/accepted/${data.uniqueTransactionReference}/${data.amountToProcess}/${data.currency}`;
                window.open(`/accepted/${data.uniqueTransactionReference}/${data.amountToProcess}/${data.currency}`);
            });
        } else {
            Prettypay.abort('Aborted by parent directory as demo (not prettypay directory).<br><br>Example acceptance criterion of the parent directory\'s routes.js (odd number) not met.<br><br>This example optional message passed to Prettypay.abort() by parent directory\'s scripts.js.');
        }
    }).catch(function(error) {
        console.error(error);
    })
}
