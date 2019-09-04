const fs = require('fs-extra');
const { Promise } = require('bluebird');
const _ = require('lodash/fp');
const chalk = require('chalk');
const Gauge = require('gauge');

const aggregateExecuteCommands = () => ({
  output,
  actions: { postCommand, outputJson }
}) => ({ fileName, options = {} }) => {
  return fs
    .readJSON(fileName)
    .then(cmds => {
      const count = cmds.length;
      output(`Found ${count} commands`);
      let process = null;
      if (options.last) {
        process = _.takeRight(options.last);
        output(
          `Using commands ${count -
            options.last +
            1}-${count} from the end of the file`
        );
      } else if (options.skip || options.take) {
        process = _.compose([
          options.take ? _.take(options.take) : x => x,
          _.drop(options.skip || 0)
        ]);
        output(
          `Using commands ${(options.skip || 0) + 1}-${
            options.take ? (options.skip || 0) + options.take : count
          }`
        );
      }
      return (process && process(cmds)) || cmds;
    })
    .then(cmds => {
      if (options.showCommands) {
        outputJson(cmds);
      }
      return cmds;
    })
    .then(cmds => {
      if (!options.testRun) {
        const gauge = new Gauge();
        gauge.show('Executing commands', 0);
        const pulseInterval = setInterval(() => {
          gauge.pulse();
        }, 200);
        return Promise.mapSeries(
          cmds,
          ({ aggregateName, aggregateId, command, payload }, index, length) =>
            postCommand(aggregateName, aggregateId, command, payload).then(
              res => {
                gauge.show(
                  `Executed command ${index + 1}/${length}`,
                  (index + 1) / length
                );
                return res;
              }
            )
        ).then(res => {
          clearInterval(pulseInterval);
          gauge.hide();
          output(`Executed ${cmds.length} commands`);
          return res;
        });
      } else return Promise.resolve();
    })
    .catch(err => {
      output(chalk.red(`Error executing commands from file: ${err}`));
    });
};

module.exports = aggregateExecuteCommands;
