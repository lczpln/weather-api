const _useServerlessFunction = require("./_useServerlessFunction");
const _useMongoDb = require("./_useMongoDb");
const _usePuppeteer = require("./_usePuppeteer");
const _usePage = require("./_usePage");
const _useScrapWeather = require("./_useScrapWeather");

const updateHeats = async (req, res) => {
  const { limit = 5 } = req.query;

  const db = await _useMongoDb();
  const collection = await db.collection(process.env.MONGO_DB_COLLECTION);

  const cities = await collection.find({}).sort({ updatedAt: 1 }).limit(Number(limit)).toArray();

  if (cities.length) {
    const browser = await _usePuppeteer();
    const page = await _usePage(browser);

    for (let i = 0; i < cities.length; i++) {
      const result = await _useScrapWeather(page, cities[i].link);

      if (Object.entries(result).length) {
        await collection.findOneAndUpdate(
          { locale: { $eq: result.locale } },
          {
            $set:
            {
              ...result,
              updatedAt: new Date().toISOString()
            }
          }
        )
      }
    }

    await browser.close();
  }

  return res.status(200).send({
    message: "Ok"
  })
}

module.exports = (req, res) => _useServerlessFunction(req, res, updateHeats)