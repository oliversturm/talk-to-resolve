module.exports = (vorpal, actions) => {
  vorpal
    .command('aggregate list', 'List known aggregates')
    .action(actions.vorpalAction(actions.aggregateList));

  vorpal
    .command('aggregate commands <aggregateName>', 'List aggregate commands')
    .option('-v, --verbose', 'Include command code')
    .action(actions.vorpalAction(actions.aggregateListCommands));

  vorpal
    .command(
      'aggregate execute <aggregateName> <aggregateId> <command> <payloadJson...>',
      'Execute aggregate command'
    )
    .action(actions.vorpalAction(actions.aggregateExecuteCommand));

  vorpal
    .command(
      'aggregate execute-file <fileName>',
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
