module.exports = (commander, actions) => {
  commander
    .command('rm-status [id]')
    .description('Show status of one or all read models')
    .action(actions.commanderAction(actions.readModelStatus));

  commander
    .command('rm-props <id>')
    .description('Show read model properties')
    .action(actions.commanderAction(actions.readModelShowProperties));

  commander
    .command('rm-res <id>')
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
