const actions = {
  contactService: require('./contact-service'),
  postCommand: require('./post-command'),
  outputFile: require('./output-file'),
  configOutputFile: require('./config-output-file'),
  outputJson: require('./output-json'),
  createTable: require('./tables').createTable,
  readModelStatus: require('./read-model-status'),
  readModelShowProperties: require('./read-model-show-properties'),
  readModelShowResolvers: require('./read-model-show-resolvers'),
  readModelQuery: require('./read-model-query'),
  config: require('./config'),
  configLoad: require('./config-load'),
  configSave: require('./config-save'),
  configSetJwtSecret: require('./config-set-jwt-secret'),
  configSetServiceUrl: require('./config-set-service-url'),
  configSetTokenTemplate: require('./config-set-token-template')
};

const vorpalAction = ({ rootActions }) => f =>
  function(args, cb) {
    const { log, prompt } = this;
    const captureActions = {};
    const param = {
      output: log.bind(this),
      prompt: prompt.bind(this),
      actions: captureActions
    };
    for (const key in rootActions)
      captureActions[key] = rootActions[key](param);
    return f(param)(args).then(res => {
      cb();
      return res;
    });
  };

const vorpalActions = state => {
  const captureActions = {};
  for (const key in actions)
    captureActions[key] = actions[key]({ state, rootActions: captureActions });
  captureActions.vorpalAction = vorpalAction({
    state,
    rootActions: captureActions
  });
  return captureActions;
};

module.exports = { vorpalActions };
