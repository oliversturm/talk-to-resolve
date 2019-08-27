const chalk = require('chalk');

const configSetJwtSecret = ({ state }) => ({ output }) => ({ secret }) => {
  const newSecret = Array.isArray(secret) ? secret.join(' ') : secret;
  state.setJwtSecret(newSecret);
  output(chalk.green(`JWT Secret set to '${newSecret}'`));
  return Promise.resolve();
};

module.exports = configSetJwtSecret;
