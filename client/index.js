const state = require('./state')();
const { commanderActions } = require('./actions');

const commander = require('commander');
const path = require('path');
const pack = require(path.join(__dirname, '/../package.json'));
const addCommanderReadModelCommands = require('./commander-commands/read-models');
const addCommanderAggregateCommands = require('./commander-commands/aggregates');
const addCommanderViewModelCommands = require('./commander-commands/view-models');
const addCommanderEventCommands = require('./commander-commands/events');
const addCommanderVorpalCommand = require('./commander-commands/vorpal');

commander
  .version(pack.version)
  .description(pack.description)

  .option(
    '-l, --load <config>',
    'Name of configuration section to load on startup',
    'default'
  );

const actions = commanderActions(state, commander.load);

addCommanderReadModelCommands(commander, actions);
addCommanderAggregateCommands(commander, actions);
addCommanderViewModelCommands(commander, actions);
addCommanderEventCommands(commander, actions);
addCommanderVorpalCommand(commander, actions);

commander.parse(process.argv);
