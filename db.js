const { MongoClient} = require('mongodb');

let dbConnection;
const uri = 'mongodb+srv://elSparaNu:Change1234@sparael.b6oigls.mongodb.net/kWh?retryWrites=true&w=majority'

module.exports = {
    connectToDb : (cb) => {
        MongoClient.connect(uri)
        .then((client) => {
            dbConnection = client.db()
            return cb()
        })
        .catch(err => {
            console.log(err)
            return cb(err)
        })
    },
    getDb : () => dbConnection
}