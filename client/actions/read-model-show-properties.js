const readModelShowProperties = () => ({
  output,
  actions: { contactService, createTable },
}) => ({ id }) =>
  contactService({ command: 'list-properties', id }).then((json) => {
    if (json) {
      const data = Object.keys(json).reduce(
        (r, v) => [...r, { name: v, value: json[v] }],
        []
      );
      const table = createTable(data, [
        { name: 'name', width: 40 },
        {
          name: 'value',
          width:
            process.stdout.columns -
            4 /* left and right table margins */ -
            (4 - 1) * 1 /* vertical spacers between fields */ -
            40 /* widths of other columns */,
        },
      ]);
      output(table);
    }
  });

module.exports = readModelShowProperties;
