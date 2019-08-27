const chalk = require('chalk');

const configSetServiceUrl = ({ state }) => ({ output }) => ({ url }) => {
  state.setServiceUrl(url);
  output(chalk.green(`Service URL set to '${url}'`));
  return Promise.resolve();
};

module.exports = configSetServiceUrl;
