const viewModelQuery = () => ({
  output,
  actions: { contactService, createTable, outputFile, outputJson },
}) => ({ viewModelName, aggregateIds, options }) => {
  const payload = {
    command: 'view-model-query',
    viewModelName,
    aggregateIds: aggregateIds.join(''),
  };

  return contactService(payload)
    .then((result) => result && result.data)
    .then((result) => {
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

module.exports = viewModelQuery;
