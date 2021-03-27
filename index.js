const express = require('express')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const cors = require('cors')
const port = 5000
const app = express()

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lmnou.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("emaJohnStore").collection("products");
    const orderCollection = client.db("emaJohnStore").collection("orders");
    
    app.post('/addProduct', (req, res)=>{
        const products =req.body;
        productCollection.insertOne(products)
        .then(result => {
            res.send(result.insertedCount)
        })
    }) 
    app.get('/products', (req,res) => {
        productCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.get('/product/:key', (req,res) => {
        productCollection.find({key: req.params.key})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })
    app.post('/productsByKeys', (req,res) => {
        const productKeys = req.body;
        productCollection.find({key:{ $in:productKeys }})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
    app.post('/addOrder', (req, res)=>{
        const order =req.body;
        orderCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})