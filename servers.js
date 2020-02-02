/******************* Importing Module ****************************/

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const api = require('./server/routes/api'); 

const port = 8100;

/*************** Instance of express *****************************/

const app = express(); 

/****************** Allowing file access *************************/

app.use(express.static(path.join(__dirname, 'dist/browser')));
app.use('/uploads',express.static(path.join('uploads')));

/****************** BodyParser Middelware ************************/

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

/****************** Use api module for /api routes ****************/

app.use('/api',api);

/************************** Home Routes ***************************/

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist/browser/index.html'));
});

/********************* Listning on port 8100 **********************/

app.listen(port, () => {
    console.log("The server is running on: "+port);
});