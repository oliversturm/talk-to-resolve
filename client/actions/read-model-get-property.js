const readModelGetProperty = () => ({
  output,
  actions: { contactService, createTable },
}) => ({ readModelName, propertyName }) =>
  contactService({
    command: 'read-model-get-property',
    readModelName,
    propertyName,
  }).then((json) => {
    if (json) {
      const table = createTable(json, [
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

module.exports = readModelGetProperty;
