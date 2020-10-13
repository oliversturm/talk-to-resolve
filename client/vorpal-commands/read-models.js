module.exports = (vorpal, actions) => {
  vorpal
    .command('read-model status [id]', 'Show status of one or all read models')
    .action(actions.vorpalAction(actions.readModelStatus));

  vorpal
    .command('read-model list properties <id>', 'List read model properties')
    .action(actions.vorpalAction(actions.readModelShowProperties));

  vorpal
    .command('read-model list resolvers <id>', 'List read model resolvers')
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

  vorpal
    .command('read-model pause <id>', 'Pause a read model')
    .action(actions.vorpalAction(actions.readModelPause));

  vorpal
    .command('read-model resume <id>', 'Resume a read model')
    .action(actions.vorpalAction(actions.readModelResume));

  vorpal
    .command('read-model reset <id>', 'Reset a read model')
    .action(actions.vorpalAction(actions.readModelReset));

  vorpal
    .command(
      'read-model set property <readModelName> <propertyName> <value>',
      'Set a property for the given read model'
    )
    .action(actions.vorpalAction(actions.readModelSetProperty));

  vorpal
    .command(
      'read-model get property <readModelName> <propertyName>',
      'Get the value of a property for the given read model'
    )
    .action(actions.vorpalAction(actions.readModelGetProperty));

  vorpal
    .command(
      'read-model delete property <readModelName> <propertyName>',
      'Delete a property from the given read model'
    )
    .action(actions.vorpalAction(actions.readModelDeleteProperty));
};
