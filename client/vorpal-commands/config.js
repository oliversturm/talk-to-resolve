module.exports = (vorpal, actions) => {
  vorpal
    .command('config', 'Show the current TTR configuration')
    .action(actions.vorpalAction(actions.config));

  vorpal
    .command('config load [name]', 'Load TTR configuration')
    .action(actions.vorpalAction(actions.configLoad));

  vorpal
    .command('config save [name]', 'Save TTR configuration')
    .action(actions.vorpalAction(actions.configSave));

  vorpal
    .command(
      'config set jwt secret <secret...>',
      'Set the JWT secret to use when generating the required access token'
    )
    .action(actions.vorpalAction(actions.configSetJwtSecret));

  vorpal
    .command(
      'config set service url <url>',
      'Set the service URL for TTR to talk to'
    )
    .action(actions.vorpalAction(actions.configSetServiceUrl));

  vorpal
    .command(
      'config set token template <templateJson...>',
      'Set the template for the security token'
    )
    .action(actions.vorpalAction(actions.configSetTokenTemplate));
};
