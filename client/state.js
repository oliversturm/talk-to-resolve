const chalk = require('chalk');
const EventEmitter = require('events');

module.exports = () => {
  let jwtSecret = null;
  let serviceUrl = null;
  let tokenTemplate = JSON.stringify({
    id: 'talk-to-resolve',
    roles: ['$ttr']
  });

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

  const events = new EventEmitter();
  const promptChanged = () => {
    events.emit('prompt changed', prompt());
  };
  const onPromptChanged = f => events.on('prompt changed', f);

  const setJwtSecret = secret => {
    jwtSecret = secret;
    promptChanged();
  };

  const setServiceUrl = url => {
    serviceUrl = url;
    promptChanged();
  };

  const setTokenTemplate = template => {
    tokenTemplate = template;
  };

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
    setTokenTemplate,
    onPromptChanged
  };
};
