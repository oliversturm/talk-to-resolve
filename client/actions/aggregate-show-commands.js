const aggregateShowCommands = () => ({
  output,
  actions: { contactService, createTable }
}) => ({ name }) =>
  contactService({
    command: 'aggregate-show-commands',
    name
  }).then(result => {
    if (result) {
      result.sort();
      const table = createTable(result, [{ caption: 'Command', width: 40 }]);
      output(table);
    }
  });

module.exports = aggregateShowCommands;
