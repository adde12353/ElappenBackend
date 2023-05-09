const express = require('express')
const { connectToDb, getDb } = require('./db')
const cors = require('cors')
const dayjs = require('dayjs')
const duration = require('dayjs/plugin/duration')
const { rewriter } = require('json-server')

const app = express()

app.use(cors())
app.use(express.json())

//db Connect
let db;

connectToDb((err) => {
    if (!err) {
        app.listen(4000, () => {
            console.log("app running 3000")
        })
        db = getDb('kWh')
    }
})


//routes
app.get('/get', (req, res) => {
    let kW = []
    db.collection('kWh')
        .find()
        .forEach(kws => kW.push(kws))
        .then(() => {
            res.status(200).json(kW)
        })
    // cursor toArray forEach
})



//Koppla enhet till användare
app.get('/getUser/:id', (req, res) => {
    
    let unitUser;
    db.collection('userNunits')
        .find({ email: req.params.id })
        .forEach(unit => unitUser = unit)
        .then(() => {
            res.status(200).json(unitUser)
        })
    // cursor toArray forEach
})

//Hämta data beroende på enhet
app.get('/get/:id', (req, res) => {
    
    let unitUser = [];
    const today = dayjs().format()
    let nextDay = dayjs(today).add(1, 'day')
    nextDay = dayjs(nextDay).format()
    
    db.collection('kW')
        .find({ $and: [
            {deviceId: parseInt(req.params.id) },
            {date: {$gte: today, $lt: nextDay}}
        ]})
        .forEach(unit =>
            unitUser.push(unit))
        .then(() => {
            res.status(200).json(unitUser)
        })
    // cursor toArray forEach
})

app.post('/test1', (req, res) => {
    let test = []



    const startDay = dayjs(req.body.startDate).format()

    let nextDay; 
    if(req.body.hourDatA)
    {nextDay = dayjs(startDay).add(2, 'day')
    nextDay = dayjs(nextDay).format()
    }
    else {
    nextDay = dayjs(startDay).add(1, 'month')
    nextDay = dayjs(nextDay).format()
    }


    db.collection('kW').find({
        $and: [
            {date: 
            { $gte: startDay, $lt: nextDay }},
            {deviceId: 12
            }
        ]
        
    }).forEach(item => {
        test.push(item)
    }).then(() => res.status(200).json(test))

   

})

//lägga till enhet till användare
app.post('/add', async (req, res) => {

    const deviceId = {
        deviceId: req.body.deviceId,
        email: req.body.user
    }

    try {
        const userExist = await db.collection('userNunits').findOne({ email: req.body.user })
        if (userExist) {
            return res.status(422).json({ error: "Din mail är redan kopplad till en enhet" })
        }
        db.collection('userNunits')
            .insertOne(deviceId)
            .then(result => {
                res.status(201).json(result)
            })
    } catch (err) {
        res.status(500).json({ err: 'Kunde inte spara, nytt dokument' })
    }
})
