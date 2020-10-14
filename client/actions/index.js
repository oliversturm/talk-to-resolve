const inquirer = require('inquirer');

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
  readModelPause: require('./read-model-pause'),
  readModelResume: require('./read-model-resume'),
  readModelReset: require('./read-model-reset'),
  readModelSetProperty: require('./read-model-set-property'),
  readModelGetProperty: require('./read-model-get-property'),
  readModelDeleteProperty: require('./read-model-delete-property'),
  config: require('./config'),
  configLoad: require('./config-load'),
  configSave: require('./config-save'),
  configSetJwtSecret: require('./config-set-jwt-secret'),
  configSetServiceUrl: require('./config-set-service-url'),
  configSetTokenTemplate: require('./config-set-token-template'),
  aggregateList: require('./aggregate-list'),
  aggregateListCommands: require('./aggregate-list-commands'),
  aggregateExecuteCommand: require('./aggregate-execute-command'),
  aggregateExecuteCommands: require('./aggregate-execute-commands'),
  eventsShow: require('./events-show'),
  viewModelQuery: require('./view-model-query'),
};

const vorpalAction = ({ rootActions }) => (f) =>
  function (args, cb) {
    const { log, prompt } = this;
    const captureActions = {};
    const param = {
      output: log.bind(this),
      prompt: prompt.bind(this),
      actions: captureActions,
    };
    for (const key in rootActions)
      captureActions[key] = rootActions[key](param);
    return f(param)(args).then((res) => {
      cb();
      return res;
    });
  };

const vorpalActions = (state) => {
  const captureActions = {};
  for (const key in actions)
    captureActions[key] = actions[key]({ state, rootActions: captureActions });
  captureActions.vorpalAction = vorpalAction({
    state,
    rootActions: captureActions,
  });
  return captureActions;
};

const commanderAction = ({ rootActions, load }) => (f) =>
  function (...args) {
    const [cmd] = args.slice(-1);
    const params =
      cmd._args && Array.isArray(cmd._args)
        ? cmd._args.reduce((r, v, i) => ({ ...r, [v.name]: args[i] }), {})
        : {};
    params.options =
      cmd.options && Array.isArray(cmd.options)
        ? cmd.options.reduce((r, v) => {
            // for option '-r, --remove', v.short has '-r' and v.long has '--remove'
            //   value is cmd.remove
            // for option '-r', v.short is undefined and v.long has '-r'
            //   value is cmd.R
            // for option '--remove', v.short is undefined and v.long has '--remove'
            //   value is cmd.remove
            const optionName = v.long.replace(/^-+/, '');
            const shortOption = optionName.length === 1;
            return {
              ...r,
              [optionName]:
                cmd[shortOption ? optionName.toUpperCase() : optionName],
            };
          }, {})
        : {};

    // We assume that only one of these top-level actions is
    // run when using the commander interface, so calling this
    // here is fine - otherwise we'd need to make sure somehow
    // that configLoad is done just once.
    return rootActions.configLoad({ name: load }).then(() => f(params));
  };

const commanderActions = (state, load) => {
  const captureActions = {};
  for (const key in actions)
    captureActions[key] = actions[key]({ state, rootActions: captureActions })({
      output: console.log,
      prompt: inquirer.prompt,
      actions: captureActions,
    });

  captureActions['runVorpal'] = require('./run-vorpal')(
    vorpalActions(state),
    state
  );

  captureActions.commanderAction = commanderAction({
    state,
    rootActions: captureActions,
    load,
  });
  return captureActions;
};

module.exports = { vorpalActions, commanderActions };
