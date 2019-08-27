const fetch = require('isomorphic-fetch');
const jwt = require('jsonwebtoken');
const chalk = require('chalk');

const postCommand = ({ state }) => ({ output }) => (
  aggregateName,
  aggregateId,
  command,
  payload
) => {
  if (!state.stateOk()) {
    output(chalk.red('Incomplete config'));
    return Promise.resolve(null);
  }

  const { jwtSecret, serviceUrl, tokenTemplate } = state.getState();

  const token = jwt.sign(tokenTemplate, jwtSecret);

  return fetch(`${serviceUrl}/api/commands`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ aggregateName, aggregateId, type: command, payload })
  })
    .then(res => {
      if (!res.ok) {
        const reason = `POST failed with code ${res.status}: ${res.statusText}`;
        return Promise.reject(reason);
      } else {
        return res.json();
      }
    })
    .catch(err => {
      output(chalk.red(err));
    });
};

module.exports = postCommand;
