const { getJsonValue } = require('./json');
const chalk = require('chalk');

const aggregateExecuteCommand = () => ({
  output,
  actions: { postCommand },
}) => ({ aggregateName, aggregateId, command, payloadJson }) => {
  const start = payloadJson ? getJsonValue(payloadJson) : Promise.resolve({});
  return start
    .then((payload) =>
      postCommand(aggregateName, aggregateId.toString(), command, payload)
    )
    .catch((err) => {
      output(chalk.red(`Error executing command: ${err}`));
    });
};

module.exports = aggregateExecuteCommand;
