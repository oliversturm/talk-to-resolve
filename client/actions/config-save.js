const fs = require('fs-extra');
const chalk = require('chalk');
const configFileName = require('./config-filename');

const configSave = ({ state }) => ({
  output,
  actions: { configOutputFile }
}) => ({ name }) => {
  if (state.isStateSaveable()) {
    const configFile = configFileName();
    const sectionName = name || 'default';

    return fs
      .readJSON(configFile)
      .then(config =>
        configOutputFile(
          configFile,
          sectionName,
          config,
          state.getSaveableState()
        )
      );
  } else {
    output(chalk.red('State is incomplete, not saved'));
    return Promise.resolve();
  }
};

module.exports = configSave;
