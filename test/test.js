exports['test extension'] = {
  'test extension': (test) => {

    const extension = require('../lib/index');

    var MyRobotVisitor = extension.createRobotVisitor({
      initVisitor() {
        this.count = 0;
      },
      willProcess(robot, err, box) {
        this.count++;
      }
    });

    // var MyPipelineVisitor = extension.createPipelineVisitor({
    //   initVisitor() {
    //     this.count = 0;
    //   },
    //   willProcess(pipeline, err, box) {
    //     this.count++;
    //   }
    // })

    var myRbtVisitor = new MyRobotVisitor();
    // var myPlVisitor = new MyPipelineVisitor();

    var Ext = extension.createExtension({
      getRobotVisitors() {
        return [myRbtVisitor];
      }
    });

    const Robot = require('i11e-robot');
    Robot.extend(new Ext());
    // Robot.extend({
    //   getRobotVisitors() {
    //     return [myRbtVisitor]
    //   }
    // });

    var MyRobot = Robot.createRobot({
      process(box, done) {
        var v = box.get('v');
        if (v === null || v === undefined) {
          v = 0;
        }

        v++;
        done(null, box.set('v', v));
      }
    });

    const Pipeline = require('i11e-pipeline');

    // var pl = Pipeline.pipeline((source) => {
    //   return source._()
    //     .install(new MyRobot())
    //     .install(new MyRobot())
    //     .install(new MyRobot())
    //     .install(new MyRobot())
    //     .install(new MyRobot());
    // });
    var pl = Pipeline.pipeline()._()
      .install(new MyRobot())
      .install(new MyRobot())
      .install(new MyRobot())
      .install(new MyRobot())
      .install(new MyRobot())
      .doto(
        (box) => {
          test.equal(box.get('v'), 5);
          test.equal(myRbtVisitor.count, 5);
          test.done();
        }
      )
      .errors((err, rethrow) => {
        console.error(err.message);
        console.error(err.stack);
      })
      .drive();

    pl.$().push({});
  },

  'test visitor': function(test) {
    const extension = require('../lib/index');

    var MyRobotVisitor = extension.createRobotVisitor({
      initVisitor() {
        this.count = 0;
      },
      willProcess(robot, err, box) {
        this.count++;
      }
    });

    var MyPipelineVisitor = extension.createPipelineVisitor({
      initVisitor() {
        this.count = 0;
      },
      willProcess(pipeline, err, box) {
        this.count++;
      }
    })

    var myRbtVisitor = new MyRobotVisitor();
    var myPlVisitor = new MyPipelineVisitor();

    const Robot = require('i11e-robot');
    Robot.extend({
      getRobotVisitors() {
        return [myRbtVisitor]
      }
    });

    var MyRobot = Robot.createRobot({
      process(box, done) {
        var v = box.get('v');
        if (v === null || v === undefined) {
          v = 0;
        }

        v++;
        done(null, box.set('v', v));
      }
    });

    const Pipeline = require('i11e-pipeline');
    Pipeline.extend({
      getPipelineVisitors() {
        return [myPlVisitor];
      }
    })

    var pl = Pipeline.pipeline((source) => {
      return source._()
        .install(new MyRobot())
        .install(new MyRobot())
        .install(new MyRobot())
        .install(new MyRobot())
        .install(new MyRobot());
    });

    pl._()
      .doto(
        (box) => {
          test.equal(box.get('v'), 5);
          test.equal(myRbtVisitor.count, 5);
          test.equal(myPlVisitor.count, 1);
          test.done();
        }
      )
      .drive();

    pl.$().push({});
  }
}
