const xlsx = require("xlsx");
const errorCodes = require("./errorCodes");

function getDeliveryCost(quantity, country) {
  try {
    const file = xlsx.readFile("./utils/xlsx/DeliveryCost.xlsx");
    const firstSheetName = file.SheetNames[0];
    const fistSheet = file.Sheets[firstSheetName];
    const deliveryCost = xlsx.utils.sheet_to_json(fistSheet);

    const cost = deliveryCost[quantity - 1][country];
    return cost;
  } catch (err) {
    throw new Error(errorCodes.canNotFindDeliveryCost);
  }
}

function getCountry(buyrCountry) {
  try {
    const file = xlsx.readFile("./utils/xlsx/Country_code.xlsx");
    const firstSheetName = file.SheetNames[0];
    const fistSheet = file.Sheets[firstSheetName];
    let country = xlsx.utils.sheet_to_json(fistSheet);

    const countryCode = country.filter((ele) => {
      return ele.country_code === buyrCountry;
    });
    country = countryCode[0].country_name;
    return country;
  } catch (err) {
    throw new Error(errorCodes.canNotFindCountry);
  }
}

module.exports = { getDeliveryCost, getCountry };
