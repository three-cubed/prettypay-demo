const express = require('express');
const app = express();
app.use(express.static(__dirname)); // To access stylesheet.css
app.set('view engine', 'ejs');

app.use(express.json());

const router = require('./routes/routes');
const prettypayRouter = require('./prettypay/routes/routes');

app.use('/', router);
app.use('/prettypay', prettypayRouter);

app.listen(process.env.PORT||3030, () => {
    console.log('listening to 3030');
});
