const { table } = require('table');
const chalk = require('chalk');
const { flow } = require('lodash');
const { highlight } = require('cardinal');

const makeCaption = s =>
  s.replace(/([A-Z])/g, ' $1').replace(/^[a-z]/, c => c.toUpperCase());

const processors = {
  stringify: () => s => JSON.stringify(s),
  highlight: () => s => highlight(s),
  default: () => s => s,
  markProblem: ({ pred }) => s => (pred && pred(s) ? chalk.red(s) : s),
  readableTime: () => s => new Date(s).toLocaleString()
};

const processingPipe = p => {
  if (!p) return processors.default();
  if (typeof p === 'string') return processingPipe([{ type: p }]);
  return flow(p.map(p => (processors[p.type] || processors.default)(p)));
};

const createFieldConfig = json => {
  // as long as this is called only from createTable, we can
  // assume that `json` is an array with at least one item
  const item = json[0];
  const fields = Object.keys(item);
  const width = Math.floor(
    (process.stdout.columns -
    4 /* left and right table margins */ -
      (fields.length - 1) * 3) /* vertical spacers between fields */ /
      fields.length
  );
  return Object.keys(item).map(f => ({
    name: f,
    width,
    processing: [{ type: 'stringify' }, { type: 'highlight' }]
  }));
};

const createTable = (json, fieldConfig) => {
  if (!Array.isArray(json)) return createTable([json], fieldConfig);
  if (json.length === 0) return '';
  if (!fieldConfig) return createTable(json, createFieldConfig(json));
  const config = {
    columns: fieldConfig.reduce(
      (r, { width, alignment }, index) => ({
        ...r,
        [index]: { width, alignment: alignment || 'left' }
      }),
      {}
    )
  };
  const data = Array.from(
    (function*(json) {
      yield fieldConfig
        .map(({ caption, name }) => caption || makeCaption(name))
        .map(x => chalk.bold(x));
      for (const row of json) {
        yield fieldConfig.map(({ name, processing }) =>
          processingPipe(processing)(row[name])
        );
      }
    })(json)
  );
  return table(data, config);
};

module.exports = { createTable };
