module.exports = (commander, actions) => {
  const aggregate = commander.command('aggregate').alias('agg').alias('a');

  aggregate
    .command('list')
    .alias('l')
    .description('List known aggregates')
    .action(actions.commanderAction(actions.aggregateList));

  aggregate
    .command('commands <aggregateName>')
    .alias('c')
    .description('List aggregate commands')
    .option('-v, --verbose', 'Include command code')
    .action(actions.commanderAction(actions.aggregateListCommands));

  aggregate
    .command('exec <aggregateName> <aggregateId> <command> <payloadJson...>')
    .alias('x')
    .description('Execute aggregate command')
    .action(actions.commanderAction(actions.aggregateExecuteCommand));

  aggregate
    .command('exec-file <fileName>')
    .alias('xf')
    .description('Execute aggregate commands from a file')
    .option('-l, --last <number>', 'Execute only the last <number> items')
    .option('-s, --skip <number>', 'Skip <number> commands from the start')
    .option(
      '-t, --take <number>',
      'Execute <number> elements (can be combined with skip)'
    )
    .option('--testRun', "Don't execute anything")
    .option('-v, --showCommands', 'Show commands before processing')
    .action(actions.commanderAction(actions.aggregateExecuteCommands));
};
