const readModelShowResolvers = () => ({
  output,
  actions: { contactService, createTable }
}) => ({ id }) =>
  contactService({
    command: 'read-model-show-resolvers',
    id
  }).then(result => {
    if (result) {
      result.sort();
      const table = createTable(result, [{ caption: 'Resolver', width: 40 }]);
      output(table);
    }
  });

module.exports = readModelShowResolvers;
