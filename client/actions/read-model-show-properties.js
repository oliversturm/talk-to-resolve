const readModelShowProperties = () => ({
  output,
  actions: { contactService, createTable }
}) => ({ id }) =>
  contactService({ command: 'list-properties', id }).then(json => {
    if (json) {
      const data = Object.keys(json).reduce(
        (r, v) => [...r, { name: v, value: json[v] }],
        []
      );
      const table = createTable(data, [
        { name: 'name', width: 40 },
        {
          name: 'value',
          width: 60
        }
      ]);
      output(table);
    }
  });

module.exports = readModelShowProperties;
