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

  vorpal
    .command(
      'aggregate execute commands <fileName>',
      'Execute aggregate commands from a file'
    )
    .option('-l, --last <number>', 'Execute only the last <number> items')
    .option('-s, --skip <number>', 'Skip <number> commands from the start')
    .option(
      '-t, --take <number>',
      'Execute <number> elements (can be combined with skip)'
    )
    .option('--testRun', "Don't execute anything")
    .option('-v, --showCommands', 'Show commands before processing')
    .action(actions.vorpalAction(actions.aggregateExecuteCommands));
};
