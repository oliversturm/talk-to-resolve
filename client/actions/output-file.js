const fs = require('fs-extra');
const chalk = require('chalk');

const outputFile = () => ({ output, prompt }) => (filename, dataObject) => {
  const save = () =>
    fs.outputFile(filename, JSON.stringify(dataObject, null, 2)).then(() => {
      output(chalk.green(`Saved to ${filename}`));
    });
  const promptAndSave = () =>
    prompt({
      type: 'confirm',
      name: 'continue',
      default: false,
      message: `The file ${filename} exists. Overwrite?`
    }).then(result => {
      if (!result.continue) {
        output(chalk.red('Save operation cancelled'));
      } else {
        return save();
      }
    });
  return fs.exists(filename).then(e => (e ? promptAndSave() : save()));
};

module.exports = outputFile;
