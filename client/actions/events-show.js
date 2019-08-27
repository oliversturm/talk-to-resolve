const { getJsonValue } = require('./json');

const getTimestamp = ts => (typeof ts === 'string' ? Date.parse(ts) : ts);
// make sure the string has [ ] around it
const prepareListString = s =>
  s.replace(/^(\s*[^\s[])/, '[$1').replace(/([^\]\s]\s*)$/, '$1]');
const getList = json =>
  json ? getJsonValue(prepareListString(json)) : Promise.resolve(undefined);

const eventsShow = () => ({
  output,
  actions: { contactService, outputFile, outputJson, createTable }
}) => ({ options }) => {
  const payload = { command: 'events-load' };

  const start = Promise.all([
    getList(options.aggregateIds),
    getList(options.eventTypes),
    Promise.resolve(getTimestamp(options.startTime)),
    Promise.resolve(getTimestamp(options.endTime))
  ]);

  return start
    .then(([aggregateIds, eventTypes, startTime, finishTime]) =>
      contactService({
        ...payload,
        aggregateIds,
        eventTypes,
        startTime,
        finishTime
      })
    )
    .then(json => {
      if (json) {
        if (options.file) {
          return outputFile(options.file, json);
        } else if (options.json) {
          outputJson(json);
        } else {
          const table = createTable(json, [
            { name: 'aggregateId', width: 36 },
            {
              name: 'timestamp',
              width: 13,
              processing: options.humanReadable ? 'readableTime' : undefined
            },
            {
              name: 'aggregateVersion',
              caption: 'Agg/V',
              width: 5,
              alignment: 'right'
            },
            { name: 'type', width: 30 },
            {
              name: 'payload',
              width:
                process.stdout.columns -
                4 /* left and right table margins */ -
                (5 - 1) * 3 /* vertical spacers between fields */ -
                (36 + 13 + 5 + 30) /* widths of other columns */,
              processing: [{ type: 'stringify' }, { type: 'highlight' }]
            }
          ]);
          output(table);
        }
      }
    });
};

module.exports = eventsShow;
