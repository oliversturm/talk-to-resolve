const fs = require('fs-extra');
const chalk = require('chalk');

const configOutputFile = () => ({ output, prompt }) => (
  filename,
  sectionName,
  oldConfig,
  newBlock
) => {
  const save = () => {
    oldConfig[sectionName] = newBlock;
    return fs
      .outputFile(filename, JSON.stringify(oldConfig, null, 2))
      .then(() => {
        output(chalk.green(`Saved config ${sectionName} to ${filename}`));
      });
  };
  const promptAndSave = () =>
    prompt({
      type: 'confirm',
      name: 'continue',
      default: false,
      message: `The config section ${sectionName} exists. Overwrite?`
    }).then(result => {
      if (!result.continue) {
        output(chalk.red('Save operation cancelled'));
      } else {
        return save();
      }
    });
  return oldConfig[sectionName] ? promptAndSave() : save();
};

module.exports = configOutputFile;
