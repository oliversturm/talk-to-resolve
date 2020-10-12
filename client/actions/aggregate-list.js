const aggregateList = () => ({
  output,
  actions: { contactService, createTable },
}) => () =>
  contactService({
    command: 'aggregate-list',
  }).then((result) => {
    if (result) {
      const table = createTable(result, [
        {
          name: 'name',
          caption: 'Aggregate Name',
          width: 25,
        },
        {
          name: 'isSystemAggregate',
          caption: 'System',
          width: 6,
          processing: [
            { type: 'toBool' },
            { type: 'markProblem', pred: (b) => b },
          ],
        },
        { name: 'commands', width: 8, alignment: 'right' },
      ]);

      output(table);
    }
  });

module.exports = aggregateList;
