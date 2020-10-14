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

// these state values are not used for anything - just placeholders,
// because the caller assumes a json return
const readModelPauseHandler = (req, res, { id }) =>
  req.resolve.eventBus.pause({ eventSubscriber: id }).then(() => {
    res.json({ state: 'paused' });
  });

const readModelResumeHandler = (req, res, { id }) =>
  req.resolve.eventBus.resume({ eventSubscriber: id }).then(() => {
    res.json({ state: 'resumed' });
  });

const readModelResetHandler = (req, res, { id }) =>
  req.resolve.eventBus
    .reset({ eventSubscriber: id })
    .then(() => req.resolve.eventBus.resume({ eventSubscriber: id }))
    .then(() => {
      res.json({ state: 'reset' });
    });

const listPropertiesHandler = (req, res, { id }) =>
  req.resolve.eventBus
    .listProperties({ eventSubscriber: id })
    .then((status) => {
      res.json(status);
    });

const readModelGetPropertyHandler = (
  req,
  res,
  { readModelName, propertyName }
) =>
  req.resolve.eventBus
    .getProperty({ eventSubscriber: readModelName, key: propertyName })
    .then((value) => {
      res.json({ name: propertyName, value });
    });

const readModelSetPropertyHandler = (
  req,
  res,
  { readModelName, propertyName, value }
) =>
  req.resolve.eventBus
    .setProperty({
      eventSubscriber: readModelName,
      key: String(propertyName),
      value: String(value),
    })
    .then(() => {
      res.json({ state: 'prop-set' });
    });

const readModelDeletePropertyHandler = (
  req,
  res,
  { readModelName, propertyName }
) =>
  req.resolve.eventBus
    .deleteProperty({ eventSubscriber: readModelName, key: propertyName })
    .then(() => {
      res.json({ state: 'prop-deleted' });
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

const viewModelQueryHandler = (req, res, { viewModelName, aggregateIds }) =>
  req.resolve
    .executeQuery({
      modelName: viewModelName,
      aggregateIds,
      jwt: req.jwt,
    })
    .then((result) => {
      res.json(result);
    });

const commandHandlers = {
  'read-model-status-all': readModelStatusAllHandler,
  'read-model-status': readModelStatusHandler,
  'read-model-query': readModelQueryHandler,
  'read-model-pause': readModelPauseHandler,
  'read-model-resume': readModelResumeHandler,
  'read-model-reset': readModelResetHandler,
  'list-properties': listPropertiesHandler,
  'read-model-show-resolvers': readModelShowResolversHandler,
  'aggregate-list': aggregateListHandler,
  'aggregate-list-commands': aggregateListCommandsHandler,
  'events-load': eventsLoadHandler,
  'read-model-get-property': readModelGetPropertyHandler,
  'read-model-set-property': readModelSetPropertyHandler,
  'read-model-delete-property': readModelDeletePropertyHandler,
  'view-model-query': viewModelQueryHandler,
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
