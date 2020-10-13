const readModelDeleteProperty = () => ({ actions: { contactService } }) => ({
  readModelName,
  propertyName,
}) => {
  return contactService({
    command: 'read-model-delete-property',
    readModelName,
    propertyName,
  });
};

module.exports = readModelDeleteProperty;
