module.exports = (vorpal, actions) => {
  vorpal
    .command('aggregate show', 'Show all aggregates')
    .action(actions.vorpalAction(actions.aggregateShow));

  vorpal
    .command('aggregate show commands <name>', 'Show aggregate commands')
    .action(actions.vorpalAction(actions.aggregateShowCommands));

  vorpal
    .command(
      'aggregate execute command <aggregateName> <aggregateId> <command> <payloadJson...>',
      'Execute aggregate command'
    )
    .action(actions.vorpalAction(actions.aggregateExecuteCommand));
};
