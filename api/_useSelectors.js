module.exports = _useSelectors = () => {
  return {
    goggleLinkToWeatherPage: 'a[href*="climatempo.com.br/previsao-do-tempo/cidade"]',
    locale: '.-bold.-font-18.-dark-blue',
    heatValues: '.variables-list',
    degreesChart: '#wrapper-chart-1',
    healthIndexes: 'ul.list',
    linkToImage: 'a[href*="/previsao-do-tempo/agora/cidade/"]',
    image: '._flex._justify-center._align-center img',
    nowDegree: '._flex._justify-center._align-center img + span',
  }
}
