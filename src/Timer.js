class Timer {
  constructor (start) {
    this.start = start;
  }

  static start () {
    const start = new Date();
    return new Timer(start);
  }

  stop () {
    if (!this.end) {
      const {start} = this;
      const end = new Date();
      this.end = end;
      this.duration = end.getTime() - start.getTime();
    }
  }

  format () {
    const {duration} = this;
    const output = {duration};
    for (const attr of ['start', 'end']) {
      const val = this[attr];
      if (val) {
        output[attr] = val.toISOString();
      }
    }
    return output;
  }
}

module.exports = Timer;
