
const express = require('express')
const cors = require('cors');
const bodyParser = require("body-parser")

const userRouter = require('./routes/user_router');
const fileRouter = require('./routes/file_router');

const app = express()
global.__basedir = __dirname;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('uploads'));
app.use(express.json()); // Assuming you're using JSON body parser
app.use(cors()); //allows your frontend, hosted on a different domain, to make requests to your backend.

app.use('/', userRouter)
app.use('/', fileRouter)

const port = 8000;
app.listen(port, console.log(`server is listening on ${port}`));
module.exports = app;



