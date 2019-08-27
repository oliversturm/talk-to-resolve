const vorpal = require('vorpal')();
const state = require('./state')();
const configCommands = require('./vorpal-commands/config');
const readModelCommands = require('./vorpal-commands/read-models');
const aggregateCommands = require('./vorpal-commands/aggregates');
const eventCommands = require('./vorpal-commands/events');
const { vorpalActions } = require('./actions');

process.on('uncaughtException', err => {
  console.log('Uncaught exception', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

const actions = vorpalActions(state);

vorpal
  .history('ttr')
  .use(configCommands, actions)
  .use(readModelCommands, actions)
  .use(aggregateCommands, actions)
  .use(eventCommands, actions)
  .delimiter(state.prompt());

state.onPromptChanged(p => vorpal.delimiter(p));
vorpal.show();
