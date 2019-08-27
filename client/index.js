const vorpal = require('vorpal')();
const state = require('./state')();
const configCommands = require('./commands/config');
const readModelCommands = require('./commands/read-models');
// const aggregateCommands = require('./commands/aggregates');
// const eventCommands = require('./commands/events');
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
  // .use(aggregateCommands, state)
  // .use(eventCommands, state)
  .delimiter(state.prompt());

state.onPromptChanged(p => vorpal.delimiter(p));
vorpal.show();
