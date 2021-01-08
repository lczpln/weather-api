const _useSelectors = require("./_useSelectors");
const _useFormater = require("./_useFormater");

module.exports = _useScrapWeather = async (page, linkToGo) => {
  try {
    if (linkToGo) {
      await page.goto(linkToGo);
    }

    const selectors = _useSelectors();

    const result = await page.evaluate((selectors) => {
      const locale = document.querySelector(selectors.locale).innerText;
      const heatValues = document.querySelector(selectors.heatValues).innerText;
      const degreesChart = document.querySelector(selectors.degreesChart).attributes['data-infos'].value;
      const healthIndexes = document.querySelector(selectors.healthIndexes).innerText;
      const linkToImage = document.querySelector(selectors.linkToImage).href;

      return {
        locale,
        heatValues,
        degreesChart,
        healthIndexes,
        linkToImage,
      }
    }, selectors);

    await page.goto(result.linkToImage);

    const now = await page.evaluate((selectors) => {
      const image = document.querySelector(selectors.image).src;
      const degree = document.querySelector(selectors.nowDegree).innerText;
      return {
        image,
        degree
      }
    }, selectors);

    const formater = _useFormater();

    const values = {
      ...formater.formatNowImage(now.image),
      ...formater.formatNowDegree(now.degree),
      ...formater.formatLocale(result.locale),
      ...formater.formatHeatValues(result.heatValues),
      ...formater.formatChartValues(result.degreesChart, result.images),
      ...formater.formatHealthValues(result.healthIndexes),
    };

    console.log(`[RESULT_OF_SEARCH]: ${JSON.stringify(values)}`);

    return {
      ...values,
    };
  } catch (error) {
    console.log(`[INTERNAL_SERVER_ERROR]: ${error}`);

    return {};
  }
}