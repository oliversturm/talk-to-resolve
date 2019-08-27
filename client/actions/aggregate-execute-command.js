const { getJsonValue } = require('./json');

const aggregateExecuteCommand = () => ({ actions: { postCommand } }) => ({
  aggregateName,
  aggregateId,
  command,
  payloadJson
}) => {
  const start = payloadJson ? getJsonValue(payloadJson) : Promise.resolve({});
  return start.then(payload =>
    postCommand(aggregateName, aggregateId, command, payload)
  );
};

module.exports = aggregateExecuteCommand;
