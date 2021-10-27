// This page not important! Delete at some point (unless find useful) and remove corresponding src tag from accepted.ejs.

if (document.readyState == 'loading') {
	document.addEventListener('DOMContentLoaded', initiatePage)
} else {
	initiatePage();
}

function initiatePage() {
    console.log('accepted.ejs page: fired initiatePage()');
    const queryString = window.location.href;
    const urlParams = new URLSearchParams(queryString);
    console.log('1.' + urlParams);
    console.log('2.' + uniqueTransactionReference);
}
