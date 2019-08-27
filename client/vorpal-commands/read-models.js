module.exports = (vorpal, actions) => {
  vorpal
    .command('read-model status [id]', 'Show status of one or all read models')
    .action(actions.vorpalAction(actions.readModelStatus));

  vorpal
    .command('read-model show properties <id>', 'Show read model properties')
    .action(actions.vorpalAction(actions.readModelShowProperties));

  vorpal
    .command('read-model show resolvers <id>', 'Show read model resolvers')
    .action(actions.vorpalAction(actions.readModelShowResolvers));

  vorpal
    .command(
      'read-model query <id> <resolver> [resolverArgsJson...]',
      'Query a read model'
    )
    .option(
      '-j, --json',
      'Output result JSON instead of the default tabular format'
    )
    .option('-f, --file <file>', 'Save result JSON to file')
    .action(actions.vorpalAction(actions.readModelQuery));
};
