require('dotenv').config();

// Connect to ExpressJS
const port = process.env.PORT || 3000;
const express = require('express');
const app = express();

// Parse JSON bodies sent by API clients
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Config CORS to handle connect FE and BE
const cors = require('cors');
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

const routeAdmin = require('./routes/index.route');
routeAdmin(app);

app.listen(port, () => {
    console.log('App listening on port ' + port);
})