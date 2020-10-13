const readModelSetProperty = () => ({ actions: { contactService } }) => ({
  readModelName,
  propertyName,
  value,
}) => {
  return contactService({
    command: 'read-model-set-property',
    readModelName,
    propertyName,
    value,
  });
};

module.exports = readModelSetProperty;
