module.exports = (commander, actions) => {
  commander
    .command('cli', { isDefault: true })
    .description('Run interactive TTR environment')
    .action(actions.commanderAction(actions.runVorpal));
};
