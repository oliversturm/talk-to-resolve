const state = require('./state')();
const { vorpalActions, commanderActions } = require('./actions');
const configLoad = require('./actions/config-load');

const runVorpal = () => {
  const vorpal = require('vorpal')();
  const configCommands = require('./vorpal-commands/config');
  const readModelCommands = require('./vorpal-commands/read-models');
  const aggregateCommands = require('./vorpal-commands/aggregates');
  const eventCommands = require('./vorpal-commands/events');

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
};

const commander = require('commander');
const path = require('path');
const pack = require(path.join(__dirname, '/../package.json'));
const addCommanderReadModelCommands = require('./commander-commands/read-models');
const addCommanderAggregateCommands = require('./commander-commands/aggregates');
const addCommanderEventCommands = require('./commander-commands/events');

commander
  .version(pack.version)
  .description(pack.description)

  .option(
    '-l, --load <config>',
    'Name of configuration section to load on startup',
    'default'
  );

const actions = commanderActions(state);

addCommanderReadModelCommands(commander, actions);
addCommanderAggregateCommands(commander, actions);
addCommanderEventCommands(commander, actions);

commander.parse(process.argv);

if (commander.args.length === 0)
  configLoad({ state })({ output: console.log })({ name: commander.load }).then(
    runVorpal
  );
