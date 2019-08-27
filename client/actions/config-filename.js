const homedir = require('homedir');
const path = require('path');

const configFileName = () => path.join(homedir(), '.ttr.config.json');

module.exports = configFileName;
