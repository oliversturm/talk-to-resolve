module.exports = (commander, actions) => {
  commander
    .command('ev')
    .description(
      'Show events. Defaults to maximum 100 events in the last 7 days.'
    )
    .option(
      '-a, --aggregateIds <aggregateIdsJson>',
      'Filter for  aggregate ids'
    )
    .option('-t, --eventTypes <eventTypesJson>', 'Filter for event types')
    .option(
      '-s, --startTime <startTime>',
      'Filter for events with timestamp > startTime. Use numeric timestamp or string understood by Date.parse().'
    )
    .option(
      '-e, --endTime <endTime>',
      'Filter for events with timestamp < endTime. Use numeric timestamp or string understood by Date.parse().'
    )
    .option('-l, --limit <limit>', 'Retrieve at most <limit> events')
    .option(
      '-h, --humanReadable',
      'Convert timestamps to readable values in tabular output'
    )
    .option(
      '-j, --json',
      'Output result JSON instead of the default tabular format'
    )
    .option('-f, --file <file>', 'Save result JSON to file')
    .action(actions.commanderAction(actions.eventsShow));
};
