const config = ({ state }) => ({ output }) => () => {
  output(state.getVisualState());
  return Promise.resolve();
};

module.exports = config;
