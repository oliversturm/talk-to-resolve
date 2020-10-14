module.exports = (vorpal, actions) => {
  vorpal
    .command(
      'view-model query <viewModelName> [aggregateIds...]',
      'Query a read model'
    )
    .option(
      '-j, --json',
      'Output result JSON instead of the default tabular format'
    )
    .option('-f, --file <file>', 'Save result JSON to file')
    .action(actions.vorpalAction(actions.viewModelQuery));
};
