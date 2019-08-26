const chalk = require('chalk');
const fs = require('fs-extra');
const { loadConfig, configFileName } = require('../loadConfig');
const { getJsonString } = require('./json');

module.exports = (vorpal, state) => {
  vorpal
    .command('config', 'Show the current TTR configuration')
    .action(function(args, cb) {
      this.log(state.getVisualState());
      cb();
    });

  vorpal
    .command('config load [name]', 'Load TTR configuration')
    .action(function(args, cb) {
      const configFile = configFileName();
      const config = loadConfig(configFile);
      const name = args.name || 'default';
      if (config[name]) {
        state.loadState(config[name]);
        this.log(chalk.green(`Config '${name}' loaded from ${configFile}`));
        vorpal.delimiter(state.prompt());
        cb();
      } else {
        this.log(chalk.red(`Config '${name}' not found in ${configFile}`));
        cb();
      }
    });

  vorpal
    .command('config save [name]', 'Save TTR configuration')
    .action(function(args, cb) {
      if (state.isStateSaveable()) {
        const configFile = configFileName();
        const name = args.name || 'default';
        const config = loadConfig(configFile);
        const self = this;
        const doSave = () => {
          config[name] = state.getSaveableState();
          fs.outputFileSync(configFile, JSON.stringify(config, null, 2));
          self.log(chalk.green(`Saved config '${name}' to ${configFile}`));
        };
        if (config[name]) {
          return this.prompt(
            {
              type: 'confirm',
              name: 'continue',
              default: false,
              message: `The entry '${name}' exists. Overwrite?`
            },
            function(result) {
              if (!result.continue) {
                self.log(chalk.red('Save operation cancelled'));
                cb();
              } else {
                doSave();
                cb();
              }
            }
          );
        } else {
          doSave();
          cb();
        }
      } else {
        vorpal.log(chalk.red('State is incomplete, not saved'));
        cb();
      }
    });

  vorpal
    .command(
      'config set jwt secret <secret...>',
      'Set the JWT secret to use when generating the required access token'
    )
    .action(function(args, cb) {
      const secret = Array.isArray(args.secret)
        ? args.secret.join(' ')
        : args.secret;
      state.setJwtSecret(secret);
      this.log(chalk.green(`JWT Secret set to '${secret}'`));
      vorpal.delimiter(state.prompt());
      cb();
    });

  vorpal
    .command(
      'config set service url <url>',
      'Set the service URL for TTR to talk to'
    )
    .action(function(args, cb) {
      state.setServiceUrl(args.url);
      this.log(chalk.green(`Service URL set to ${args.url}`));
      vorpal.delimiter(state.prompt());
      cb();
    });

  vorpal
    .command(
      'config set token template <templateJson...>',
      'Set the template for the security token'
    )
    .action(function(args, cb) {
      getJsonString(args.templateJson)
        .then(template => {
          state.setTokenTemplate(template);
          this.log(chalk.green(`Token template set to ${template}`));
          vorpal.delimiter(state.prompt());
          cb();
        })
        .catch(err => {
          this.log(chalk.red(err));
          cb();
        });
    });
};
