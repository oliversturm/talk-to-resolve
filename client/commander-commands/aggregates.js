module.exports = (commander, actions) => {
  commander
    .command('agg')
    .description('Show all aggregates')
    .action(actions.commanderAction(actions.aggregateShow));

  commander
    .command('agg-cmds <name>')
    .description('Show aggregate commands')
    .option('-v, --verbose', 'Include command code')
    .action(actions.commanderAction(actions.aggregateShowCommands));

  commander
    .command(
      'agg-exec <aggregateName> <aggregateId> <command> <payloadJson...>'
    )
    .description('Execute aggregate command')
    .action(actions.commanderAction(actions.aggregateExecuteCommand));

  commander
    .command('agg-exec-file <fileName>')
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
