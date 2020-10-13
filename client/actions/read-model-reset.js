const readModelReset = () => ({ actions: { contactService } }) => ({ id }) => {
  return contactService({ command: 'read-model-reset', id });
};

module.exports = readModelReset;
