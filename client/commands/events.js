const { contactService } = require('./communication');
const { createTable } = require('./tables');
const { highlight } = require('cardinal');
const fs = require('fs-extra');
const chalk = require('chalk');
const { getJsonValue } = require('./json');

const getTimestamp = ts => (typeof ts === 'string' ? Date.parse(ts) : ts);
// make sure the string has [ ] around it
const prepareListString = s =>
  s.replace(/^(\s*[^\s[])/, '[$1').replace(/([^\]\s]\s*)$/, '$1]');
const getList = json =>
  json ? getJsonValue(prepareListString(json)) : Promise.resolve(undefined);

module.exports = (vorpal, state) => {
  vorpal
    .command('events show', 'Show events')
    .option(
      '-a, --aggregateIds <aggregateIdsJson>',
      'Filter for  aggregate ids'
    )
    .option('-t, --eventTypes <eventTypesJson>', 'Filter for event types')
    .option(
      '-s, --startTime <startTime>',
      'Filter for events with timestamp > startTime. Use numeric timestamp or string understood by Date.parse().'
    )
    .option(
      '-e, --endTime <endTime>',
      'Filter for events with timestamp < endTime. Use numeric timestamp or string understood by Date.parse().'
    )
    .option(
      '-h, --humanReadable',
      'Convert timestamps to readable values in tabular output'
    )
    .option(
      '-j, --json',
      'Output result JSON instead of the default tabular format'
    )
    .option('-f, --file <file>', 'Save result JSON to file')
    .action(function({ options }, cb) {
      const context = this;
      const payload = { command: 'events-load' };

      const start = Promise.all([
        getList(options.aggregateIds),
        getList(options.eventTypes),
        Promise.resolve(getTimestamp(options.startTime)),
        Promise.resolve(getTimestamp(options.endTime))
      ]);

      start
        .then(([aggregateIds, eventTypes, startTime, finishTime]) =>
          contactService(context, state, {
            ...payload,
            aggregateIds,
            eventTypes,
            startTime,
            finishTime
          })
        )
        .then(json => {
          if (json) {
            const saveToFile = () => {
              fs.outputFileSync(options.file, JSON.stringify(json, null, 2));
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
              context.log(highlight(JSON.stringify(json, null, 2)));
              cb();
            } else {
              try {
                const table = createTable(json, [
                  { name: 'aggregateId', width: 36 },
                  {
                    name: 'timestamp',
                    width: 13,
                    processing: options.humanReadable
                      ? 'readableTime'
                      : undefined
                  },
                  {
                    name: 'aggregateVersion',
                    caption: 'Agg/V',
                    width: 5,
                    alignment: 'right'
                  },
                  { name: 'type', width: 30 },
                  {
                    name: 'payload',
                    width:
                      process.stdout.columns -
                      4 /* left and right table margins */ -
                      (5 - 1) * 3 /* vertical spacers between fields */ -
                      (36 + 13 + 5 + 30) /* widths of other columns */,
                    processing: [{ type: 'stringify' }, { type: 'highlight' }]
                  }
                ]);
                context.log(table);
              } catch (e) {
                context.log(
                  chalk.red(
                    'The result set has two many columns to display in tabular format. Consider using --json.'
                  )
                );
              }
              cb();
            }
          }
        });
    });
};
