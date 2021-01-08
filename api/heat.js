const _useServerlessFunction = require("./_useServerlessFunction");
const _useMongoDb = require("./_useMongoDb");
const _usePuppeteer = require("./_usePuppeteer");
const _usePage = require("./_usePage");
const _useScrapWeather = require("./_useScrapWeather");
const _useGoogleSearchAndGoto = require("./_useGoogleSearchAndGoto");
const _useNormalizeQuery = require("./_useNormalizeQuery");
const _useSelectors = require("./_useSelectors");
const _useSearchUrl = require("./_useSearchUrl");

const getWeatherByCity = async (req, res) => {
  const db = await _useMongoDb();
  const collection = await db.collection(process.env.MONGO_DB_COLLECTION);

  const city = _useNormalizeQuery(req.query.city);

  const cachedCity = await collection.findOne({ cities: { $in: [city] } });

  if (cachedCity) {
    console.log("[USE_EXISTING_CITY]: " + city);

    return res.status(200).send(cachedCity);
  } else {
    console.log("[USE_SEARCH_CITY]: " + city);

    const browser = await _usePuppeteer();
    const page = await _usePage(browser);

    const selectors = _useSelectors();

    const link = await _useGoogleSearchAndGoto(
      page,
      _useSearchUrl(city),
      selectors.goggleLinkToWeatherPage
    );

    const result = await _useScrapWeather(page);

    if (Object.entries(result).length && link) {
      const existentCity = await collection.findOne({ locale: { $eq: result.locale } });

      let data;

      if (existentCity) {
        const updateResult = await collection.findOneAndUpdate(
          { locale: { $eq: result.locale } },
          {
            $addToSet: { cities: city },
            $set:
            {
              ...result,
              link,
              updatedAt: new Date().toISOString()
            }
          },
          { returnNewDocument: true }
        )

        data = updateResult.value
      } else {
        data = {
          cities: [city],
          ...result,
          link,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        await collection.insertOne(data);
      }
      await browser.close();

      return res.status(200).send(data);
    } else {
      await browser.close();

      return res.status(404).send({
        message: `Cidade não foi encontrada.`
      })
    }
  }
}

module.exports = (req, res) => _useServerlessFunction(req, res, getWeatherByCity, {
  query: ["city"]
})