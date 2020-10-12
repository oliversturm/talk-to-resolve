const readModelStatusAllHandler = (req, res) =>
  Promise.all(
    req.resolve.readModels
      .map(({ name }) => name)
      .map((eventSubscriber) =>
        req.resolve.eventBus.status({ eventSubscriber })
      )
  ).then((statuses) => {
    res.json(statuses);
  });

const readModelStatusHandler = (req, res, { id }) =>
  req.resolve.eventBus.status({ eventSubscriber: id }).then((status) => {
    res.json(status);
  });

const listPropertiesHandler = (req, res, { id }) =>
  req.resolve.eventBus
    .listProperties({ eventSubscriber: id })
    .then((status) => {
      res.json(status);
    });

const readModelQueryHandler = (req, res, { id, resolver, resolverArgs }) =>
  req.resolve
    .executeQuery({
      modelName: id,
      resolverName: resolver,
      resolverArgs,
      jwt: req.jwt,
    })
    .then((result) => {
      res.json(result);
    });

const readModelShowResolversHandler = (req, res, { id }) =>
  Promise.resolve(req.resolve.readModels.find(({ name }) => name === id))
    .then((readModel) => Object.getOwnPropertyNames(readModel.resolvers))
    .then((resolverNames) => {
      res.json(resolverNames);
    });

const getAggregateCommands = (verbose) => (agg) => {
  return Object.getOwnPropertyNames(agg.commands).map((command) => ({
    command,
    decoded: verbose ? agg.commands[command].toString() : '',
  }));
};

const aggregateListHandler = (req, res) =>
  Promise.resolve(
    req.resolve.aggregates.map((agg) => ({
      name: agg.name,
      isSystemAggregate: agg.isSystemAggregate,
      commands: getAggregateCommands(agg).length,
    }))
  ).then((list) => {
    res.json(list);
  });

const aggregateListCommandsHandler = (req, res, { aggregateName, verbose }) =>
  Promise.resolve(
    req.resolve.aggregates.find(({ name: n }) => n === aggregateName)
  )
    .then(getAggregateCommands(verbose))
    .then((cmds) => {
      res.json(cmds);
    });

const eventsLoadHandler = (
  req,
  res,
  { eventTypes, aggregateIds, startTime, finishTime, limit }
) =>
  req.resolve.eventStore
    .loadEvents({ eventTypes, aggregateIds, startTime, finishTime, limit })
    .then(({ events }) => {
      res.json(events);
    });

const commandHandlers = {
  'read-model-status-all': readModelStatusAllHandler,
  'read-model-status': readModelStatusHandler,
  'read-model-query': readModelQueryHandler,
  'list-properties': listPropertiesHandler,
  'read-model-show-resolvers': readModelShowResolversHandler,
  'aggregate-list': aggregateListHandler,
  'aggregate-list-commands': aggregateListCommandsHandler,
  'events-load': eventsLoadHandler,
};

const handler = (req, res, validateJwt) => {
  if (validateJwt) validateJwt(req.jwt);

  const payload = JSON.parse(req.body);
  if (!payload || !payload.command || !commandHandlers[payload.command]) {
    res.status(400);
    return Promise.resolve();
  } else return commandHandlers[payload.command](req, res, payload);
};

module.exports = { handleTtr: handler };
