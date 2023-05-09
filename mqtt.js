const express = require('express')
const {connectToDb, getDb} = require('./db') 
const app = express()
const mqtt = require('mqtt');
/* const dayjs = require('dayjs') */

const options = {
    host: 'aa8f56ce884b4bd4b7a93657d9e7ad9c.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'Addepadde11',
    password: 'Hammarby1'
}

app.use(express.json())

let db;

connectToDb((err) => {
    if(!err) {
        app.listen(5000, () => {
            console.log("app running 5000")
        })
        db = getDb('kWh')
    }
})

// initialize the MQTT client
var client = mqtt.connect(options);

// setup the callbacks
client.on('connect', function () {
    console.log('Connected');
});

client.on('error', function (error) {
    console.log(error);
});

client.on('message', function (topic, message) {

      const data = JSON.parse(message.toString());
      

      try {
        db.collection('kW')
        .insertOne(data)
        .then(result => {
        console.log(result) 
        })
    } catch(err) {
        console.log(err) 
    }


    });

// subscribe to topic 'my/test/topic'
client.subscribe('my/test/topic');





