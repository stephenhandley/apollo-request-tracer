const BaseTracer = require('./BaseTracer');
const RequestTracer = require('./RequestTracer');
const Timer = require('./Timer');

class Tracer extends BaseTracer {
  constructor (timer) {
    super();
    this.timer = timer;
    this.requestCount = 0;
    this.request = this.request.bind(this);
  }

  static start () {
    const timer = Timer.start();
    return new Tracer(timer);
  }

  stop () {
    this.timer.stop();
  }

  request () {
    this.requestCount = this.requestCount + 1;
    const count = this.requestCount;
    const startup = this;
    return new RequestTracer({count, startup});
  }

  format () {
    const output = this.timer.format();
    output.requestCount = this.requestCount;
    output.timers = this.formatTimers();
    return output;
  }
}

module.exports = Tracer;
