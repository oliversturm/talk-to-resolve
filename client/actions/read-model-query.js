const { getJsonValue } = require('./json');

const readModelQuery = () => ({
  output,
  actions: { contactService, createTable, outputFile, outputJson }
}) => ({ id, resolver, resolverArgsJson, options }) => {
  const payload = {
    command: 'read-model-query',
    id,
    resolver
  };

  const start = resolverArgsJson
    ? getJsonValue(resolverArgsJson)
    : Promise.resolve({});

  return start
    .then(resolverArgs => contactService({ ...payload, resolverArgs }))
    .then(result => {
      if (result) {
        if (options.file) {
          return outputFile(options.file, result);
        } else if (options.json) {
          outputJson(result);
        } else {
          output(createTable(result));
        }
      }
    });
};

module.exports = readModelQuery;
