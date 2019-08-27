const chalk = require('chalk');
const { getJsonString } = require('./json');

const configSetTokenTemplate = ({ state }) => ({ output }) => ({
  templateJson
}) =>
  getJsonString(templateJson)
    .then(template => {
      state.setTokenTemplate(template);
      output(chalk.green(`Token template set to ${template}`));
    })
    .catch(err => {
      output(chalk.red(err));
    });

module.exports = configSetTokenTemplate;
