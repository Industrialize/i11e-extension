var defaultVisitor = {
  initVisitor() {
  },
  getType() {
    return 'robot';
  },
  willCreate(entity) {
  },
  didCreate(entity) {
  },
  willFilter(entity, box) {
  },
  didFilter(entity, box, passOrNot) {
  },
  willProcess(entity, box) {
  },
  didProcess(entity, err, box) {
  }
}

module.exports = (delegate) => {
  const ReserverdFunctions = ['setDelegate', 'getModel', 'getType', 'willCreate',
    'didCreate', 'willFilter', 'didFilter', 'willProcess', 'didProcess'];

  if (!delegate) {
    delegate = defaultVisitor;
  }

  class Visitor {
    constructor(options) {
      this.options = options;
      this.setDelegate(delegate);

      if (this.delegate.initVisitor) {
        this.delegate.initVisitor.call(this);
      }
    }

    setDelegate(delegate) {
      this.delegate = delegate;

      if (this.delegate.getModel) this.model = this.delegate.getModel();

      for (let key in this.delegate) {
        // skip predefined functions
        if (ReserverdFunctions.indexOf(key) >= 0) {
          continue;
        }

        if (typeof this.delegate[key] === 'function') {
          this[key] = this.delegate[key].bind(this);
        }
      }

      return this;
    }

    getModel() {
      return this.model || 'UnnamedVisitorModel'
    }

    willCreate(entity) {
      if (this.delegate.willCreate) {
        try {
          this.delegate.willCreate.call(this, entity);
        } catch (err) {
          console.error(`Error running [willCreate] of visitor [${this.model}]: ${err.message}`);
          console.error(err.stack);
        }
      }
    }

    didCreate(entity) {
      if (this.delegate.didCreate) {
        try {
          this.delegate.didCreate.call(this, entity);
        } catch (err) {
          console.error(`Error running [didCreate] of visitor [${this.model}]: ${err.message}`);
          console.error(err.stack);
        }
      }
    }

    willFilter(entity, box) {
      if (this.delegate.willFilter) {
        try {
          return this.delegate.willFilter.call(this, entity, box);
        } catch (err) {
          console.error(`Error running [willFilter] of visitor [${this.model}]: ${err.message}`);
          console.error(err.stack);
        }
      } else {
        return false; // do not skip
      }
    }

    didFilter(entity, box, isFiltered) {
      if (this.delegate.didFilter) {
        try {
          return this.delegate.didFilter.call(this, entity, box, isFiltered);
        } catch (err) {
          console.error(`Error running [didFilter] of visitor [${this.model}]: ${err.message}`);
          console.error(err.stack);
        }
      } else {
        return true; // default filter, pass the box
      }
    }

    /**
     * Called when a box enter entity
     * @param  {Object} entity instance of Robot, Pipeline, Port, or Transport
     * @param  {box} box    the current box
     */
    willProcess(entity, box) {
      if (this.delegate.willProcess) {
        try {
          return this.delegate.willProcess.call(this, entity, box);
        } catch (err) {
          console.error(`Error running [willProcess] of visitor [${this.model}]: ${err.message}`);
          console.error(err.stack);
        }
      } else {
        return false; // default, do not skip
      }
    }

    /**
     * Called when a box exits entity
     * @param  {Object} entity instance of Robot, Pipeline, Port, or Transport
     * @param  {Error} error  the error object if any
     * @param  {box} box    the current box
     */
    didProcess(entity, error, box) {
      if (this.delegate.didProcess) {
        try {
          return this.delegate.didProcess.call(this, entity, error, box);
        } catch (err) {
          console.error(`Error running [didProcess] of visitor [${this.model}]: ${err.message}`);
          console.error(err.stack);
        }
      } 
    }
  }

  return Visitor;
}
