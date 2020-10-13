const readModelResume = () => ({ actions: { contactService } }) => ({ id }) => {
  return contactService({ command: 'read-model-resume', id });
};

module.exports = readModelResume;
