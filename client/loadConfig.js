const homedir = require('homedir');
const path = require('path');

const loadConfig = file => {
  try {
    return require(file);
  } catch (e) {
    return {};
  }
};

const configFileName = () => path.join(homedir(), '.ttr.config.json');

module.exports = { loadConfig, configFileName };
