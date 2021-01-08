module.exports = () => ({
  formatLocale: (str) => {
    return {
      locale: str.split(/\d/).slice(-1)[0].trim()
    };
  },

  formatHeatValues: (str) => {
    const values = str.split("\n").filter((value) => value).map(value => value.toLowerCase());

    return {
      degreesRange: {
        min: returnNumberOnly(splitAndTrim(values[1], " ", 0)),
        max: returnNumberOnly(splitAndTrim(values[1], " ", 1))
      },
      rain: {
        qtd: splitAndTrim(values[3], "-", 0),
        chance: splitAndTrim(values[3], "-", 1)
      },
      wind: {
        direction: splitAndTrim(values[5], "-", 0),
        speed: splitAndTrim(values[5], "-", 1)
      },
      humidity: {
        min: splitAndTrim(values[7], " ", 0),
        max: splitAndTrim(values[7], " ", 1)
      },
      sun: {
        rising: splitAndTrim(values[8], " ", 1),
        sunset: splitAndTrim(values[8], " ", 2)
      }
    }
  },

  formatChartValues: (str, images) => {
    const data = JSON.parse(str);

    return {
      degrees: data.map((weather, index) => ({
        date: weather.date,
        degree: weather.temperature.temperature,
        // image: images[index] || ""
      }))
    }
  },

  formatHealthValues: (str) => {
    const values = str.split("\n").filter(value => value);

    return {
      airQuality: validateAndTrim(values[1]),
      fluRisk: validateAndTrim(values[3]),
      flys: validateAndTrim(values[5]),
      uvRays: validateAndTrim(values[7]),
      drySkin: validateAndTrim(values[9]),
      sunRecommended: validateAndTrim(values[11])
    }
  },

  formatNowDegree: (str) => {
    return {
      degree: returnNumberOnly(str)
    }
  },

  formatNowImage: (str) => {
    return {
      image: validateAndTrim(str),
    }
  },
})

const validateAndTrim = (value) => {
  if (!value) return "";

  return value.trim();
}

const splitAndTrim = (value, splitStr, returnIndex) => {
  if (!value) return "";

  value = value.split(splitStr)[returnIndex]

  if (!value) return "";

  return value.trim();
}

const returnNumberOnly = (value) => {
  if (!value) return "";

  return value.replace(/[^0-9]/g, "");
}