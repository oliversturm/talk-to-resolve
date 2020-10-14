const runVorpal = (actions, state) => () => {
  const vorpal = require('vorpal')();
  const configCommands = require('../vorpal-commands/config');
  const readModelCommands = require('../vorpal-commands/read-models');
  const aggregateCommands = require('../vorpal-commands/aggregates');
  const viewModelCommands = require('../vorpal-commands/view-models');
  const eventCommands = require('../vorpal-commands/events');

  vorpal
    .history('ttr')
    .use(configCommands, actions)
    .use(readModelCommands, actions)
    .use(aggregateCommands, actions)
    .use(viewModelCommands, actions)
    .use(eventCommands, actions)
    .delimiter(state.prompt());

  state.onPromptChanged((p) => vorpal.delimiter(p));
  vorpal.show();
};

module.exports = runVorpal;
