module.exports.handleError = function handleError(fn) {
  return function (...params) {
    return fn(...params).catch(function (err) {
      console.error("Oops! Something went wrong.", err);
    });
  };
};

module.exports.timeout = function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
