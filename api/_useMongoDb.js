const url = require('url')
const MongoClient = require('mongodb').MongoClient

const uri = 'mongodb+srv://money-db:ef10495cf2e00cd4cbafed4a39439fe5@money-db.qivlm.gcp.mongodb.net/heats-db?authSource=admin&replicaSet=atlas-12u8ap-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';

// Create cached connection variable
let cachedDb = null

module.exports = _useMongoDb = async () => {
  if (cachedDb) {
    return cachedDb
  }

  const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

  const db = await client.db(url.parse(uri).pathname.substr(1))

  cachedDb = db
  return db
}