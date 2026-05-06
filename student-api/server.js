const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

mongoose.connect("mongodb://localhost:27017/studentDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const studentRoutes = require('./routes/students');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

app.use(express.json());
app.use(cors());
app.use(logger);

app.use('/api/students', studentRoutes);

app.get('/', (req, res) => {
    res.send("Welcome to express");
});

app.use((req,res)=> {
    res.status(404).json({
        message: "Route not found"
    });
});

app.use(errorHandler)

app.listen(3000, () => {
    console.log("Server running in port 3000")
});