const jsonic = require('jsonic');

const getJsonValue = param =>
  new Promise((resolve, reject) => {
    try {
      const value = jsonic(Array.isArray(param) ? param.join(' ') : param);
      resolve(value);
    } catch (e) {
      reject(e.message);
    }
  });

const getJsonString = value =>
  getJsonValue(value).then(val => JSON.stringify(val));

module.exports = { getJsonValue, getJsonString };
