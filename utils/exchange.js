require("dotenv").config();
const requestPromise = require("request-promise");
const errorCodes = require("./errorCodes");

async function exchangeAPI(discount) {
  try {
    const apikey = process.env.EXCHANGE_API_KEY;
    const options = {
      url: `https://api.apilayer.com/exchangerates_data/convert?from=KRW&to=USD&amount=${discount}`,
      method: "GET",
      headers: { apikey },
    };

    let res = await requestPromise(options);
    res = JSON.parse(res);
    return res.result;
  } catch (err) {
    throw new Error(errorCodes.notWorkingExchangeAPI);
  }
}

module.exports = exchangeAPI;
