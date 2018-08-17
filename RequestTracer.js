const {responsePathAsArray} = require('graphql');
const BaseTracer = require('./BaseTracer');
const Timer = require('./Timer');

class RequestTracer extends BaseTracer {
  constructor ({count, startup}) {
    super();
    this.count = count;
    this.cold = (this.count === 1);
    this.startup = startup;
    this.timer = null;
    this.resolvers = [];
  }

  requestDidStart (args) {
    this.timer = Timer.start();
  }

  executionDidStart (args) {
    return ()=> {
      this.timer.stop();
    };
  }

  willResolveField (source, args, context, info) {
    if (!context.tracer) {
      context.tracer = this;
    }
    const field = info.fieldName;
    const pathArray = responsePathAsArray(info.path);
    const path = pathArray.join('.');

    const timer = Timer.start();
    const resolver = {path, field, timer};
    this.resolvers.push(resolver);

    return ()=> {
      timer.stop();
    };
  }

  format () {
    if (!this.timer || !this.timer.end) {
      return undefined;
    }

    const {count, cold} = this;
    const startup = this.startup.format();
    const resolvers = this.formatResolvers();
    const timers = this.formatTimers();
    const output = {count, cold, startup, resolvers, timers};

    return ['trace', output];
  }

  formatResolvers () {
    return this.resolvers.map((resolver)=> {
      const {path, field, timer} = resolver;
      const {start, end, duration} = timer.format();
      return {path, field, start, end, duration};
    });
  }
}

module.exports = RequestTracer;
