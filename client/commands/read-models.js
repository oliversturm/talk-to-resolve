const { contactService } = require('./communication');
const { createTable } = require('./tables');
const { highlight } = require('cardinal');
const fs = require('fs-extra');
const chalk = require('chalk');
const { getJsonValue } = require('./json');

module.exports = (vorpal, state) => {
  vorpal
    .command('read-model status [id]', 'Show status of one or all read models')
    .action(function({ id }, cb) {
      const context = this;
      const payload = id
        ? { command: 'read-model-status', id }
        : { command: 'read-model-status-all' };
      contactService(context, state, payload).then(json => {
        if (json) {
          const table = createTable(json, [
            { name: 'listenerId', width: 12 },
            {
              name: 'status',
              width: 10,
              processing: [{ type: 'markProblem', pred: s => s !== 'running' }]
            },
            {
              name: 'lastError',
              width: 20,
              processing: [
                { type: ['stringify'] },
                { type: 'markProblem', pred: s => s !== 'null' }
              ]
            },
            {
              name: 'lastEvent',
              width:
                process.stdout.columns -
                4 /* left and right table margins */ -
                (4 - 1) * 3 /* vertical spacers between fields */ -
                (12 + 10 + 20) /* widths of other columns */,
              processing: [{ type: 'stringify' }, { type: 'highlight' }]
            }
          ]);
          context.log(table);
        }
        cb();
      });
    });

  vorpal
    .command('read-model show properties <id>', 'Show read model properties')
    .action(function({ id }, cb) {
      const context = this;
      contactService(context, state, { command: 'list-properties', id }).then(
        json => {
          if (json) {
            const data = Object.keys(json).reduce(
              (r, v) => [...r, { name: v, value: json[v] }],
              []
            );
            const table = createTable(data, [
              { name: 'name', width: 40 },
              {
                name: 'value',
                width: 60
              }
            ]);
            context.log(table);
          }
          cb();
        }
      );
    });

  vorpal
    .command('read-model show resolvers <id>', 'Show read model resolvers')
    .action(function({ id }, cb) {
      const context = this;
      contactService(context, state, {
        command: 'read-model-show-resolvers',
        id
      }).then(result => {
        if (result) {
          context.log(highlight(JSON.stringify(result)));
        }
        cb();
      });
    });

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
    .action(function({ id, resolver, resolverArgsJson, options }, cb) {
      const context = this;
      const payload = {
        command: 'read-model-query',
        id,
        resolver
      };

      const start = resolverArgsJson
        ? getJsonValue(resolverArgsJson)
        : Promise.resolve({});

      start
        .then(resolverArgs =>
          contactService(context, state, { ...payload, resolverArgs })
        )
        .then(result => {
          if (result) {
            const saveToFile = () => {
              fs.outputFileSync(options.file, JSON.stringify(result, null, 2));
              context.log(chalk.green(`Saved result to ${options.file}`));
              cb();
            };
            if (options.file) {
              if (fs.existsSync(options.file)) {
                return context.prompt(
                  {
                    type: 'confirm',
                    name: 'continue',
                    default: false,
                    message: `The file ${options.file} exists. Overwrite?`
                  },
                  function(result) {
                    if (!result.continue) {
                      context.log(chalk.red('Save operation cancelled'));
                      cb();
                    } else {
                      saveToFile();
                      cb();
                    }
                  }
                );
              } else {
                saveToFile();
                cb();
              }
            } else if (options.json) {
              context.log(highlight(JSON.stringify(result, null, 2)));
              cb();
            } else {
              try {
                context.log(createTable(result));
              } catch (e) {
                context.log(
                  chalk.red(
                    'The result set has two many columns to display in tabular format. Consider using --json.'
                  )
                );
              }
              cb();
            }
          } else {
            cb();
          }
        });
    });
};
