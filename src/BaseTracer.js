const Timer = require('./Timer');

class BaseTracer {
  constructor () {
    this.timers = {};
  }

  time (name) {
    const timer = Timer.start();
    this.timers[name] = timer;
    return timer;
  }

  formatTimers () {
    const output = {};
    for (const name of Object.keys(this.timers)) {
      const timer = this.timers[name];
      output[name] = timer.format();
    }
    return output;
  }
}

module.exports = BaseTracer;
