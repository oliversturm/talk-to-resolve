const readModelStatusAllHandler = (req, res) =>
  Promise.all(
    req.resolve.readModels
      .map(({ name }) => name)
      .map(req.resolve.eventBroker.status)
  ).then(statuses => {
    res.json(statuses);
  });

const readModelStatusHandler = (req, res, { id }) =>
  req.resolve.eventBroker.status(id).then(status => {
    res.json(status);
  });

const listPropertiesHandler = (req, res, { id }) =>
  req.resolve.eventBroker.listProperties(id).then(status => {
    res.json(status);
  });

const readModelQueryHandler = (req, res, { id, resolver, resolverArgs }) =>
  req.resolve
    .executeQuery({
      modelName: id,
      resolverName: resolver,
      resolverArgs,
      jwtToken: req.jwtToken
    })
    .then(result => {
      res.json(result);
    });

const readModelShowResolversHandler = (req, res, { id }) => {
  const readModel = req.resolve.readModels.find(({ name }) => name === id);
  const resolverNames = Object.getOwnPropertyNames(readModel.resolvers);
  res.json(resolverNames);
};

const getAggregateCommands = agg => Object.getOwnPropertyNames(agg.commands);

const aggregateListHandler = (req, res) => {
  res.json(
    req.resolve.aggregates.map(agg => ({
      name: agg.name,
      isSystemAggregate: agg.isSystemAggregate,
      commands: getAggregateCommands(agg).length
    }))
  );
};

const aggregateShowCommandsHandler = (req, res, { name }) => {
  const aggregate = req.resolve.aggregates.find(({ name: n }) => n === name);
  res.json(getAggregateCommands(aggregate));
};

const eventsLoadHandler = (
  req,
  res,
  { eventTypes, aggregateIds, startTime, finishTime }
) => {
  const events = [];
  const handler = o => {
    events.push(o);
  };
  return req.resolve.eventStore
    .loadEvents({ eventTypes, aggregateIds, startTime, finishTime }, handler)
    .then(() => {
      res.json(events);
    });
};

const commandHandlers = {
  'read-model-status-all': readModelStatusAllHandler,
  'read-model-status': readModelStatusHandler,
  'read-model-query': readModelQueryHandler,
  'list-properties': listPropertiesHandler,
  'read-model-show-resolvers': readModelShowResolversHandler,
  'aggregate-list': aggregateListHandler,
  'aggregate-show-commands': aggregateShowCommandsHandler,
  'events-load': eventsLoadHandler
};

const handler = (req, res, validateJwt) => {
  if (validateJwt) validateJwt(req.jwtToken);

  const payload = JSON.parse(req.body);
  if (!payload || !payload.command || !commandHandlers[payload.command]) {
    res.status(400);
  } else return commandHandlers[payload.command](req, res, payload);
};

module.exports = { handleTtr: handler };
