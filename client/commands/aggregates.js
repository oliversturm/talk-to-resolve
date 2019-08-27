const { contactService, postCommand } = require('./communication');
const { createTable } = require('./tables');
const { highlight } = require('cardinal');
const fs = require('fs-extra');
const chalk = require('chalk');
const { getJsonValue } = require('./json');

module.exports = (vorpal, state) => {
  vorpal
    .command('aggregate show', 'Show all aggregates')
    .action(function(args, cb) {
      const context = this;
      contactService(context, state, {
        command: 'aggregate-list'
      }).then(result => {
        if (result) {
          const table = createTable(result, [
            {
              name: 'name',
              caption: 'Aggregate Name',
              width: 25
            },
            {
              name: 'isSystemAggregate',
              caption: 'System',
              width: 6,
              processing: [
                { type: 'toBool' },
                { type: 'markProblem', pred: b => b }
              ]
            },
            { name: 'commands', width: 8, alignment: 'right' }
          ]);

          context.log(table);
        }
        cb();
      });
    });

  vorpal
    .command('aggregate show commands <name>', 'Show aggregate commands')
    .action(function({ name }, cb) {
      const context = this;
      contactService(context, state, {
        command: 'aggregate-show-commands',
        name
      }).then(result => {
        if (result) {
          result.sort();
          const table = createTable(result, [
            { caption: 'Command', width: 40 }
          ]);
          context.log(table);
        }
        cb();
      });
    });

  vorpal
    .command(
      'aggregate execute command <aggregateName> <aggregateId> <command> <payloadJson...>',
      'Execute aggregate command'
    )
    .action(function({ aggregateName, aggregateId, command, payloadJson }, cb) {
      const context = this;
      const start = payloadJson
        ? getJsonValue(payloadJson)
        : Promise.resolve({});
      start
        .then(payload =>
          postCommand(
            context,
            state,
            aggregateName,
            aggregateId,
            command,
            payload
          )
        )
        .then(() => {
          cb();
        });
    });
};
