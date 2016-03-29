var Dml = require("../dist/js/node/lib/Dml.js").Dml;

describe('test1 - Dml.js', function() {

  it("001 - Dml.js", function(done) {
    var q = null;


    try {
      q = new Dml();
      q._check_arguments = false;
      q.select();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().select();

      expect(1).toEqual("NG - select().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().insert_into();

      expect(1).toEqual("NG - select().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().delete_from();

      expect(1).toEqual("NG - select().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().update();

      expect(1).toEqual("NG - select().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().join();

      expect(1).toEqual("NG - select().join");
    } catch(e) {
      expect(1).toEqual(1);
    }



    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().select();

      expect(1).toEqual("NG - select().from().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().insert_into();

      expect(1).toEqual("NG - select().from().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().delete_from();

      expect(1).toEqual("NG - select().from().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().update();

      expect(1).toEqual("NG - select().from().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().select();

      expect(1).toEqual("NG - select().from().join().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().insert_into();

      expect(1).toEqual("NG - select().from().join().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().delete_from();

      expect(1).toEqual("NG - select().from().join().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().update();

      expect(1).toEqual("NG - select().from().join().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().where");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().select();

      expect(1).toEqual("NG- select().from().join().where().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().insert_into();

      expect(1).toEqual("NG - select().from().join().where().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().delete_from();

      expect(1).toEqual("NG - select().from().join().where().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().update();

      expect(1).toEqual("NG - select().from().join().where().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().join();

      expect(1).toEqual("NG - select().from().join().where().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().where();

      expect(1).toEqual("NG - select().from().join().where().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().where().group_by");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().select();

      expect(1).toEqual("NG - select().from().join().where().group_by().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().insert_into();

      expect(1).toEqual("NG - select().from().join().where().group_by().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().delete_from();

      expect(1).toEqual("NG - select().from().join().where().group_by().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().update();

      expect(1).toEqual("NG - select().from().join().where().group_by().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().join();

      expect(1).toEqual("NG - select().from().join().where().group_by().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().where();

      expect(1).toEqual("NG - select().from().join().where().group_by().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().group_by();

      expect(1).toEqual("NG - select().from().join().where().group_by().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().where().group_by().having");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having().select();

      expect(1).toEqual("NG - select().from().join().where().group_by().having().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having().insert_into();

      expect(1).toEqual("NG - select().from().join().where().group_by().having().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having().delete_from();

      expect(1).toEqual("NG - select().from().join().where().group_by().having().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having().update();

      expect(1).toEqual("NG - select().from().join().where().group_by().having().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having().join();

      expect(1).toEqual("NG - select().from().join().where().group_by().having().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having().where();

      expect(1).toEqual("NG - select().from().join().where().group_by().having().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having().group_by();

      expect(1).toEqual("NG - select().from().join().where().group_by().having().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having().having();

      expect(1).toEqual("NG - select().from().join().where().group_by().having().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having().order_by();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().where().group_by().having().order_by");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having().order_by().select();

      expect(1).toEqual("NG - select().from().join().where().group_by().having().order_by().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having().order_by().insert_into();

      expect(1).toEqual("NG - select().from().join().where().group_by().having().order_by().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having().order_by().delete_from();

      expect(1).toEqual("NG - select().from().join().where().group_by().having().order_by().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having().order_by().update();

      expect(1).toEqual("NG - select().from().join().where().group_by().having().order_by().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having().order_by().join();

      expect(1).toEqual("NG - select().from().join().where().group_by().having().order_by().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having().order_by().where();

      expect(1).toEqual("NG - select().from().join().where().group_by().having().order_by().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having().order_by().group_by();

      expect(1).toEqual("NG - select().from().join().where().group_by().having().order_by().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having().order_by().having();

      expect(1).toEqual("NG - select().from().join().where().group_by().having().order_by().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having().order_by().order_by();

      expect(1).toEqual("NG - select().from().join().where().group_by().having().order_by().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having().order_by().values();

      expect(1).toEqual("NG - select().from().join().where().group_by().having().order_by().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having().order_by().run();

      expect(1).toEqual("NG - select().from().join().where().group_by().having().order_by().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().join().where().group_by().having().order_by().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having().values();

      expect(1).toEqual("NG - select().from().join().where().group_by().having().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().having().run();

      expect(1).toEqual("NG - select().from().join().where().group_by().having().values().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().join().where().group_by().having().values().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().order_by();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().where().group_by().order_by");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().order_by().select();

      expect(1).toEqual("NG - select().from().join().where().group_by().order_by().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().order_by().insert_into();

      expect(1).toEqual("NG - select().from().join().where().group_by().order_by().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().order_by().delete_from();

      expect(1).toEqual("NG - select().from().join().where().group_by().order_by().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().order_by().update();

      expect(1).toEqual("NG - select().from().join().where().group_by().order_by().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().order_by().join();

      expect(1).toEqual("NG - select().from().join().where().group_by().order_by().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().order_by().where();

      expect(1).toEqual("NG - select().from().join().where().group_by().order_by().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().order_by().group_by();

      expect(1).toEqual("NG - select().from().join().where().group_by().order_by().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().order_by().having();

      expect(1).toEqual("NG - select().from().join().where().group_by().order_by().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().order_by().order_by();

      expect(1).toEqual("NG - select().from().join().where().group_by().order_by().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().order_by().values();

      expect(1).toEqual("NG - select().from().join().where().group_by().order_by().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().order_by().run();

      expect(1).toEqual("NG - select().from().join().where().group_by().order_by().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().join().where().group_by().order_by().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().values();

      expect(1).toEqual("NG - select().from().join().where().group_by().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().group_by().run();

      expect(1).toEqual("NG - select().from().join().where().group_by().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().join().where().group_by().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().having();

      expect(1).toEqual("NG - select().from().join().where().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().order_by();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().where().order_by");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().order_by().select();

      expect(1).toEqual("NG - select().from().join().where().order_by().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().order_by().insert_into();

      expect(1).toEqual("NG - select().from().join().where().order_by().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().order_by().delete_from();

      expect(1).toEqual("NG - select().from().join().where().order_by().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().order_by().update();

      expect(1).toEqual("NG - select().from().join().where().order_by().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().order_by().join();

      expect(1).toEqual("NG - select().from().join().where().order_by().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().order_by().where();

      expect(1).toEqual("NG - select().from().join().where().order_by().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().order_by().group_by();

      expect(1).toEqual("NG - select().from().join().where().order_by().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().order_by().having();

      expect(1).toEqual("NG - select().from().join().where().order_by().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().order_by().order_by();

      expect(1).toEqual("NG - select().from().join().where().order_by().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().order_by().values();

      expect(1).toEqual("NG - select().from().join().where().order_by().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().order_by().run();

      expect(1).toEqual("NG - select().from().join().where().order_by().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().join().where().order_by().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().values();

      expect(1).toEqual("NG - select().from().join().where().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().run();

      expect(1).toEqual("NG - select().from().join().where().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().join().where().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().group_by");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().select();

      expect(1).toEqual("NG - select().from().join().group_by().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().insert_into();

      expect(1).toEqual("NG - select().from().join().group_by().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().delete_from();

      expect(1).toEqual("NG - select().from().join().group_by().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().update();

      expect(1).toEqual("NG - select().from().join().group_by().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().join();

      expect(1).toEqual("NG - select().from().join().group_by().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().where();

      expect(1).toEqual("NG - select().from().join().group_by().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().group_by();

      expect(1).toEqual("NG - select().from().join().group_by().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().group_by().having");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().select();

      expect(1).toEqual("NG - select().from().join().group_by().having().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().insert_into();

      expect(1).toEqual("NG - select().from().join().group_by().having().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().delete_from();

      expect(1).toEqual("NG - select().from().join().group_by().having().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().update();

      expect(1).toEqual("NG - select().from().join().group_by().having().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().join();

      expect(1).toEqual("NG - select().from().join().group_by().having().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().where();

      expect(1).toEqual("NG - select().from().join().group_by().having().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().group_by();

      expect(1).toEqual("NG - select().from().join().group_by().having().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().having();

      expect(1).toEqual("NG - select().from().join().group_by().having().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().order_by();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().group_by().having().order_by");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().order_by().select();

      expect(1).toEqual("NG - select().from().join().group_by().having().order_by().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().order_by().insert_into();

      expect(1).toEqual("NG - select().from().join().group_by().having().order_by().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().order_by().delete_from();

      expect(1).toEqual("NG - select().from().join().group_by().having().order_by().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().order_by().update();

      expect(1).toEqual("NG - select().from().join().group_by().having().order_by().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().order_by().join();

      expect(1).toEqual("NG - select().from().join().group_by().having().order_by().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().order_by().where();

      expect(1).toEqual("NG - select().from().join().group_by().having().order_by().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().order_by().group_by();

      expect(1).toEqual("NG - select().from().join().group_by().having().order_by().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().order_by().having();

      expect(1).toEqual("NG - select().from().join().group_by().having().order_by().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().order_by().order_by();

      expect(1).toEqual("NG - select().from().join().group_by().having().order_by().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().order_by().values();

      expect(1).toEqual("NG - select().from().join().group_by().having().order_by().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().order_by().run();

      expect(1).toEqual("NG - select().from().join().group_by().having().order_by().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().join().group_by().having().order_by().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().values();

      expect(1).toEqual("NG - select().from().join().group_by().having().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().run();

      expect(1).toEqual("NG - select().from().join().group_by().having().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().join().group_by().having().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().order_by();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().group_by().order_by");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().order_by().select();

      expect(1).toEqual("NG - select().from().join().group_by().order_by().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().order_by().insert_into();

      expect(1).toEqual("NG - select().from().join().group_by().order_by().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().order_by().delete_from();

      expect(1).toEqual("NG - select().from().join().group_by().order_by().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().order_by().update();

      expect(1).toEqual("NG - select().from().join().group_by().order_by().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().order_by().join();

      expect(1).toEqual("NG - select().from().join().group_by().order_by().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().order_by().where();

      expect(1).toEqual("NG - select().from().join().group_by().order_by().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().order_by().group_by();

      expect(1).toEqual("NG - select().from().join().group_by().order_by().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().order_by().having();

      expect(1).toEqual("NG - select().from().join().group_by().order_by().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().order_by().order_by();

      expect(1).toEqual("NG - select().from().join().group_by().order_by().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().order_by().values();

      expect(1).toEqual("NG - select().from().join().group_by().order_by().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().order_by().run();

      expect(1).toEqual("NG - select().from().join().group_by().order_by().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().join().group_by().order_by().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().values();

      expect(1).toEqual("NG - select().from().join().group_by().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().run();

      expect(1).toEqual("NG - select().from().join().group_by().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().join().group_by().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().having();

      expect(1).toEqual("NG - select().from().join().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().order_by");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().select();

      expect(1).toEqual("NG - select().from().join().order_by().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().insert_into();

      expect(1).toEqual("NG - select().from().join().order_by().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().delete_from();

      expect(1).toEqual("NG - select().from().join().order_by().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().update();

      expect(1).toEqual("NG - select().from().join().order_by().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().join();

      expect(1).toEqual("NG - select().from().join().order_by().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().where();

      expect(1).toEqual("NG - select().from().join().order_by().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().group_by();

      expect(1).toEqual("NG - select().from().join().order_by().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().having();

      expect(1).toEqual("NG - select().from().join().order_by().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().order_by();

      expect(1).toEqual("NG - select().from().join().order_by().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().values();

      expect(1).toEqual("NG - select().from().join().order_by().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().run();

      expect(1).toEqual("NG - select().from().join().order_by().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().join().order_by().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().values();

      expect(1).toEqual("NG - select().from().join().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().run();

      expect(1).toEqual("NG - select().from().join().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().join().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().where");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().select();

      expect(1).toEqual("NG - select().from().where().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().insert_into();

      expect(1).toEqual("NG - select().from().where().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().delete_from();

      expect(1).toEqual("NG - select().from().where().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().update();

      expect(1).toEqual("NG - select().from().where().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().join();

      expect(1).toEqual("NG - select().from().where().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().where();

      expect(1).toEqual("NG - select().from().where().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().where().group_by");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().select();

      expect(1).toEqual("NG - select().from().where().group_by().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().insert_into();

      expect(1).toEqual("NG - select().from().where().group_by().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().delete_from();

      expect(1).toEqual("NG - select().from().where().group_by().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().update();

      expect(1).toEqual("NG - select().from().where().group_by().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().join();

      expect(1).toEqual("NG - select().from().where().group_by().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().where();

      expect(1).toEqual("NG - select().from().where().group_by().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().group_by();

      expect(1).toEqual("NG - select().from().where().group_by().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().having();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().where().group_by().having");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().having().select();

      expect(1).toEqual("NG - select().from().where().group_by().having().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().having().insert_into();

      expect(1).toEqual("NG - select().from().where().group_by().having().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().having().delete_from();

      expect(1).toEqual("NG - select().from().where().group_by().having().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().having().update();

      expect(1).toEqual("NG - select().from().where().group_by().having().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().having().join();

      expect(1).toEqual("NG - select().from().where().group_by().having().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().having().where();

      expect(1).toEqual("NG - select().from().where().group_by().having().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().having().group_by();

      expect(1).toEqual("NG - select().from().where().group_by().having().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().having().having();

      expect(1).toEqual("NG - select().from().where().group_by().having().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().having().order_by();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().where().group_by().having().order_by");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().having().values();

      expect(1).toEqual("NG - select().from().where().group_by().having().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().having().run();

      expect(1).toEqual("NG - select().from().where().group_by().having().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().where().group_by().having().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().order_by();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().where().group_by().order_by");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().order_by().select();

      expect(1).toEqual("NG - select().from().where().group_by().order_by().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().order_by().insert_into();

      expect(1).toEqual("NG - select().from().where().group_by().order_by().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().order_by().delete_from();

      expect(1).toEqual("NG - select().from().where().group_by().order_by().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().order_by().update();

      expect(1).toEqual("NG - select().from().where().group_by().order_by().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().order_by().join();

      expect(1).toEqual("NG - select().from().where().group_by().order_by().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().order_by().where();

      expect(1).toEqual("NG - select().from().where().group_by().order_by().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().order_by().group_by();

      expect(1).toEqual("NG - select().from().where().group_by().order_by().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().order_by().having();

      expect(1).toEqual("NG - select().from().where().group_by().order_by().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().order_by().order_by();

      expect(1).toEqual("NG - select().from().where().group_by().order_by().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().order_by().values();

      expect(1).toEqual("NG - select().from().where().group_by().order_by().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().order_by().run();

      expect(1).toEqual("NG - select().from().where().group_by().order_by().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().where().group_by().order_by().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().values();

      expect(1).toEqual("NG - select().from().where().group_by().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().group_by().run();

      expect(1).toEqual("NG - select().from().where().group_by().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().where().group_by().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().having();

      expect(1).toEqual("NG - select().from().where().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().order_by();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().where().order_by");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().order_by().select();

      expect(1).toEqual("NG - select().from().where().order_by().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().order_by().insert_into();

      expect(1).toEqual("NG - select().from().where().order_by().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().order_by().delete_from();

      expect(1).toEqual("NG - select().from().where().order_by().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().order_by().update();

      expect(1).toEqual("NG - select().from().where().order_by().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().order_by().join();

      expect(1).toEqual("NG - select().from().where().order_by().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().order_by().where();

      expect(1).toEqual("NG - select().from().where().order_by().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().order_by().group_by();

      expect(1).toEqual("NG - select().from().where().order_by().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().order_by().


      expect(1).toEqual("NG - select().from().where().order_by().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().order_by().order_by();

      expect(1).toEqual("NG - select().from().where().order_by().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().order_by().values();

      expect(1).toEqual("NG - select().from().where().order_by().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().order_by().run();

      expect(1).toEqual("NG - select().from().where().order_by().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().where().order_by().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().values();

      expect(1).toEqual("NG - select().from().where().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().run();

      expect(1).toEqual("NG - select().from().where().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().where().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().group_by");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().select();

      expect(1).toEqual("NG - select().from().group_by().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().insert_into();

      expect(1).toEqual("NG - select().from().group_by().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().delete_from();

      expect(1).toEqual("NG - select().from().group_by().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().update();

      expect(1).toEqual("NG - select().from().group_by().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().join();

      expect(1).toEqual("NG - select().from().group_by().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().where();

      expect(1).toEqual("NG - select().from().group_by().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().group_by();

      expect(1).toEqual("NG - select().from().group_by().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().group_by().having");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().select();

      expect(1).toEqual("NG - select().from().group_by().having().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().insert_into();

      expect(1).toEqual("NG - select().from().group_by().having().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().delete_from();

      expect(1).toEqual("NG - select().from().group_by().having().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().update();

      expect(1).toEqual("NG - select().from().group_by().having().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().join();

      expect(1).toEqual("NG - select().from().group_by().having().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().where();

      expect(1).toEqual("NG - select().from().group_by().having().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().group_by();

      expect(1).toEqual("NG - select().from().group_by().having().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().having();

      expect(1).toEqual("NG - select().from().group_by().having().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().order_by();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().group_by().having().order_by");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().order_by().select();

      expect(1).toEqual("NG - select().from().group_by().having().order_by().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().order_by().insert_into();

      expect(1).toEqual("NG - select().from().group_by().having().order_by().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().order_by().delete_from();

      expect(1).toEqual("NG - select().from().group_by().having().order_by().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().order_by().update();

      expect(1).toEqual("NG - select().from().group_by().having().order_by().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().order_by().join();

      expect(1).toEqual("NG - select().from().group_by().having().order_by().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().order_by().where();

      expect(1).toEqual("NG - select().from().group_by().having().order_by().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().order_by().group_by();

      expect(1).toEqual("NG - select().from().group_by().having().order_by().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().order_by().having();

      expect(1).toEqual("NG - select().from().group_by().having().order_by().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().order_by().order_by();

      expect(1).toEqual("NG - select().from().group_by().having().order_by().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().order_by().values();

      expect(1).toEqual("NG - select().from().group_by().having().order_by().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().order_by().run();

      expect(1).toEqual("NG - select().from().group_by().having().order_by().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().group_by().having().order_by().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().values();

      expect(1).toEqual("NG - select().from().group_by().having().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().run();

      expect(1).toEqual("NG - select().from().group_by().having().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().group_by().having().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().order_by();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().group_by().order_by");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().order_by().select();

      expect(1).toEqual("NG - select().from().group_by().order_by().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().order_by().insert_into();

      expect(1).toEqual("NG - select().from().group_by().order_by().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().order_by().delete_from();

      expect(1).toEqual("NG - select().from().group_by().order_by().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().order_by().update();

      expect(1).toEqual("NG - select().from().group_by().order_by().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().order_by().join();

      expect(1).toEqual("NG - select().from().group_by().order_by().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().order_by().where();

      expect(1).toEqual("NG - select().from().group_by().order_by().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().order_by().group_by();

      expect(1).toEqual("NG - select().from().group_by().order_by().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().order_by().having();

      expect(1).toEqual("NG - select().from().group_by().order_by().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().order_by().order_by();

      expect(1).toEqual("NG - select().from().group_by().order_by().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().order_by().values();

      expect(1).toEqual("NG - select().from().group_by().order_by().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().order_by().run();

      expect(1).toEqual("NG - select().from().group_by().order_by().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().group_by().order_by().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().values();

      expect(1).toEqual("NG - select().from().group_by().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().run();

      expect(1).toEqual("NG - select().from().group_by().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().group_by().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().having();

      expect(1).toEqual("NG - select().from().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().order_by");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().select();

      expect(1).toEqual("NG - select().from().order_by().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().insert_into();

      expect(1).toEqual("NG - select().from().order_by().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().delete_from();

      expect(1).toEqual("NG - select().from().order_by().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().update();

      expect(1).toEqual("NG - select().from().order_by().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().join();

      expect(1).toEqual("NG - select().from().order_by().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().where();

      expect(1).toEqual("NG - select().from().order_by().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().group_by();

      expect(1).toEqual("NG - select().from().order_by().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().having();

      expect(1).toEqual("NG - select().from().order_by().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().order_by();

      expect(1).toEqual("NG - select().from().order_by().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().values();

      expect(1).toEqual("NG - select().from().order_by().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().run();

      expect(1).toEqual("NG - select().from().order_by().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().order_by().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().values();

      expect(1).toEqual("NG - select().from().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().run();

      expect(1).toEqual("NG - select().from().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - insert_into");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().select();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - insert_into().select");
    }

    // TODO

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().insert_into();

      expect(1).toEqual("NG - insert_into().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().delete_from();

      expect(1).toEqual("NG - insert_into().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().update();

      expect(1).toEqual("NG - insert_into().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().join();

      expect(1).toEqual("NG - insert_into().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().where();

      expect(1).toEqual("NG - insert_into().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().group_by();

      expect(1).toEqual("NG - insert_into().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().having();

      expect(1).toEqual("NG - insert_into().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().order_by();

      expect(1).toEqual("NG - insert_into().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().values();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - insert_into().values");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().values().select();

      expect(1).toEqual("NG - insert_into().values().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().values().insert_into();

      expect(1).toEqual("NG - insert_into().values().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().values().delete_from();

      expect(1).toEqual("NG - insert_into().values().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().values().update();

      expect(1).toEqual("NG - insert_into().values().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().values().join();

      expect(1).toEqual("NG - insert_into().values().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().values().where();

      expect(1).toEqual("NG - insert_into().values().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().values().group_by();

      expect(1).toEqual("NG - insert_into().values().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().values().having();

      expect(1).toEqual("NG - insert_into().values().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().values().order_by();

      expect(1).toEqual("NG - insert_into().values().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().values().values();

      expect(1).toEqual("NG - insert_into().values().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().values().run();

      expect(1).toEqual("NG - insert_into().values().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - insert_into().values().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().run();

      expect(1).toEqual("NG - insert_into().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - insert_into().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - delete_from");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().select();

      expect(1).toEqual("NG - delete_from().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().insert_into();

      expect(1).toEqual("NG - delete_from().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().delete_from();

      expect(1).toEqual("NG - delete_from().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().update();

      expect(1).toEqual("NG - delete_from().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().join();

      expect(1).toEqual("NG - delete_from().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().where();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - delete_from().where");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().where().select();

      expect(1).toEqual("NG - delete_from().where().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().where().insert_into();

      expect(1).toEqual("NG - delete_from().where().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().where().delete_from();

      expect(1).toEqual("NG - delete_from().where().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().where().update();

      expect(1).toEqual("NG - delete_from().where().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().where().join();

      expect(1).toEqual("NG - delete_from().where().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().where().where();

      expect(1).toEqual("NG - delete_from().where().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().where().group_by();

      expect(1).toEqual("NG - delete_from().where().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().where().having();

      expect(1).toEqual("NG - delete_from().where().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().where().order_by();

      expect(1).toEqual("NG - delete_from().where().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().where().values();

      expect(1).toEqual("NG - delete_from().where().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().where().run();

      expect(1).toEqual("NG - delete_from().where().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - delete_from().where().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().group_by();

      expect(1).toEqual("NG - delete_from().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().having();

      expect(1).toEqual("NG - delete_from().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().order_by();

      expect(1).toEqual("NG - delete_from().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().values();

      expect(1).toEqual("NG - delete_from().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().run();

      expect(1).toEqual("NG - delete_from().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - delete_from().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - update");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().select();

      expect(1).toEqual("NG - update().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().insert_into();

      expect(1).toEqual("NG - update().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().delete_from();

      expect(1).toEqual("NG - update().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().update();

      expect(1).toEqual("NG - update().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().join();

      expect(1).toEqual("NG - update().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().where();

      expect(1).toEqual("NG - update().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().set();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - udpate().set");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().set().where().select();

      expect(1).toEqual("NG - update().set().where().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().set().where().insert_into();

      expect(1).toEqual("NG - update().set().where().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().set().where().delete_from();

      expect(1).toEqual("NG - update().set().where().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().set().where().update();

      expect(1).toEqual("NG - update().set().where().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().set().where().join();

      expect(1).toEqual("NG - update().set().where().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().set().where().where();

      expect(1).toEqual("NG - update().set().where().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().set().where().group_by();

      expect(1).toEqual("NG - update().set().where().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().set().where().having();

      expect(1).toEqual("NG - update().set().where().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().set().where().order_by();

      expect(1).toEqual("NG - update().set().where().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().set().where().values();

      expect(1).toEqual("NG - update().set().where().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().set().where().run();

      expect(1).toEqual("NG - update().set().where().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - update().set().where().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().set().run();

      expect(1).toEqual("NG - update().set().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - update().set().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().group_by();

      expect(1).toEqual("NG - update().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().having();

      expect(1).toEqual("NG - update().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().order_by();

      expect(1).toEqual("NG - update().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().values();

      expect(1).toEqual("NG - update().values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().run();

      expect(1).toEqual("NG - update().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(0);
      } else {
        expect(1).toEqual(1);
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.join();

      expect(1).toEqual("NG - join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.where();

      expect(1).toEqual("NG - where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.group_by();

      expect(1).toEqual("NG - group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.having();

      expect(1).toEqual("NG - having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.order_by();

      expect(1).toEqual("NG - order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.values();

      expect(1).toEqual("NG - values");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.run();

      expect(1).toEqual("NG - run");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.as();

      expect(1).toEqual("NG - as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().as();

      expect(1).toEqual("NG - select().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().as");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().join();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().as().join");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().where();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().as().where");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().group_by();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().as().group_by");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().order_by();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().as().order_by");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().as();

      expect(1).toEqual("NG - select().from().where().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().as();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().as");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().as().join();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().as().join");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().as().where();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().as().where");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().as().group_by();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().as().group_by");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().as().order_by();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().as().order_by");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().as();

      expect(1).toEqual("NG - select().from().group_by().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().as();

      expect(1).toEqual("NG - select().from().group_by().having().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().order_by().as();

      expect(1).toEqual("NG - select().from().group_by().order_by().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().as();

      expect(1).toEqual("NG - select().from().order_by().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().as();

      expect(1).toEqual("NG - insert_into().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().values().as();

      expect(1).toEqual("NG - insert_into().values().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().as();

      expect(1).toEqual("NG - delete_from().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().where().as();

      expect(1).toEqual("NG - delete_from().where().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().as();

      expect(1).toEqual("NG - update().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().set().as();

      expect(1).toEqual("NG - update().set().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.union();

      expect(1).toEqual("NG - union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().union();

      expect(1).toEqual("NG - select().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().union();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().union");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().union().union();

      expect(1).toEqual("NG - select().from().union().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().union().union_all();

      expect(1).toEqual("NG - select().from().union().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().union().run();

      expect(1).toEqual("NG - select().from().union().run");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().union();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().as().union");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().union().union();

      expect(1).toEqual("NG - select().from().as().union().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().union().union_all();

      expect(1).toEqual("NG - select().from().as().union().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().union().run();

      expect(1).toEqual("NG - select().from().as().union().run");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().union();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().union");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().union().union();

      expect(1).toEqual("NG - select().from().join().union().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().union().union_all();

      expect(1).toEqual("NG - select().from().join().union().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().union().run();

      expect(1).toEqual("NG - select().from().join().union().run");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().union();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().where().union");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().union().union();

      expect(1).toEqual("NG - select().from().join().where().union().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().union().union_all();

      expect(1).toEqual("NG - select().from().join().where().union().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().union().run();

      expect(1).toEqual("NG - select().from().join().where().union().run");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().union();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().group_by().union");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().union().union();

      expect(1).toEqual("NG - select().from().join().group_by().union().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().union().union_all();

      expect(1).toEqual("NG - select().from().join().group_by().union().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().union().run();

      expect(1).toEqual("NG - select().from().join().group_by().union().run");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().union();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().group_by().having().union");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().union().union();

      expect(1).toEqual("NG - select().from().join().group_by().having().union().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().union().union_all();

      expect(1).toEqual("NG - select().from().join().group_by().having().union().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().union().run();

      expect(1).toEqual("NG - select().from().join().group_by().having().union().run");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().union();

      expect(1).toEqual("NG - select().from().join().order_by().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().union();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().where().union");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().union().union();

      expect(1).toEqual("NG - select().from().where().union().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().union().union_all();

      expect(1).toEqual("NG - select().from().where().union().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().union().run();

      expect(1).toEqual("NG - select().from().where().union().run");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().union();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().group_by().union");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().union().union();

      expect(1).toEqual("NG - select().from().group_by().union().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().union().union_all();

      expect(1).toEqual("NG - select().from().group_by().union().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().union().run();

      expect(1).toEqual("NG - select().from().group_by().union().run");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().union();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().group_by().having().union");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().union().union();

      expect(1).toEqual("NG - select().from().group_by().having().union().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().union().union_all();

      expect(1).toEqual("NG - select().from().group_by().having().union().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().union().run();

      expect(1).toEqual("NG - select().from().group_by().having().union().run");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().union();

      expect(1).toEqual("NG - select().from().order_by().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().union();

      expect(1).toEqual("NG - insert_into().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().values().union();

      expect(1).toEqual("NG - insert_into().values().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().select().from().union();

      expect(1).toEqual("NG - insert_into().select().from().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().union();

      expect(1).toEqual("NG - delete_from().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().where().union();

      expect(1).toEqual("NG - delete_from().where().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().union();

      expect(1).toEqual("NG - update().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().set().union();

      expect(1).toEqual("NG - update().set().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().set().where().union();

      expect(1).toEqual("NG - update().set().where().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().union().select();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().union().select");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().union().insert_into();

      expect(1).toEqual("NG - select().from().union().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().union().delete_from();

      expect(1).toEqual("NG - select().from().union().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().union().update();

      expect(1).toEqual("NG - select().from().union().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.union_all();

      expect(1).toEqual("NG - union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().union_all();

      expect(1).toEqual("NG - select().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().union_all();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().union_all");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().union_all().union();

      expect(1).toEqual("NG - select().from().union_all().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().union_all().union_all();

      expect(1).toEqual("NG - select().from().union_all().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().union_all().run();

      expect(1).toEqual("NG - select().from().union_all().run");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().union_all();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().as().union_all");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().union_all().union();

      expect(1).toEqual("NG - select().from().as().union_all().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().union_all().union_all();

      expect(1).toEqual("NG - select().from().as().union_all().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().union_all().run();

      expect(1).toEqual("NG - select().from().as().union_all().run");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().union_all();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().union_all");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().union_all().union();

      expect(1).toEqual("NG - select().from().join().union_all().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().union_all().union_all();

      expect(1).toEqual("NG - select().from().join().union_all().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().union_all().run();

      expect(1).toEqual("NG - select().from().join().union_all().run");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().union_all();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().where().union_all");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().union_all().union();

      expect(1).toEqual("NG - select().from().join().where().union_all().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().union_all().union_all();

      expect(1).toEqual("NG - select().from().join().where().union_all().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().union_all().run();

      expect(1).toEqual("NG - select().from().join().where().union_all().run");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().union_all();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().group_by().union_all");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().union_all().union();

      expect(1).toEqual("NG - select().from().join().group_by().union_all().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().union_all().union_all();

      expect(1).toEqual("NG - select().from().join().group_by().union_all().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().union_all().run();

      expect(1).toEqual("NG - select().from().join().group_by().union_all().run");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().union_all();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().group_by().having().union_all");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().union_all().union();

      expect(1).toEqual("NG - select().from().join().group_by().having().union_all().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().union_all().union_all();

      expect(1).toEqual("NG - select().from().join().group_by().having().union_all().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().union_all().run();

      expect(1).toEqual("NG - select().from().join().group_by().having().union_all().run");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().union_all();

      expect(1).toEqual("NG - select().from().join().order_by().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().union_all();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().where().union_all");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().union_all().union();

      expect(1).toEqual("NG - select().from().where().union_all().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().union_all().union_all();

      expect(1).toEqual("NG - select().from().where().union_all().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().union_all().run();

      expect(1).toEqual("NG - select().from().where().union_all().run");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().union_all();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().group_by().union_all");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().union_all().union();

      expect(1).toEqual("NG - select().from().group_by().union_all().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().union_all().union_all();

      expect(1).toEqual("NG - select().from().group_by().union_all().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().union_all().run();

      expect(1).toEqual("NG - select().from().group_by().union_all().run");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().union_all();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().group_by().having().union_all");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().union_all().union();

      expect(1).toEqual("NG - select().from().group_by().having().union_all().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().union_all().union_all();

      expect(1).toEqual("NG - select().from().group_by().having().union_all().unin_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().union_all().run();

      expect(1).toEqual("NG - select().from().group_by().having().union_all().run");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().union_all();

      expect(1).toEqual("NG - select().from().order_by().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().union_all();

      expect(1).toEqual("NG - insert_into().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().values().union_all();

      expect(1).toEqual("NG - insert_into().values().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().select().from().union_all();

      expect(1).toEqual("NG - insert_into().select().from().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().union_all();

      expect(1).toEqual("NG - delete_from().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().where().union_all();

      expect(1).toEqual("NG - delete_from().where().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().union_all();

      expect(1).toEqual("NG - update().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().set().union_all();

      expect(1).toEqual("NG - update().set().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().set().where().union_all();

      expect(1).toEqual("NG - update().set().where().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().union_all().select();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().union_all().select");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().union_all().insert_into();

      expect(1).toEqual("NG - select().from().union_all().insert_into");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().union_all().delete_from();

      expect(1).toEqual("NG - select().from().union_all().delete_from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().union_all().update();

      expect(1).toEqual("NG - select().from().union_all().update");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.limit();

      expect(1).toEqual("NG - limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().limit();

      expect(1).toEqual("NG - select().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().limit");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().select();

      expect(1).toEqual("NG - select().from().limit().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().from();

      expect(1).toEqual("NG - select().from().limit().from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().as();

      expect(1).toEqual("NG - select().from().limit().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().join();

      expect(1).toEqual("NG - select().from().limit().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().where();

      expect(1).toEqual("NG - select().from().limit().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().group_by();

      expect(1).toEqual("NG - select().from().limit().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().having();

      expect(1).toEqual("NG - select().from().limit().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().union();

      expect(1).toEqual("NG - select().from().limit().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().union_all();

      expect(1).toEqual("NG - select().from().limit().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().order_by();

      expect(1).toEqual("NG - select().from().limit().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().limit();

      expect(1).toEqual("NG - select().from().limit().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().offset();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().limit().offset");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().offset().select();

      expect(1).toEqual("NG - select().from().limit().offset().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().offset().from();

      expect(1).toEqual("NG - select().from().limit().offset().from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().offset().as();

      expect(1).toEqual("NG - select().from().limit().offset().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().offset().join();

      expect(1).toEqual("NG - select().from().limit().offset().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().offset().where();

      expect(1).toEqual("NG - select().from().limit().offset().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().offset().group_by();

      expect(1).toEqual("NG - select().from().limit().offset().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().offset().having();

      expect(1).toEqual("NG - select().from().limit().offset().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().offset().union();

      expect(1).toEqual("NG - select().from().limit().offset().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().offset().union_all();

      expect(1).toEqual("NG - select().from().limit().offset().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().offset().order_by();

      expect(1).toEqual("NG - select().from().limit().offset().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().offset().limit();

      expect(1).toEqual("NG - select().from().limit().offset().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().offset().run();

      expect(1).toEqual("NG - select().from().limit().offset().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().limit().offset().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().limit().run();

      expect(1).toEqual("NG - select().from().limit().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().limit().offset().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().as().limit");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().select();

      expect(1).toEqual("NG - select().from().as().limit().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().from();

      expect(1).toEqual("NG - select().from().as().limit().from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().as();

      expect(1).toEqual("NG - select().from().as().limit().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().join();

      expect(1).toEqual("NG - select().from().as().limit().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().where();

      expect(1).toEqual("NG - select().from().as().limit().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().group_by();

      expect(1).toEqual("NG - select().from().as().limit().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().having();

      expect(1).toEqual("NG - select().from().as().limit().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().union();

      expect(1).toEqual("NG - select().from().as().limit().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().union_all();

      expect(1).toEqual("NG - select().from().as().limit().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().order_by();

      expect(1).toEqual("NG - select().from().as().limit().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().limit();

      expect(1).toEqual("NG - select().from().as().limit().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().offset();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().as().limit().offset");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().offset().select();

      expect(1).toEqual("NG - select().from().as().limit().offset().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().offset().from();

      expect(1).toEqual("NG - select().from().as().limit().offset().from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().offset().as();

      expect(1).toEqual("NG - select().from().as().limit().offset().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().offset().join();

      expect(1).toEqual("NG - select().from().as().limit().offset().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().offset().where();

      expect(1).toEqual("NG - select().from().as().limit().offset().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().offset().group_by();

      expect(1).toEqual("NG - select().from().as().limit().offset().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().offset().having();

      expect(1).toEqual("NG - select().from().as().limit().offset().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().offset().union();

      expect(1).toEqual("NG - select().from().as().limit().offset().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().offset().union_all();

      expect(1).toEqual("NG - select().from().as().limit().offset().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().offset().order_by();

      expect(1).toEqual("NG - select().from().as().limit().offset().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().offset().limit();

      expect(1).toEqual("NG - select().from().as().limit().offset().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().offset().offset();

      expect(1).toEqual("NG - select().from().as().limit().offset().offset");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().offset().run();

      expect(1).toEqual("NG - select().from().as().limit().offset().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().limit().offset().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().as().limit().run();

      expect(1).toEqual("NG - select().from().as().limit().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().limit().offset().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().limit");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().select();

      expect(1).toEqual("NG - select().from().join().limit().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().from();

      expect(1).toEqual("NG - select().from().join().limit().from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().as();

      expect(1).toEqual("NG - select().from().join().limit().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().join();

      expect(1).toEqual("NG - select().from().join().limit().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().where();

      expect(1).toEqual("NG - select().from().join().limit().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().group_by();

      expect(1).toEqual("NG - select().from().join().limit().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().having();

      expect(1).toEqual("NG - select().from().join().limit().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().union();

      expect(1).toEqual("NG - select().from().join().limit().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().union_all();

      expect(1).toEqual("NG - select().from().join().limit().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().order_by();

      expect(1).toEqual("NG - select().from().join().limit().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().limit();

      expect(1).toEqual("NG - select().from().join().limit().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().offset();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().limit().offset");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().offset().select();

      expect(1).toEqual("NG - select().from().join().limit().offset().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().offset().from();

      expect(1).toEqual("NG - select().from().join().limit().offset().from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().offset().as();

      expect(1).toEqual("NG - select().from().join().limit().offset().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().offset().join();

      expect(1).toEqual("NG - select().from().join().limit().offset().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().offset().where();

      expect(1).toEqual("NG - select().from().join().limit().offset().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().offset().group_by();

      expect(1).toEqual("NG - select().from().join().limit().offset().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().offset().having();

      expect(1).toEqual("NG - select().from().join().limit().offset().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().offset().union();

      expect(1).toEqual("NG - select().from().join().limit().offset().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().offset().union_all();

      expect(1).toEqual("NG - select().from().join().limit().offset().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().offset().order_by();

      expect(1).toEqual("NG - select().from().join().limit().offset().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().offset().limit();

      expect(1).toEqual("NG - select().from().join().limit().offset().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().offset().run();

      expect(1).toEqual("NG - select().from().join().limit().offset().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().join().limit().offset().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().limit().run();

      expect(1).toEqual("NG - select().from().join().limit().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().join().limit().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().where().limit");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().select();

      expect(1).toEqual("NG - select().from().join().where().limit().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().from();

      expect(1).toEqual("NG - select().from().join().where().limit().from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().as();

      expect(1).toEqual("NG - select().from().join().where().limit().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().join();

      expect(1).toEqual("NG - select().from().join().where().limit().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().where();

      expect(1).toEqual("NG - select().from().join().where().limit().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().group_by();

      expect(1).toEqual("NG - select().from().join().where().limit().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().having();

      expect(1).toEqual("NG - select().from().join().where().limit().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().union();

      expect(1).toEqual("NG - select().from().join().where().limit().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().union_all();

      expect(1).toEqual("NG - select().from().join().where().limit().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().order_by();

      expect(1).toEqual("NG - select().from().join().where().limit().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().limit();

      expect(1).toEqual("NG - select().from().join().where().limit().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().offset();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().where().limit().offset");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().offset().select();

      expect(1).toEqual("NG - select().from().join().where().limit().offset().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().offset().from();

      expect(1).toEqual("NG - select().from().join().where().limit().offset().from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().offset().as();

      expect(1).toEqual("NG - select().from().join().where().limit().offset().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().offset().join();

      expect(1).toEqual("NG - select().from().join().where().limit().offset().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().offset().where();

      expect(1).toEqual("NG - select().from().join().where().limit().offset().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().offset().group_by();

      expect(1).toEqual("NG - select().from().join().where().limit().offset().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().offset().having();

      expect(1).toEqual("NG - select().from().join().where().limit().offset().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().offset().union();

      expect(1).toEqual("NG - select().from().join().where().limit().offset().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().offset().union_all();

      expect(1).toEqual("NG - select().from().join().where().limit().offset().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().offset().order_by();

      expect(1).toEqual("NG - select().from().join().where().limit().offset().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().offset().limit();

      expect(1).toEqual("NG - select().from().join().where().limit().offset().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().offset().run();

      expect(1).toEqual("NG - select().from().join().where().limit().offset().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().join().where().limit().offset().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().where().limit().run();

      expect(1).toEqual("NG - select().from().join().where().limit().run");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().group_by().limit");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().select();

      expect(1).toEqual("NG - select().from().join().group_by().limit().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().from();

      expect(1).toEqual("NG - select().from().join().group_by().limit().from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().as();

      expect(1).toEqual("NG - select().from().join().group_by().limit().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().join();

      expect(1).toEqual("NG - select().from().join().group_by().limit().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().where();

      expect(1).toEqual("NG - select().from().join().group_by().limit().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().group_by();

      expect(1).toEqual("NG - select().from().join().group_by().limit().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().having();

      expect(1).toEqual("NG - select().from().join().group_by().limit().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().union();

      expect(1).toEqual("NG - select().from().join().group_by().limit().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().union_all();

      expect(1).toEqual("NG - select().from().join().group_by().limit().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().order_by();

      expect(1).toEqual("NG - select().from().join().group_by().limit().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().limit();

      expect(1).toEqual("NG - select().from().join().group_by().limit().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().offset();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().group_by().limit().offset");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().offset().select();

      expect(1).toEqual("NG - select().from().join().group_by().limit().offset().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().offset().from();

      expect(1).toEqual("NG - select().from().join().group_by().limit().offset().from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().offset().as();

      expect(1).toEqual("NG - select().from().join().group_by().limit().offset().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().offset().join();

      expect(1).toEqual("NG - select().from().join().group_by().limit().offset().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().offset().where();

      expect(1).toEqual("NG - select().from().join().group_by().limit().offset().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().offset().group_by();

      expect(1).toEqual("NG - select().from().join().group_by().limit().offset().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().offset().having();

      expect(1).toEqual("NG - select().from().join().group_by().limit().offset().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().offset().union();

      expect(1).toEqual("NG - select().from().join().group_by().limit().offset().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().offset().union_all();

      expect(1).toEqual("NG - select().from().join().group_by().limit().offset().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().offset().order_by();

      expect(1).toEqual("NG - select().from().join().group_by().limit().offset().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().offset().limit();

      expect(1).toEqual("NG - select().from().join().group_by().limit().offset().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().offset().run();

      expect(1).toEqual("NG - select().from().join().group_by().limit().offset().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().join().group_by().limit().offset().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().limit().run();

      expect(1).toEqual("NG - select().from().join().group_by().limit().run");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().group_by().having().limit");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().select();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().from();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().as();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().join();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().where();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().group_by();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().having();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().union();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().union_all();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().order_by();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().limit();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().offset();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().group_by().having().limit().offset");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().offset().select();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().offset().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().offset().from();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().offset().from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().offset().as();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().offset().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().offset().join();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().offset().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().offset().where();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().offset().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().offset().group_by();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().offset().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().offset().having();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().offset().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().offset().union();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().offset().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().offset().union_all();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().offset().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().offset().order_by();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().offset().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().offset().limit();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().offset().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().offset().run();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().offset().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().join().group_by().having().limit().offset().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().group_by().having().limit().run();

      expect(1).toEqual("NG - select().from().join().group_by().having().limit().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().join().group_by().having().limit().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().order_by().limit");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().select();

      expect(1).toEqual("NG - select().from().join().order_by().limit().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().from();

      expect(1).toEqual("NG - select().from().join().order_by().limit().from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().as();

      expect(1).toEqual("NG - select().from().join().order_by().limit().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().join();

      expect(1).toEqual("NG - select().from().join().order_by().limit().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().where();

      expect(1).toEqual("NG - select().from().join().order_by().limit().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().group_by();

      expect(1).toEqual("NG - select().from().join().order_by().limit().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().having();

      expect(1).toEqual("NG - select().from().join().order_by().limit().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().union();

      expect(1).toEqual("NG - select().from().join().order_by().limit().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().union_all();

      expect(1).toEqual("NG - select().from().join().order_by().limit().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().order_by();

      expect(1).toEqual("NG - select().from().join().order_by().limit().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().limit();

      expect(1).toEqual("NG - select().from().join().order_by().limit().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().offset();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().join().order_by().limit().offset");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().offset().select();

      expect(1).toEqual("NG - select().from().join().order_by().limit().offset().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().offset().from();

      expect(1).toEqual("NG - select().from().join().order_by().limit().offset().from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().offset().as();

      expect(1).toEqual("NG - select().from().join().order_by().limit().offset().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().offset().join();

      expect(1).toEqual("NG - select().from().join().order_by().limit().offset().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().offset().where();

      expect(1).toEqual("NG - select().from().join().order_by().limit().offset().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().offset().group_by();

      expect(1).toEqual("NG - select().from().join().order_by().limit().offset().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().offset().having();

      expect(1).toEqual("NG - select().from().join().order_by().limit().offset().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().offset().union();

      expect(1).toEqual("NG - select().from().join().order_by().limit().offset().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().offset().union_all();

      expect(1).toEqual("NG - select().from().join().order_by().limit().offset().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().offset().order_by();

      expect(1).toEqual("NG - select().from().join().order_by().limit().offset().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().offset().limit();

      expect(1).toEqual("NG - select().from().join().order_by().limit().offset().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().offset().run();

      expect(1).toEqual("NG - select().from().join().order_by().limit().offset().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().join().order_by().limit().offset().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().join().order_by().limit().run();

      expect(1).toEqual("NG - select().from().join().order_by().limit().run");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().where().limit");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().select();

      expect(1).toEqual("NG - select().from().where().limit().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().from();

      expect(1).toEqual("NG - select().from().where().limit().from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().as();

      expect(1).toEqual("NG - select().from().where().limit().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().join();

      expect(1).toEqual("NG - select().from().where().limit().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().where();

      expect(1).toEqual("NG - select().from().where().limit().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().group_by();

      expect(1).toEqual("NG - select().from().where().limit().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().having();

      expect(1).toEqual("NG - select().from().where().limit().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().union();

      expect(1).toEqual("NG - select().from().where().limit().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().union_all();

      expect(1).toEqual("NG - select().from().where().limit().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().order_by();

      expect(1).toEqual("NG - select().from().where().limit().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().limit();

      expect(1).toEqual("NG - select().from().where().limit().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().offset();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().where().limit().offset");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().offset().select();

      expect(1).toEqual("NG - select().from().where().limit().offset().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().offset().from();

      expect(1).toEqual("NG - select().from().where().limit().offset().from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().offset().as();

      expect(1).toEqual("NG - select().from().where().limit().offset().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().offset().join();

      expect(1).toEqual("NG - select().from().where().limit().offset().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().offset().where();

      expect(1).toEqual("NG - select().from().where().limit().offset().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().offset().group_by();

      expect(1).toEqual("NG - select().from().where().limit().offset().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().offset().having();

      expect(1).toEqual("NG - select().from().where().limit().offset().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().offset().union();

      expect(1).toEqual("NG - select().from().where().limit().offset().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().offset().union_all();

      expect(1).toEqual("NG - select().from().where().limit().offset().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().offset().order_by();

      expect(1).toEqual("NG - select().from().where().limit().offset().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().offset().limit();

      expect(1).toEqual("NG - select().from().where().limit().offset().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().offset().run();

      expect(1).toEqual("NG - select().from().where().limit().offset().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().where().limit().offset().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().where().limit().run();

      expect(1).toEqual("NG - select().from().where().limit().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().where().limit().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().group_by().limit");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().select();

      expect(1).toEqual("NG - select().from().group_by().limit().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().from();

      expect(1).toEqual("NG - select().from().group_by().limit().from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().as();

      expect(1).toEqual("NG - select().from().group_by().limit().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().join();

      expect(1).toEqual("NG - select().from().group_by().limit().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().where();

      expect(1).toEqual("NG - select().from().group_by().limit().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().group_by();

      expect(1).toEqual("NG - select().from().group_by().limit().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().having();

      expect(1).toEqual("NG - select().from().group_by().limit().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().union();

      expect(1).toEqual("NG - select().from().group_by().limit().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().union_all();

      expect(1).toEqual("NG - select().from().group_by().limit().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().order_by();

      expect(1).toEqual("NG - select().from().group_by().limit().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().limit();

      expect(1).toEqual("NG - select().from().group_by().limit().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().offset();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().group_by().limit().offset");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().offset().select();

      expect(1).toEqual("NG - select().from().group_by().limit().offset().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().offset().from();

      expect(1).toEqual("NG - select().from().group_by().limit().offset().from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().offset().as();

      expect(1).toEqual("NG - select().from().group_by().limit().offset().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().offset().join();

      expect(1).toEqual("NG - select().from().group_by().limit().offset().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().offset().where();

      expect(1).toEqual("NG - select().from().group_by().limit().offset().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().offset().group_by();

      expect(1).toEqual("NG - select().from().group_by().limit().offset().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().offset().having();

      expect(1).toEqual("NG - select().from().group_by().limit().offset().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().offset().union();

      expect(1).toEqual("NG - select().from().group_by().limit().offset().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().offset().union_all();

      expect(1).toEqual("NG - select().from().group_by().limit().offset().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().offset().order_by();

      expect(1).toEqual("NG - select().from().group_by().limit().offset().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().offset().limit();

      expect(1).toEqual("NG - select().from().group_by().limit().offset().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().offset().run();

      expect(1).toEqual("NG - select().from().group_by().limit().offset().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().group_by().limit().offset().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().limit().run();

      expect(1).toEqual("NG - select().from().group_by().limit().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().group_by().limit().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().group_by().having().limit");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().select();

      expect(1).toEqual("NG - select().from().group_by().having().limit().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().from();

      expect(1).toEqual("NG - select().from().group_by().having().limit().from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().as();

      expect(1).toEqual("NG - select().from().group_by().having().limit().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().join();

      expect(1).toEqual("NG - select().from().group_by().having().limit().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().where();

      expect(1).toEqual("NG - select().from().group_by().having().limit().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().group_by();

      expect(1).toEqual("NG - select().from().group_by().having().limit().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().having();

      expect(1).toEqual("NG - select().from().group_by().having().limit().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().union();

      expect(1).toEqual("NG - select().from().group_by().having().limit().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().union_all();

      expect(1).toEqual("NG - select().from().group_by().having().limit().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().order_by();

      expect(1).toEqual("NG - select().from().group_by().having().limit().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().limit();

      expect(1).toEqual("NG - select().from().group_by().having().limit().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().offset();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().group_by().having().limit().offset");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().offset().select();

      expect(1).toEqual("NG - select().from().group_by().having().limit().offset().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().offset().from();

      expect(1).toEqual("NG - select().from().group_by().having().limit().offset().from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().offset().as();

      expect(1).toEqual("NG - select().from().group_by().having().limit().offset().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().offset().join();

      expect(1).toEqual("NG - select().from().group_by().having().limit().offset().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().offset().where();

      expect(1).toEqual("NG - select().from().group_by().having().limit().offset().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().offset().group_by();

      expect(1).toEqual("NG - select().from().group_by().having().limit().offset().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().offset().having();

      expect(1).toEqual("NG - select().from().group_by().having().limit().offset().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().offset().union();

      expect(1).toEqual("NG - select().from().group_by().having().limit().offset().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().offset().union_all();

      expect(1).toEqual("NG - select().from().group_by().having().limit().offset().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().offset().order_by();

      expect(1).toEqual("NG - select().from().group_by().having().limit().offset().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().offset().limit();

      expect(1).toEqual("NG - select().from().group_by().having().limit().offset().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().offset().run();

      expect(1).toEqual("NG - select().from().group_by().having().limit().offset().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().group_by().having().limit().offset().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().group_by().having().limit().run();

      expect(1).toEqual("NG - select().from().group_by().having().limit().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().group_by().having().limit().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().union().limit();

      expect(1).toEqual("NG - select().from().union().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().union_all().limit();

      expect(1).toEqual("NG - select().from().union_all().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().order_by().limit");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().select();

      expect(1).toEqual("NG - select().from().order_by().limit().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().from();

      expect(1).toEqual("NG - select().from().order_by().limit().from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().as();

      expect(1).toEqual("NG - select().from().order_by().limit().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().join();

      expect(1).toEqual("NG - select().from().order_by().limit().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().where();

      expect(1).toEqual("NG - select().from().order_by().limit().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().group_by();

      expect(1).toEqual("NG - select().from().order_by().limit().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().having();

      expect(1).toEqual("NG - select().from().order_by().limit().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().union();

      expect(1).toEqual("NG - select().from().order_by().limit().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().union_all();

      expect(1).toEqual("NG - select().from().order_by().limit().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().order_by();

      expect(1).toEqual("NG - select().from().order_by().limit().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().limit();

      expect(1).toEqual("NG - select().from().order_by().limit().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().offset();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - select().from().order_by().limit().offset");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().offset().select();

      expect(1).toEqual("NG - select().from().order_by().limit().offset().select");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().offset().from();

      expect(1).toEqual("NG - select().from().order_by().limit().offset().from");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().offset().as();

      expect(1).toEqual("NG - select().from().order_by().limit().offset().as");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().offset().join();

      expect(1).toEqual("NG - select().from().order_by().limit().offset().join");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().offset().where();

      expect(1).toEqual("NG - select().from().order_by().limit().offset().where");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().offset().group_by();

      expect(1).toEqual("NG - select().from().order_by().limit().offset().group_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().offset().having();

      expect(1).toEqual("NG - select().from().order_by().limit().offset().having");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().offset().union();

      expect(1).toEqual("NG - select().from().order_by().limit().offset().union");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().offset().union_all();

      expect(1).toEqual("NG - select().from().order_by().limit().offset().union_all");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().offset().order_by();

      expect(1).toEqual("NG - select().from().order_by().limit().offset().order_by");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().offset().limit();

      expect(1).toEqual("NG - select().from().order_by().limit().offset().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().offset().run();

      expect(1).toEqual("NG - select().from().order_by().limit().offset().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().order_by().limit().offset().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.select().from().order_by().limit().run();

      expect(1).toEqual("NG - select().from().order_by().limit().run");
    } catch(e) {
      if(e.message.match(/^Dml is not initialized/)) {
        expect(1).toEqual(1);
      } else {
        expect(1).toEqual("NG - select().from().order_by().limit().run");
      }
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().limit();

      expect(1).toEqual("NG - insert_into().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().values().limit();

      expect(1).toEqual("NG - insert_into().values().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.insert_into().select().from().limit();

      expect(1).toEqual(1);
    } catch(e) {
      expect(1).toEqual("NG - insert_into().select().from().limit");
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().limit();

      expect(1).toEqual("NG - delete_from().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.delete_from().where().limit();

      expect(1).toEqual("NG - delete_from().where().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().limit();

      expect(1).toEqual("NG - update().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().set().limit();

      expect(1).toEqual("NG - update().set().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }

    try {
      q = new Dml();
      q._check_arguments = false;
      q.update().set().where().limit();

      expect(1).toEqual("NG - update().set().where().limit");
    } catch(e) {
      expect(1).toEqual(1);
    }


    done();
  });

});
