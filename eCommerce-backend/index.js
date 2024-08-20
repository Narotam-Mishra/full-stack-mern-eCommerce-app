
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const portNo = process.env.PORT || 7374;
const mongo_URI = process.env.mongoURL;

// DB connection setup with MongoDB
mongoose.connect(mongo_URI)

// API creation
app.listen(portNo, (error) => {
    if(!error){
        console.log(`Server running on PORT: ${portNo}`);
    }else{
        console.log("Error while connnecting MongoDB:", error);
    }
})

