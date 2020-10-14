module.exports = (commander, actions) => {
  const vm = commander
    .command('view-model')
    .alias('vm')
    .alias('viewmodel')
    .alias('v')
    .description('View model commands');

  vm.command('query <viewModelName> [aggregateIds...]')
    .alias('q')
    .description('Query a view model')
    .option(
      '-j, --json',
      'Output result JSON instead of the default tabular format'
    )
    .option('-f, --file <file>', 'Save result JSON to file')
    .action(actions.commanderAction(actions.viewModelQuery));
};
