function createExtension(delegate = {}) {
  class Extension {
    constructor(options = {}) {
      this.options = options;
      this.delegate = delegate;
    }

    getRobotVisitors() {
      if (this.delegate.getRobotVisitors) {
        return this.delegate.getRobotVisitors();
      }

      return [];
    }

    getPipelineVisitors() {
      if (this.delegate.getPipelineVisitors) {
        return this.delegate.getPipelineVisitors();
      }

      return [];
    }

    getFactoryVisitors() {
      if (this.delegate.getFactoryVisitors) {
        return this.delegate.getFactoryVisitors();
      }

      return [];
    }
  }

  return Extension;
}

module.exports = createExtension;
