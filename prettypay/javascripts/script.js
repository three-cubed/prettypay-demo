const closeModalButtons = document.querySelectorAll('[data-close-button]'); // Square brackets seem to be necessary for query selection of data.
const overlay = document.getElementById('overlay');
const paymentModal = document.getElementById('payment-modal');
const paymentForm = document.getElementById('payment-form');
const paymentCardExpiry = document.getElementById('payment-card-expiry');
const currencyOnModal = document.getElementById('currencyOnModal');
const totalOnModal = document.getElementById('totalOnModal');
const abortTransactionModal = document.getElementById('transaction-aborted-modal');
const abortTransactionOptionalMessageSpan = document.getElementById('transaction-aborted-optional-message-span');
const successfulTransactionModal = document.getElementById('transaction-successful-modal');
const successfulTransactionOptionalMessageSpan = document.getElementById('transaction-successful-optional-message-span');

const contactPostalAddress = document.getElementById('payment-contact-postal-address').parentElement;
const contactEmail = document.getElementById('payment-contact-email').parentElement;

let uniqueTransactionReference;

if (document.readyState == 'loading') {
	document.addEventListener('DOMContentLoaded', addEventListenersAndResetForm)
} else {
	addEventListenersAndResetForm();
}

const Prettypay = {
    open: function(amount, { prefill = false, currency = '£', askAddress = true, askEmail = true } = {}) {
        closeAnyModals();
        paymentForm.reset();
        if (amount <= 0) {
            Prettypay.abort('Error: The total charged is zero or less.');
        } else {
            if (askAddress === false) {
                contactPostalAddress.classList.add('invisiblePP');
                contactPostalAddress.setAttribute("required", "");
            }
            if (askEmail === false) {
                contactEmail.classList.add('invisiblePP');
                contactPostalAddress.setAttribute("required", "")
            }
            openPaymentForm(amount, currency);
            if (prefill === true) prefillPaymentForm();
            preprocessPayment(amount, currency);
        }
    },
    abort: function(message = '') {
        closeAnyModals();
        console.log(`abort: message: ${message}`)
        if (message !== '') {
            abortTransactionOptionalMessageSpan.innerHTML = `<span id='transaction-aborted-optional-message-span'><br>${message}<br></span>`
        } else {
            abortTransactionOptionalMessageSpan.innerHTML = "<span id='transaction-aborted-optional-message-span'></span>"
        }
        abortTransactionModal.classList.add('active');
        overlay.classList.add('active');
    },
    approved: function(message = '') {
        closeAnyModals();
        if (message !== '') {
            successfulTransactionOptionalMessageSpan.innerHTML = `<span id='transaction-successful-optional-message-span'><br>${message}<br></span>`
        } else {
            successfulTransactionOptionalMessageSpan.innerHTML = "<span id='transaction-successful-optional-message-span'></span>"
        }
        successfulTransactionModal.classList.add('active');
        overlay.classList.add('active');
    }
}

function prefillPaymentForm() {
    document.getElementsByClassName('text-in-modal')[0].innerHTML = 'This is the pre-filled version, for your convenience.<br>Just click the button!';
    document.getElementById('payment-contact-name').value = 'Adam Smith';
    document.getElementById('payment-contact-postal-address').value= '10 High Road, Brighton, BN1, 1AA';
    document.getElementById('payment-contact-email').value = 'asmith@email.com';
    document.getElementById('payment-card-name').value = 'Mr A Smith';
    document.getElementById('payment-card-number').value = '4242 4242 4242 4242';
    document.getElementById('payment-card-expiry').value = '10/25';
    document.getElementById('payment-card-sec-code').value = '321';
}

function openPaymentForm(amount, currency) {
    currency = currency.trim();
    currencyOnModal.innerText = currency;
    totalOnModal.innerText = formatNumberToString(amount);
    paymentModal.classList.add('active');
    overlay.classList.add('active');
}

function preprocessPayment(amount, currency) {
    fetch('/prettypay/preprocess', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            amount: amount,
            currency: currency,
        })
    }).then(function(res) {
        return res.json();
    }).then(function(resJSON) {
        uniqueTransactionReference = resJSON.uniqueTransactionReference;
    }).catch(function(error) {
        console.error(error);
    })
}

function addEventListenersAndResetForm() {

    paymentForm.reset();

    overlay.addEventListener('click', () => {
        closeAnyModals();
    })

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        })
    })
}

function closeAnyModals() {
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
        closeModal(modal);
    })
}

function closeModal(modal) {
    modal.classList.remove('active');
    if (modal === paymentModal) paymentForm.reset();
    overlay.classList.remove('active');
}

function processPayment() {
    const amountToProcess = parseFloat(totalOnModal.innerText);
    const expiryString = paymentCardExpiry.value;
    const currency = currencyOnModal.innerText;
    const contactName = document.getElementById('payment-contact-name').value
    const contactEmail = document.getElementById('payment-contact-email').value
    const cardName = document.getElementById('payment-card-name').value;
    const cardNum = document.getElementById('payment-card-number').value;
    const cardExpiry = document.getElementById('payment-card-expiry').value;
    const cardSecCode = document.getElementById('payment-card-sec-code').value;
    fetch('/prettypay/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            expiryString: expiryString,
            amountToProcess: amountToProcess,
            currency: currency,
            uniqueTransactionReference: uniqueTransactionReference,
            contactName: contactName,
            contactEmail: contactEmail,
            cardName: cardName,
            cardNum: cardNum,
            cardExpiry: cardExpiry,
            cardSecCode: cardSecCode
        })
    }).then(function(res) {
        return res.json();
    }).then(function(resJSON) {
        console.log(resJSON.devMessage); // ...this being the purpose of the devMessage.
        if (resJSON.successful !== true) {
            Prettypay.abort(resJSON.customerMessage);
        } else {
            Prettypay.approved(resJSON.customerMessage);
        }
    }).catch(function(error) {
        console.error(error);
    })
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
