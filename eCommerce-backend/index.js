
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { type } = require('os');

const app = express();

app.use(express.json());
app.use(cors());

const portNo = process.env.PORT || 7374;
const mongo_URI = process.env.mongoURL;

// DB connection setup with MongoDB
mongoose.connect(mongo_URI)

// API creation
app.get("/", (req, res) => {
    res.send("Express App is running")
})

// image storage engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage})

app.use('/images', express.static('upload/images'))

// creating upload endpoint for images
app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${portNo}/images/${req.file.filename}`
    })
})

// schema for creating products
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    new_price:{
        type: Number,
        required: true,
    },
    old_price:{
        type: Number,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
    },
    avilable:{
        type: Boolean,
        default: true,
    },
})

app.post('/addProduct', async (req, res) => {
    let products = await Product.find({});
    let id;

    if(products.length > 0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }else{
        id = 1;
    }

    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    })

    console.log("Product details:",product);
    await product.save();
    console.log("product saved into DB");
    
    res.json({
        success: true,
        name: req.body.name,
    })
})

// creating API for deleting product
app.post('/removeProduct', async (req, res) => {
    await Product.findOneAndDelete({id: req.body.id })
    console.log("product removed successfully!!");
    res.json({
        success: true,
        name: req.body.name
    })
})

// creating API for getting all products
app.get('/allProducts', async (req, res) => {
    let products = await Product.find({});
    console.log("All Products fetched");
    res.send(products);
})

// schema creating for User's model
const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

// creating endpoint for registering the user
app.post('/signup', async(req, res) => {
    
    let check = await Users.findOne({ email: req.body.email });
    if(check){
        return res.status(400).json({
            success: false,
            errors: "existing user found with same email id"
        })
    }

    let cart = {};
    for(let i=0; i<300; i++){
        cart[i] = 0;
    }

    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })

    // save signup data to DB
    await user.save();

    // this data will be used for JWT authentication
    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data, process.env.JWT_SECRET);
    res.json({ success: true, token});
})

// creating endpoint for user login
app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user: {
                    id: user.id
                }
            }

            const token = jwt.sign(data, process.env.JWT_SECRET);
            res.json({ success: true, token});
        }else{
            res.json({ success: false, error: "Invalid credentials"});
        }
    }else{
        res.json({ success: false, error: "Wrong Email Id"});
    }
})

app.listen(portNo, (error) => {
    if(!error){
        console.log(`Server running on PORT: ${portNo}`);
    }else{
        console.log("Error while connnecting server:", error);
    }
})

