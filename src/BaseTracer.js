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
    for (const [name, timer] of Object.entries(this.timers)) {
      output[name] = timer.format();
    }
    return output;
  }
}

module.exports = BaseTracer;
