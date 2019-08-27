const { highlight } = require('cardinal');

const outputJson = () => ({ output }) => (
  data,
  useHighlight = true,
  human = true
) =>
  Promise.resolve(human ? JSON.stringify(data, null, 2) : JSON.stringify(data))
    .then(text => (useHighlight ? highlight(text) : text))
    .then(text => {
      output(text);
    });

module.exports = outputJson;
