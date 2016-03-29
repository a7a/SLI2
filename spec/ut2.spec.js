var SelectionAggregator =
    require("../dist/js/node/lib/SelectionAggregator.js").SelectionAggregator;

describe('test1 - SelectionAggregator.js', function() {

  it("001 - SelectionAggregator", function(done) {

    var x = SelectionAggregator.createAggregationOperator(["key1", "key2"]);
    var test = [
      { key1: 100, key2: 200,
        key_min: 25, key_max: 40, key_avg: 7.5, key_sum: 95, key_count: 2 },
      { key1: 100, key2: 300,
        key_min: 60, key_max: 70, key_avg: 80, key_sum: 90, key_count: 1 },
      { key1: 200, key2: 200,
        key_min: 100, key_max: 250, key_avg: 325, key_sum: 850, key_count: 2 }
    ];

    x(100).as("key1");
    x(200).as("key2");
    x.min(30).as("key_min");
    x.max(40).as("key_max");
    x.avg(10).as("key_avg");
    x.sum(50).as("key_sum");
    x.count().as("key_count");
    x.aggregate();

    x(100).as("key1");
    x(300).as("key2");
    x.min(60).as("key_min");
    x.max(70).as("key_max");
    x.avg(80).as("key_avg");
    x.sum(90).as("key_sum");
    x.count().as("key_count");
    x.aggregate();

    x(200).as("key1");
    x(200).as("key2");
    x.min(100).as("key_min");
    x.max(200).as("key_max");
    x.avg(300).as("key_avg");
    x.sum(400).as("key_sum");
    x.count().as("key_count");
    x.aggregate();

    x(200).as("key1");
    x(200).as("key2");
    x.min(150).as("key_min");
    x.max(250).as("key_max");
    x.avg(350).as("key_avg");
    x.sum(450).as("key_sum");
    x.count().as("key_count");
    x.aggregate();

    x(100).as("key1");
    x(200).as("key2");
    x.min(25).as("key_min");
    x.max(35).as("key_max");
    x.avg(5).as("key_avg");
    x.sum(45).as("key_sum");
    x.count().as("key_count");
    x.aggregate();

    var res = x.getResult();

    for(var i = 0, l = res.length; i < l; i = i + 1) {
      expect(test[i]).toEqual(res[i]);
    }

    done();
  });

  it("002 - ", function(done) {

    var x = SelectionAggregator.createAggregationOperator([0, 1]);
    var test = [
      { 0: 100, 1: 200,
        2: 25, 3: 40, 4: 7.5, 5: 95, 6: 2 },
      { 0: 100, 1: 300,
        2: 60, 3: 70, 4: 80, 5: 90, 6: 1 },
      { 0: 200, 1: 200,
        2: 100, 3: 250, 4: 325, 5: 850, 6: 2 }
    ];

    x(100);
    x(200);
    x.min(30);
    x.max(40);
    x.avg(10);
    x.sum(50);
    x.count();
    x.aggregate();

    x(100);
    x(300);
    x.min(60);
    x.max(70);
    x.avg(80);
    x.sum(90);
    x.count();
    x.aggregate();

    x(200);
    x(200);
    x.min(100);
    x.max(200);
    x.avg(300);
    x.sum(400);
    x.count();
    x.aggregate();

    x(200);
    x(200);
    x.min(150);
    x.max(250);
    x.avg(350);
    x.sum(450);
    x.count();
    x.aggregate();

    x(100);
    x(200);
    x.min(25);
    x.max(35);
    x.avg(5);
    x.sum(45);
    x.count();
    x.aggregate();

    var res = x.getResult()

    for(var i = 0, l = res.length; i < l; i = i + 1) {
      expect(test[i]).toEqual(res[i]);
    }

    done();
  });

  it("003 - ", function(done) {

    var x = SelectionAggregator.createAggregationOperator();
    var test = [
      { 0: 100, 1: 200 },
      { 0: 100, 1: 300 },
      { 0: 200, 1: 200 },
      { 0: 200, 1: 200 },
      { 0: 100, 1: 200 }
    ];

    x(100);
    x(200);
    x.aggregate();

    x(100);
    x(300);
    x.aggregate();

    x(200);
    x(200);
    x.aggregate();

    x(200);
    x(200);
    x.aggregate();

    x(100);
    x(200);
    x.aggregate();

    var res = x.getResult()

    for(var i = 0, l = res.length; i < l; i = i + 1) {
      expect(test[i]).toEqual(res[i]);
    }

    done();
  });

});
