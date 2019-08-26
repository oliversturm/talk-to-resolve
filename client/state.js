const chalk = require('chalk');

module.exports = () => {
  let jwtSecret = null;

  const setJwtSecret = secret => {
    jwtSecret = secret;
  };

  let serviceUrl = null;

  const setServiceUrl = url => {
    serviceUrl = url;
  };

  let tokenTemplate = JSON.stringify({
    id: 'talk-to-resolve',
    roles: ['$ttr']
  });

  const setTokenTemplate = template => {
    tokenTemplate = template;
  };

  const stateOk = () => !!jwtSecret && !!serviceUrl && !!tokenTemplate;

  const prompt = () => {
    const color = stateOk() ? chalk.green : chalk.red;
    return color(
      `TTR ${jwtSecret ? '' : '[JWT Secret not set] '}${
        serviceUrl ? '' : '[Service URL not set] '
      }${tokenTemplate ? '' : '[Token template not set] '}>`
    );
  };

  const getState = () => ({ jwtSecret, serviceUrl, tokenTemplate });

  const getVisualState = () => {
    const jwtSecretColor = jwtSecret ? chalk.green : chalk.red;
    const serviceUrlColor = serviceUrl ? chalk.green : chalk.red;
    const tokenTemplateColor = tokenTemplate ? chalk.green : chalk.red;

    return `
  ${chalk.bold('TTR Config')}

  ${jwtSecretColor(`JWT Secret = '${jwtSecret}'`)}
  ${serviceUrlColor(`Service URL = ${serviceUrl}`)}
  ${tokenTemplateColor(`Token template = ${tokenTemplate}`)}
`;
  };

  const isStateSaveable = () => !!jwtSecret && !!serviceUrl && !!tokenTemplate;
  const getSaveableState = () =>
    isStateSaveable() ? { jwtSecret, serviceUrl, tokenTemplate } : null;
  const loadState = ({
    jwtSecret: secret,
    serviceUrl: url,
    tokenTemplate: tokenTemplate
  }) => {
    setJwtSecret(secret);
    setServiceUrl(url);
    setTokenTemplate(tokenTemplate);
  };

  return {
    setJwtSecret,
    setServiceUrl,
    prompt,
    getVisualState,
    isStateSaveable,
    getSaveableState,
    loadState,
    stateOk,
    getState,
    setTokenTemplate
  };
};
