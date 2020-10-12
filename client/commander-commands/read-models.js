module.exports = (commander, actions) => {
  const rm = commander
    .command('read-model')
    .alias('rm')
    .alias('readmodel')
    .alias('r');

  rm.command('status [id]')
    .alias('s')
    .description('Show status of one or all read models')
    .action(actions.commanderAction(actions.readModelStatus));

  rm.command('properties <id>')
    .alias('props')
    .alias('p')
    .description('Show read model properties')
    .action(actions.commanderAction(actions.readModelShowProperties));

  rm.command('resolvers <id>')
    .alias('res')
    .alias('r')
    .description('Show read model resolvers')
    .action(actions.commanderAction(actions.readModelShowResolvers));

  commander
    .command('rm-query <id> <resolver> [resolverArgsJson...]')
    .description('Query a read model')
    .option(
      '-j, --json',
      'Output result JSON instead of the default tabular format'
    )
    .option('-f, --file <file>', 'Save result JSON to file')
    .action(actions.commanderAction(actions.readModelQuery));
};
