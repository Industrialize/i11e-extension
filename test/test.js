exports['test extension'] = {
  'test robot visitor': function(test) {
    const extension = require('../lib/index');

    var count = 0;
    var MyRobotVisitor = extension.createRobotVisitor({
      willProcess(robot, err, box) {
        count++;
      }
    });

    const Robot = require('i11e-robot')([new MyRobotVisitor()]);

    var MyRobot = Robot.createRobot({
      process(box, done) {
        var v = box.get('v');
        if (v === null || v === undefined) {
          v = 0;
        }

        v++;
        console.log(v);
        done(null, box.set('v', v));
      }
    });

    const Pipeline = require('i11e-pipeline');

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
          test.done();
        }
      )
      .drive();

    pl.$().push({});
  }
}
