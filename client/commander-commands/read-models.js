module.exports = (commander, actions) => {
  const rm = commander
    .command('read-model')
    .alias('rm')
    .alias('readmodel')
    .alias('r')
    .description('Read model commands');

  rm.command('status [id]', { isDefault: true })
    .alias('s')
    .description('Show status of one or all read models')
    .action(actions.commanderAction(actions.readModelStatus));

  rm.command('properties <id>')
    .alias('props')
    .description('List read model properties')
    .action(actions.commanderAction(actions.readModelShowProperties));

  const property = rm
    .command('property')
    .alias('prop')
    .description('Property commands');

  property
    .command('set <readModelName> <propertyName> <value>')
    .alias('s')
    .description('Set a property for the given read model')
    .action(actions.commanderAction(actions.readModelSetProperty));

  property
    .command('get <readModelName> <propertyName>')
    .alias('g')
    .description('Get the value of a property for the given read model')
    .action(actions.commanderAction(actions.readModelGetProperty));

  property
    .command('delete <readModelName> <propertyName>')
    .description('Delete a property from the given read model')
    .action(actions.commanderAction(actions.readModelDeleteProperty));

  rm.command('resolvers <id>')
    .alias('res')
    .alias('r')
    .description('List read model resolvers')
    .action(actions.commanderAction(actions.readModelShowResolvers));

  rm.command('query <id> <resolver> [resolverArgsJson...]')
    .alias('q')
    .description('Query a read model')
    .option(
      '-j, --json',
      'Output result JSON instead of the default tabular format'
    )
    .option('-f, --file <file>', 'Save result JSON to file')
    .action(actions.commanderAction(actions.readModelQuery));

  rm.command('pause <id>')
    .description('Pause a read model')
    .action(actions.commanderAction(actions.readModelPause));

  rm.command('resume <id>')
    .description('Resume a read model')
    .action(actions.commanderAction(actions.readModelResume));

  rm.command('reset <id>')
    .description('Reset a read model')
    .action(actions.commanderAction(actions.readModelReset));
};
