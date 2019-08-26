const vorpal = require('vorpal')();
const state = require('./state')();
const configCommands = require('./commands/config');
const readModelCommands = require('./commands/read-models');
const aggregateCommands = require('./commands/aggregates');
const eventCommands = require('./commands/events');

process.on('uncaughtException', err => {
  console.log('Uncaught exception', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

vorpal
  .history('ttr')
  .use(configCommands, state)
  .use(readModelCommands, state)
  .use(aggregateCommands, state)
  .use(eventCommands, state)
  .delimiter(state.prompt())
  .show();
