const readModelStatus = () => ({
  output,
  actions: { contactService, createTable }
}) => ({ id }) => {
  const payload = id
    ? { command: 'read-model-status', id }
    : { command: 'read-model-status-all' };
  return contactService(payload).then(json => {
    if (json) {
      const table = createTable(json, [
        { name: 'listenerId', width: 12 },
        {
          name: 'status',
          width: 10,
          processing: [{ type: 'markProblem', pred: s => s !== 'running' }]
        },
        {
          name: 'lastError',
          width: 20,
          processing: [
            { type: ['stringify'] },
            { type: 'markProblem', pred: s => s !== 'null' }
          ]
        },
        {
          name: 'lastEvent',
          width:
            process.stdout.columns -
            4 /* left and right table margins */ -
            (4 - 1) * 3 /* vertical spacers between fields */ -
            (12 + 10 + 20) /* widths of other columns */,
          processing: [{ type: 'stringify' }, { type: 'highlight' }]
        }
      ]);
      output(table);
    }
  });
};

module.exports = readModelStatus;
