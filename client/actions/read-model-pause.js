const readModelPause = () => ({ actions: { contactService } }) => ({ id }) => {
  return contactService({ command: 'read-model-pause', id });
};

module.exports = readModelPause;
