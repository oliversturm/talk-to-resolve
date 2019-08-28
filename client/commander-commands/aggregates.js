module.exports = (commander, actions) => {
  commander
    .command('agg')
    .description('Show all aggregates')
    .action(actions.commanderAction(actions.aggregateShow));

  commander
    .command('agg-cmds <name>')
    .description('Show aggregate commands')
    .action(actions.commanderAction(actions.aggregateShowCommands));

  commander
    .command(
      'agg-exec <aggregateName> <aggregateId> <command> <payloadJson...>'
    )
    .description('Execute aggregate command')
    .action(actions.commanderAction(actions.aggregateExecuteCommand));
};
