const aggregateListCommands = () => ({
  output,
  actions: { contactService, createTable },
}) => ({ aggregateName, options = {} }) =>
  contactService({
    command: 'aggregate-list-commands',
    aggregateName,
    verbose: options.verbose,
  }).then((result) => {
    if (result) {
      result.sort();
      const basicCols = [{ name: 'command', width: 40 }];
      const verboseCols = options.verbose
        ? [
            {
              name: 'decoded',
              width:
                process.stdout.columns -
                4 /* left and right table margins */ -
                (4 - 1) * 1 /* vertical spacers between fields */ -
                40 /* widths of other columns */,
              processing: [{ type: 'highlight' }],
            },
          ]
        : [];
      const table = createTable(result, [...basicCols, ...verboseCols]);
      output(table);
    }
  });

module.exports = aggregateListCommands;
