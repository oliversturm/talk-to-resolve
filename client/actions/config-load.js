const fs = require('fs-extra');
const chalk = require('chalk');
const configFileName = require('./config-filename');

const configLoad = ({ state }) => ({ output }) => ({ name }) => {
  const configFile = configFileName();
  return fs.readJSON(configFile).then(config => {
    const sectionName = name || 'default';
    if (config[sectionName]) {
      state.loadState(config[sectionName]);
      output(chalk.green(`Config '${sectionName}' loaded from ${configFile}`));
    } else {
      output(chalk.red(`Config '${sectionName}' not found in ${configFile}`));
    }
  });
};

module.exports = configLoad;
