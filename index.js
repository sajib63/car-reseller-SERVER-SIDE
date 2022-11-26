const express = require('express')
const app = express()
const cors = require('cors')
const { json } = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000




app.use(cors())
app.use(express.json())






const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.z2qhqgi.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {

    try {

        const teslaCollection = client.db('car-reseller').collection('tesla')
        const audiCollection = client.db('car-reseller').collection('audi')
        const bmwCollection = client.db('car-reseller').collection('bmw')
        const hyundaiCollection = client.db('car-reseller').collection('hyundai')
        const mercedesCollection = client.db('car-reseller').collection('mercedes')
        const lamborghiniCollection = client.db('car-reseller').collection('lamborghini')
        const buyerCollection = client.db('car-reseller').collection('buyer')
        const sellerCollection = client.db('car-reseller').collection('seller')




        // get all brands
        app.get('/tesla', async (req, res) => {
            const query = {}
            const tesla = await teslaCollection.find(query).toArray()
            res.send(tesla)
        })
        app.get('/audi', async (req, res) => {
            const query = {}
            const tesla = await audiCollection.find(query).toArray()
            res.send(tesla)
        })
        app.get('/bmw', async (req, res) => {
            const query = {}
            const tesla = await bmwCollection.find(query).toArray()
            res.send(tesla)
        })
        app.get('/hyundai', async (req, res) => {
            const query = {}
            const tesla = await hyundaiCollection.find(query).toArray()
            res.send(tesla)
        })
        app.get('/mercedes', async (req, res) => {
            const query = {}
            const tesla = await mercedesCollection.find(query).toArray()
            res.send(tesla)
        })
        app.get('/lamborghini', async (req, res) => {
            const query = {}
            const tesla = await lamborghiniCollection.find(query).toArray()
            res.send(tesla)
        })


        // post seller or buyer 
        app.post('/position', async (req, res) => {
            const user = req.body;

            if (user.position === "Buyer") {
                const result = await buyerCollection.insertOne(user)
                return res.send(result)
            }

            if (user.position === "Seller") {
                const result = await sellerCollection.insertOne(user)
                return res.send(result)
            }

            const result = await buyerCollection.insertOne(user)
            res.send(result)

        })






        // jwt 

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const user = await sellerCollection.findOne(query)
            const user2 = await buyerCollection.findOne(query)
            if (user || user2) {
                const token = jwt.sign({ email }, process.env.JWT_TOKEN, { expiresIn: '1d' })
                return res.send({token})
            }
            res.status(403).send({ message: 'Forbidden Access' })
        })



        // find all sellers

        app.get('/sellers', async(req, res)=>{
            const query={}
            const sellers=await sellerCollection.find(query).toArray()
            res.send(sellers)
        })

        // find all buyers

        app.get('/buyers', async(req, res)=>{
            const query={}
            const sellers=await buyerCollection.find(query).toArray()
            res.send(sellers)
        })




        // for find specific one by id 

        app.get('/allProduct/:id', async(req, res)=>{
            const id=req.params.id;
            const query={_id: ObjectId(id)}
            const result1=await teslaCollection.findOne(query)
            const result2=await audiCollection.findOne(query)
            const result3=await bmwCollection.findOne(query)
            const result4=await mercedesCollection.findOne(query)
            const result5=await hyundaiCollection.findOne(query)
            const result6=await lamborghiniCollection.findOne(query)

            res.send(result1||result2||result3||result4||result5||result6)
        })


    }
    finally {

    }

}
run().catch(console.dir())


app.get('/', (req, res) => {
    res.send('Reseller Website Running...............')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})