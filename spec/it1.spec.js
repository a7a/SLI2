var SLII = require("../dist/js/node/SLII.js").SLII;

describe('test1 - SLII.js', function() {

  var test_data = [
    { key1: "a", key2: 10, key3: 100 },
    { key1: "b", key2: 30, key3: 200 },
    { key1: "c", key2: 50, key3: 110 },
    { key1: "d", key2: 20, key3: 400 },
    { key1: "c", key2: 100, key3: 50 },
    { key1: "e", key2: 200, key3: 60 },
    { key1: "e", key2: 25, key3: 120 }
  ];
  var test_data2 = [
    { key1: "a", key2: 30 },
    { key1: "c", key2: 10 },
    { key1: "d", key2: 60 },
    { key1: "e", key2: 0 },
    { key1: "f", key2: 0 }
  ];
  var test_data3 = [
    { key1: "a", key2: 100 },
    { key1: "b", key2: 200 },
    { key1: "c", key2: 300 },
    { key1: "d", key2: 10 },
    { key1: "e", key2: 50 },
    { key1: "a", key2: 80 },
    { key1: "d", key2: 100 },
    { key1: "a", key2: 20 }
  ];

  function obj_match(obj1, obj2) {
    if(!obj1 || !obj2) {
      return false;
    }

    var keys1 = Object.keys(obj1),
        keys2 = Object.keys(obj2);

    if(keys1.length !== keys2.length) {
      return false;
    }

    for(var key in obj1) {
      if(obj1[key].constructor === Object && obj2[key].constructor === Object) {
        if(!obj_match(obj1[key], obj2[key])) {
          return false;
        }
      } else if(obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  }

  it("001 - SLII no_idb mode", function(done) {

    var slii = new SLII("", { mode: "no_idb" });

    slii.select()
    .from(test_data)
    .run(function(rows) {

      var test_result = true,
          compared = false;

      for(var i = 0, l = rows.length; i < l; i = i + 1) {
        for(var key in rows[i]) {
          compared = true;

          if(rows[i][key] !== test_data[i][key]) {
            test_result = false;
            break;
          }
        }
        if(!test_result) {
          break;
        }
      }

      expect(true).toEqual(test_result && compared);

      done();
    });
  });

  it("002 - SLII no_idb mode join", function(done) {

    var test_join_with_alias_data = [],
        test_left_join_with_alias_data = [],
        test_right_join_with_alias_data = [],
        test_join_no_alias_data = [],
        test_left_join_no_alias_data = [],
        test_right_join_no_alias_data = [],
        match_count = 0;

    for(var k1 in test_data) {
      for(var k2 in test_data2) {
        if(test_data[k1].key1 === test_data2[k2].key1) {
          test_join_with_alias_data[test_join_with_alias_data.length] = {
            "data1": test_data[k1],
            "data2": test_data2[k2]
          };
        }
      }
    }
    for(var k1 in test_data) {
      for(var k2 in test_data2) {
        if(test_data[k1].key1 === test_data2[k2].key1) {
          test_join_no_alias_data[test_join_no_alias_data.length] = {
            "left": test_data[k1],
            "right_1": test_data2[k2]
          };
        }
      }
    }
    for(var k1 in test_data) {
      match_count = 0;

      for(var k2 in test_data2) {
        if(test_data[k1].key1 === test_data2[k2].key1) {
          match_count = match_count + 1;
          test_left_join_with_alias_data[test_left_join_with_alias_data.length] = {
            "data1": test_data[k1],
            "data2": test_data2[k2]
          };
        }
      }

      if(match_count === 0) {
        test_left_join_with_alias_data[test_left_join_with_alias_data.length] = { "data1": test_data[k1] };
      }
    }
    for(var k1 in test_data) {
      match_count = 0;

      for(var k2 in test_data2) {
        if(test_data[k1].key1 === test_data2[k2].key1) {
          match_count = match_count + 1;
          test_left_join_no_alias_data[test_left_join_no_alias_data.length] = {
            "left": test_data[k1],
            "right_1": test_data2[k2]
          };
        }
      }

      if(match_count === 0) {
        test_left_join_no_alias_data[test_left_join_no_alias_data.length] = { "left": test_data[k1] };
      }
    }
    for(var k1 in test_data2) {
      match_count = 0;

      for(var k2 in test_data) {
        if(test_data2[k1].key1 === test_data[k2].key1) {
          match_count = match_count + 1;
          test_right_join_with_alias_data[test_right_join_with_alias_data.length] = {
            "data1": test_data[k2],
            "data2": test_data2[k1]
          };
        }
      }

      if(match_count === 0) {
        test_right_join_with_alias_data[test_right_join_with_alias_data.length] = { "data2": test_data2[k1] };
      }
    }
    for(var k1 in test_data2) {
      match_count = 0;

      for(var k2 in test_data) {
        if(test_data2[k1].key1 === test_data[k2].key1) {
          match_count = match_count + 1;
          test_right_join_no_alias_data[test_right_join_no_alias_data.length] = {
            "left": test_data[k2],
            "right_1": test_data2[k1]
          };
        }
      }

      if(match_count === 0) {
        test_right_join_no_alias_data[test_right_join_no_alias_data.length] = { "right_1": test_data2[k1] };
      }
    }

    var slii = new SLII("", { mode: "no_idb" });

    new Promise(function(fulfill, reject) {
      slii.select()
      .from(test_data).as("data1")
      .join(test_data2, function($) {
        $.and("data1.key1").eq.key("data2.key1");
      }).as("data2")
      .run(function(rows) {

        var test_result = true,
            compared = false;

        for(var i = 0, l = rows.length; i < l; i = i + 1) {
          compared = true;

          var match = obj_match(rows[i], test_join_with_alias_data[i]);

          if(!match) {
            test_result = false;
            break;
          }
        }

        expect(test_result && compared).toEqual(true, "select from as join as");

        fulfill();
      });

    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        slii.select()
        .from(test_data).as("data1")
        .left_join(test_data2, function($) {
          $.and("data1.key1").eq.key("data2.key1");
        }).as("data2")
        .run(function(rows) {

          var test_result = true,
              compared = false;

          for(var i = 0, l = rows.length; i < l; i = i + 1) {
            compared = true;

            var match = obj_match(rows[i], test_left_join_with_alias_data[i]);

            if(!match) {
              test_result = false;
              break;
            }
          }

          expect(test_result && compared).toEqual(true, "select form as left_join as");

          fulfill();
        });
      });

    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        slii.select()
        .from(test_data).as("data1")
        .right_join(test_data2, function($) {
          $.and("data1.key1").eq.key("data2.key1");
        }).as("data2")
        .run(function(rows) {

          var test_result = true,
              compared = false;

          for(var i = 0, l = rows.length; i < l; i = i + 1) {
            compared = true;

            var match = obj_match(rows[i], test_right_join_with_alias_data[i]);

            if(!match) {
              test_result = false;
              break;
            }
          }

          expect(test_result && compared).toEqual(true, "select from as right_join as");

          fulfill();
        });
      });

    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        slii.select()
        .from(test_data)
        .join(test_data2, function($) {
          $.and("left.key1").eq.key("right_1.key1");
        })
        .run(function(rows) {

          var test_result = true,
              compared = false;

          for(var i = 0, l = rows.length; i < l; i = i + 1) {
            compared = true;

            var match = obj_match(rows[i], test_join_no_alias_data[i]);

            if(!match) {
              test_result = false;
              break;
            }
          }

          expect(test_result && compared).toEqual(true, "select from join ");

          fulfill();
        });
      });

    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        slii.select()
        .from(test_data)
        .left_join(test_data2, function($) {
          $.and("left.key1").eq.key("right_1.key1");
        })
        .run(function(rows) {

          var test_result = true,
              compared = false;

          for(var i = 0, l = rows.length; i < l; i = i + 1) {
            compared = true;

            var match = obj_match(rows[i], test_left_join_no_alias_data[i]);

            if(!match) {
              test_result = false;
              break;
            }
          }

          expect(test_result && compared).toEqual(true, "select from left_join");

          fulfill();
        });
      });

    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        slii.select()
        .from(test_data)
        .right_join(test_data2, function($) {
          $.and("left.key1").eq.key("right_1.key1");
        })
        .run(function(rows, ok, ng) {

          var test_result = true,
              compared = false;

          for(var i = 0, l = rows.length; i < l; i = i + 1) {
            compared = true;

            var match = obj_match(rows[i], test_right_join_no_alias_data[i]);

            if(!match) {
              test_result = false;
              break;
            }
          }

          if(test_result && compared) {
            expect(1).toEqual(1);
            ok();
          } else {
            expect(1).toEqual(0, "select from right_join");
            ng();
          }
        })
        .then(function() {
          fulfill();
        })
        .catch(function(err) {
          reject(err);
        });
      });

    })
    .then(function() {
      return new Promise(function(fulfill, reject) {
        slii.select()
        .from(slii.select().from(test_data))
        .run(function(rows) {
          fulfill();
        });
      });
    })
    .then(function() {
      done();
    })
    .catch(function() {
      done();
    });
  });

  it("003 - SLII no_idb select from", function(done) {
    var test_result_data = test_data;

    var slii = new SLII("", { mode: "no_idb" });

    slii
    .select()
    .from(test_data)
    .run(function(rows) {
      var test_result = true,
          compared = false;

      for(var i = 0, l = rows.length; i < l; i = i + 1) {
        compared = true;

        if(!obj_match(rows[i], test_result_data[i])) {
          test_result = false;
          break;
        }
      }

      expect(true).toEqual(test_result && compared);

      done();
    });

  });

  it("004 - SLII no_idb select from where", function(done) {
    var test_result_data = [];
    for(var i = 0, l = test_data.length; i < l; i = i + 1) {
      if(test_data[i].key2 > 20) {
        test_result_data[test_result_data.length] = test_data[i];
      }
    }

    var slii = new SLII("", { mode: "no_idb" });

    slii
    .select()
    .from(test_data)
    .where(function($) {
      $.and("key2").gt.value(20);
    })
    .run(function(rows) {
      var test_result = true,
          compared = false;

      for(var i = 0, l = rows.length; i < l; i = i + 1) {
        compared = true;

        if(!obj_match(rows[i], test_result_data[i])) {
          test_result = false;
          break;
        }
      }

      expect(true).toEqual(test_result && compared);

      done();
    });

  });

  it("004_2 - SLII no_idb select from where", function(done) {
    var slii = new SLII("", { mode: "no_idb" });

    (function() {
      return slii
      .select()
      .from(test_data)
      .run(function(rows, ok, ng) {
        //console.log(rows);

        ok();
      });
    }())
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .where(function($) {
          $.and("key1").eq.value("a");
        })
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .where(function($) {
            $.and("left.key1").eq.value("a");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false;

          if(result_rows1.length === result_rows2.length) {
            for(var i = 0, l = result_rows1.length; i < l; i = i + 1) {
              compared = true;

              if(!obj_match(result_rows1[i], result_rows2[i])) {
                test_result = false;
                break;
              }
            }
          } else {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from where");

          fulfill();
        });
      });
    })
    .then(function() {
      return slii
      .select()
      .from(test_data).as("test_data")
      .run(function(rows, ok, ng) {
        //console.log(rows);

        ok();
      });
    })
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [],
          result_rows3 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data).as("test_data")
        .where(function($) {
          $.and("key1").eq.value("a");
        })
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data).as("test_data")
          .where(function($) {
            $.and("left.key1").eq.value("a");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          return slii
          .select()
          .from(test_data).as("test_data")
          .where(function($) {
            $.and("test_data.key1").eq.value("a");
          })
          .run(function(rows, ok, ng) {
            result_rows3 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false;

          if(result_rows1.length === result_rows3.length && result_rows2.length === 0) {
            for(var i = 0, l = result_rows1.length; i < l; i = i + 1) {
              compared = true;

              if(!obj_match(result_rows1[i], result_rows3[i])) {
                test_result = false;
                break;
              }
            }
          } else {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from as where");

          fulfill();
        });
      });
    })
    .then(function() {
      done();
    });
  });

  it("004_10 - SLII no_idb select from join where", function(done) {
    var slii = new SLII("", { mode: "no_idb" });

    (function() {
      return slii
      .select()
      .from(test_data)
      .join(test_data2)
      .run(function(rows, ok, ng) {
        //console.log(rows);

        ok();
      });
    }())
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .join(test_data2, function($) {
          $.and("right_1.key1").eq.value("a");
        })
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .join(test_data2)
          .where(function($) {
            $.and("right_1.key1").eq.value("a");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false;

          if(result_rows1.length === result_rows2.length) {
            for(var i = 0, l = result_rows1.length; i < l; i = i + 1) {
              compared = true;

              if(!obj_match(result_rows1[i], result_rows2[i])) {
                test_result = false;
                break;
              }
            }
          } else {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from join where - 1");

          fulfill();
        });
      });
    })
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .join(test_data2, function($) {
          $.and("left.key1").eq.value("b");
          $.and("right_1.key1").eq.value("a");
        })
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .join(test_data2)
          .where(function($) {
            $.and("right_1.key1").eq.value("a");
            $.and("left.key1").eq.value("b");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false;

          if(result_rows1.length === result_rows2.length) {
            for(var i = 0, l = result_rows1.length; i < l; i = i + 1) {
              compared = true;

              if(!obj_match(result_rows1[i], result_rows2[i])) {
                test_result = false;
                break;
              }
            }
          } else {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from join where - 2");

          fulfill();
        });
      });
    })
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .join(test_data2, function($) {
          $.and("left.key1").eq.key("right_1.key1");
          $.and("right_1.key1").eq.value("a");
        })
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .join(test_data2)
          .where(function($) {
            $.and("right_1.key1").eq.value("a");
            $.and("left.key1").eq.key("right_1.key1");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false;

          if(result_rows1.length === result_rows2.length) {
            for(var i = 0, l = result_rows1.length; i < l; i = i + 1) {
              compared = true;

              if(!obj_match(result_rows1[i], result_rows2[i])) {
                test_result = false;
                break;
              }
            }
          } else {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from join where - 3");

          fulfill();
        });
      });
    })
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .join(test_data2, function($) {
          $.and("key1").eq.key("right_1.key1");
          $.and("right_1.key1").eq.value("a");
        })
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .join(test_data2)
          .where(function($) {
            $.and("right_1.key1").eq.value("a");
            $.and("key1").eq.key("right_1.key1");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false;

          if(result_rows1.length === 0 && result_rows2.length === 0) {
            compared = true;
          } else {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from join where - 4");

          fulfill();
        });
      });
    })
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .join(test_data2, function($) {
          $.and("test_data2.key1").eq.value("a");
        }).as("test_data2")
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .join(test_data2).as("test_data2")
          .where(function($) {
            $.and("test_data2.key1").eq.value("a");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false;

          if(result_rows1.length === result_rows2.length) {
            for(var i = 0, l = result_rows1.length; i < l; i = i + 1) {
              compared = true;

              if(!obj_match(result_rows1[i], result_rows2[i])) {
                test_result = false;
                break;
              }
            }
          } else {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from join as where - 1");

          fulfill();
        })
        .catch(function(err) { console.log(err); });
      });
    })
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .join(test_data2, function($) {
          $.and("left.key1").eq.value("b");
          $.and("test_data2.key1").eq.value("a");
        }).as("test_data2")
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .join(test_data2).as("test_data2")
          .where(function($) {
            $.and("test_data2.key1").eq.value("a");
            $.and("left.key1").eq.value("b");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false;

          if(result_rows1.length === result_rows2.length) {
            for(var i = 0, l = result_rows1.length; i < l; i = i + 1) {
              compared = true;

              if(!obj_match(result_rows1[i], result_rows2[i])) {
                test_result = false;
                break;
              }
            }
          } else {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from join as where - 2");

          fulfill();
        });
      });
    })
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .join(test_data2, function($) {
          $.and("left.key1").eq.key("test_data2.key1");
          $.and("test_data2.key1").eq.value("a");
        }).as("test_data2")
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .join(test_data2).as("test_data2")
          .where(function($) {
            $.and("test_data2.key1").eq.value("a");
            $.and("left.key1").eq.key("test_data2.key1");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false;

          if(result_rows1.length === result_rows2.length) {
            for(var i = 0, l = result_rows1.length; i < l; i = i + 1) {
              compared = true;

              if(!obj_match(result_rows1[i], result_rows2[i])) {
                test_result = false;
                break;
              }
            }
          } else {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from join as where - 3");

          fulfill();
        });
      });
    })
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .join(test_data2, function($) {
          $.and("key1").eq.key("test_data2.key1");
          $.and("test_data2.key1").eq.value("a");
        }).as("test_data2")
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .join(test_data2).as("test_data2")
          .where(function($) {
            $.and("test_data2.key1").eq.value("a");
            $.and("key1").eq.key("test_data2.key1");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false;

          if(result_rows1.length === 0 && result_rows2.length === 0) {
            compared = true;
          } else {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from join as where - 4");

          fulfill();
        });
      });
    })
    .then(function() {
      done();
    });

  });

  it("004_11 - SLII no_idb select from left_join where", function(done) {
    var slii = new SLII("", { mode: "no_idb" });

    (function() {
      return slii
        .select()
        .from(test_data)
        .left_join(test_data2)
        .run(function(rows, ok, ng) {
        //console.log(rows);

        ok();
      });
    }())
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .left_join(test_data2, function($) {
          $.and("right_1.key1").eq.value("a");
        })
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .left_join(test_data2)
          .where(function($) {
            $.and("right_1.key1").eq.value("a");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false;

          if(result_rows1.length === result_rows2.length) {
            for(var i = 0, l = result_rows1.length; i < l; i = i + 1) {
              compared = true;

              if(!obj_match(result_rows1[i], result_rows2[i])) {
                test_result = false;
                break;
              }
            }
          } else {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from left_join where - 1");

          fulfill();
        });
      });
    })
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .left_join(test_data2, function($) {
          $.and("left.key1").eq.value("b");
          $.and("right_1.key1").eq.value("a");
        })
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .left_join(test_data2)
          .where(function($) {
            $.and("right_1.key1").eq.value("a");
            $.and("left.key1").eq.value("b");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false,
              result_rows2_match_count = 0;

          if(result_rows1.length !== 0 && result_rows2.length !== 0) {
            for(var i = 0, l = result_rows1.length; i < l; i = i + 1) {
              compared = true;

              if(
                result_rows1[i].right_1 &&
                obj_match(result_rows1[i], result_rows2[result_rows2_match_count])
              ) {
                result_rows2_match_count++;
              } else if(!result_rows1[i].right_1) {
                // ok
              } else {
                test_result = false;
                break;
              }
            }
          } else {
            test_result = false;
          }
          if(result_rows2_match_count !== result_rows2.length) {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from left_join where - 2");

          fulfill();
        });
      });
    })
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .left_join(test_data2, function($) {
          $.and("left.key1").eq.key("right_1.key1");
          $.and("right_1.key1").eq.value("a");
        })
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .left_join(test_data2)
          .where(function($) {
            $.and("right_1.key1").eq.value("a");
            $.and("left.key1").eq.key("right_1.key1");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false,
              result_rows2_match_count = 0;

          if(result_rows1.length !== 0 && result_rows2.length !== 0) {
            for(var i = 0, l = result_rows1.length; i < l; i = i + 1) {
              compared = true;

              if(
                result_rows1[i].right_1 &&
                obj_match(result_rows1[i], result_rows2[result_rows2_match_count])
              ) {
                result_rows2_match_count++;
              } else if(!result_rows1[i].right_1) {
                // ok
              } else {
                test_result = false;
                break;
              }
            }
          } else {
            test_result = false;
          }
          if(result_rows2_match_count !== result_rows2.length) {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from left_join where - 3");

          fulfill();
        });
      });
    })
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .left_join(test_data2, function($) {
          $.and("key1").eq.key("right_1.key1");
          $.and("right_1.key1").eq.value("a");
        })
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .left_join(test_data2)
          .where(function($) {
            $.and("right_1.key1").eq.value("a");
            $.and("key1").eq.key("right_1.key1");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false;

          if(result_rows1.length !== 0 && result_rows2.length === 0) {
            compared = true;
          } else {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from left_join where - 4");

          fulfill();
        });
      });
    })
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .left_join(test_data2, function($) {
          $.and("test_data2.key1").eq.value("a");
        }).as("test_data2")
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .left_join(test_data2).as("test_data2")
          .where(function($) {
            $.and("test_data2.key1").eq.value("a");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false;

          if(result_rows1.length === result_rows2.length) {
            for(var i = 0, l = result_rows1.length; i < l; i = i + 1) {
              compared = true;

              if(!obj_match(result_rows1[i], result_rows2[i])) {
                test_result = false;
                break;
              }
            }
          } else {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from left_join as where - 1");

          fulfill();
        });
      });
    })
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .left_join(test_data2, function($) {
          $.and("left.key1").eq.value("b");
          $.and("test_data2.key1").eq.value("a");
        }).as("test_data2")
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .left_join(test_data2).as("test_data2")
          .where(function($) {
            $.and("test_data2.key1").eq.value("a");
            $.and("left.key1").eq.value("b");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false,
              result_rows2_match_count = 0;

          if(result_rows1.length !== 0 && result_rows2.length !== 0) {
            for(var i = 0, l = result_rows1.length; i < l; i = i + 1) {
              compared = true;

              if(
                result_rows1[i].test_data2 &&
                obj_match(result_rows1[i], result_rows2[result_rows2_match_count])
              ) {
                result_rows2_match_count++;
              } else if(!result_rows1[i].test_data2) {
                // ok
              } else {
                test_result = false;
                break;
              }
            }
          } else {
            test_result = false;
          }
          if(result_rows2_match_count !== result_rows2.length) {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from left_join as where - 2");

          fulfill();
        });
      });
    })
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .left_join(test_data2, function($) {
          $.and("left.key1").eq.key("test_data2.key1");
          $.and("test_data2.key1").eq.value("a");
        }).as("test_data2")
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .left_join(test_data2).as("test_data2")
          .where(function($) {
            $.and("test_data2.key1").eq.value("a");
            $.and("left.key1").eq.key("test_data2.key1");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false,
              result_rows2_match_count = 0;

          if(result_rows1.length !== 0 && result_rows2.length !== 0) {
            for(var i = 0, l = result_rows1.length; i < l; i = i + 1) {
              compared = true;

              if(
                result_rows1[i].test_data2 &&
                obj_match(result_rows1[i], result_rows2[result_rows2_match_count])
              ) {
                result_rows2_match_count++;
              } else if(!result_rows1[i].test_data2) {
                // ok
              } else {
                test_result = false;
                break;
              }
            }
          } else {
            test_result = false;
          }
          if(result_rows2_match_count !== result_rows2.length) {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from left_join as where - 3");

          fulfill();
        });
      });
    })
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .left_join(test_data2, function($) {
          $.and("key1").eq.key("test_data2.key1");
          $.and("test_data2.key1").eq.value("a");
        }).as("test_data2")
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .left_join(test_data2).as("test_data2")
          .where(function($) {
            $.and("test_data2.key1").eq.value("a");
            $.and("key1").eq.key("test_data2.key1");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false;

          if(result_rows1.length !== 0 && result_rows2.length === 0) {
            compared = true;
          } else {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from left_join as where - 4");

          fulfill();
        });
      });
    })
    .then(function() {
      done();
    });

  });

  it("004_12 - SLII no_idb select from right_join where", function(done) {
    var slii = new SLII("", { mode: "no_idb" });

    (function() {
      return slii
      .select()
      .from(test_data)
      .right_join(test_data2)
      .run(function(rows, ok, ng) {
        //console.log(rows);

        ok();
      });
    }())
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .right_join(test_data2, function($) {
          $.and("right_1.key1").eq.value("a");
        })
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .right_join(test_data2)
          .where(function($) {
            $.and("right_1.key1").eq.value("a");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false,
              result_rows2_match_count = 0;

          if(result_rows1.length !== 0 && result_rows2.length !== 0) {
            for(var i = 0, l = result_rows1.length; i < l; i = i + 1) {
              compared = true;

              if(
                result_rows1[i].left &&
                obj_match(result_rows1[i], result_rows2[result_rows2_match_count])
              ) {
                result_rows2_match_count++;
              } else if(!result_rows1[i].left) {
                // ok
              } else {
                test_result = false;
                break;
              }
            }
          } else {
            test_result = false;
          }
          if(result_rows2_match_count !== result_rows2.length) {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from right_join where - 1");

          fulfill();
        });
      });
    })
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .right_join(test_data2, function($) {
          $.and("left.key1").eq.value("b");
          $.and("right_1.key1").eq.value("a");
        })
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .right_join(test_data2)
          .where(function($) {
            $.and("right_1.key1").eq.value("a");
            $.and("left.key1").eq.value("b");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false,
              result_rows2_match_count = 0;

          if(result_rows1.length !== 0 && result_rows2.length !== 0) {
            for(var i = 0, l = result_rows1.length; i < l; i = i + 1) {
              compared = true;

              if(
                result_rows1[i].left &&
                obj_match(result_rows1[i], result_rows2[result_rows2_match_count])
              ) {
                result_rows2_match_count++;
              } else if(!result_rows1[i].left) {
                // ok
              } else {
                test_result = false;
                break;
              }
            }
          } else {
            test_result = false;
          }
          if(result_rows2_match_count !== result_rows2.length) {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from right_join where - 2");

          fulfill();
        });
      });
    })
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .right_join(test_data2, function($) {
          $.and("left.key1").eq.key("right_1.key1");
          $.and("right_1.key1").eq.value("a");
        })
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .right_join(test_data2)
          .where(function($) {
            $.and("right_1.key1").eq.value("a");
            $.and("left.key1").eq.key("right_1.key1");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false,
              result_rows2_match_count = 0;

          if(result_rows1.length !== 0 && result_rows2.length !== 0) {
            for(var i = 0, l = result_rows1.length; i < l; i = i + 1) {
              compared = true;

              if(
                result_rows1[i].left &&
                obj_match(result_rows1[i], result_rows2[result_rows2_match_count])
              ) {
                result_rows2_match_count++;
              } else if(!result_rows1[i].left) {
                // ok
              } else {
                test_result = false;
                break;
              }
            }
          } else {
            test_result = false;
          }
          if(result_rows2_match_count !== result_rows2.length) {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from right_join where - 3");

          fulfill();
        });
      });
    })
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .right_join(test_data2, function($) {
          $.and("key1").eq.key("right_1.key1");
          $.and("right_1.key1").eq.value("a");
        })
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .right_join(test_data2)
          .where(function($) {
            $.and("right_1.key1").eq.value("a");
            $.and("key1").eq.key("right_1.key1");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false,
              result_rows2_match_count = 0;

          if(result_rows1.length !== 0 && result_rows2.length == 0) {
            compared = true;
          } else {
            test_result = false;
          }
          if(result_rows2_match_count !== result_rows2.length) {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from right_join where - 4");

          fulfill();
        });
      });
    })
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .right_join(test_data2, function($) {
          $.and("test_data2.key1").eq.value("a");
        }).as("test_data2")
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .right_join(test_data2).as("test_data2")
          .where(function($) {
            $.and("test_data2.key1").eq.value("a");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false,
              result_rows2_match_count = 0;

          if(result_rows1.length !== 0 && result_rows2.length !== 0) {
            for(var i = 0, l = result_rows1.length; i < l; i = i + 1) {
              compared = true;

              if(
                result_rows1[i].left &&
                obj_match(result_rows1[i], result_rows2[result_rows2_match_count])
              ) {
                result_rows2_match_count++;
              } else if(!result_rows1[i].left) {
                // ok
              } else {
                test_result = false;
                break;
              }
            }
          } else {
            test_result = false;
          }
          if(result_rows2_match_count !== result_rows2.length) {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from right_join as where - 1");

          fulfill();
        });
      });
    })
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .right_join(test_data2, function($) {
          $.and("left.key1").eq.value("b");
          $.and("test_data2.key1").eq.value("a");
        }).as("test_data2")
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .right_join(test_data2).as("test_data2")
          .where(function($) {
            $.and("test_data2.key1").eq.value("a");
            $.and("left.key1").eq.value("b");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false,
              result_rows2_match_count = 0;

          if(result_rows1.length !== 0 && result_rows2.length !== 0) {
            for(var i = 0, l = result_rows1.length; i < l; i = i + 1) {
              compared = true;

              if(
                result_rows1[i].test_data2 &&
                obj_match(result_rows1[i], result_rows2[result_rows2_match_count])
              ) {
                result_rows2_match_count++;
              } else if(!result_rows1[i].right_1) {
                // ok
              } else {
                test_result = false;
                break;
              }
            }
          } else {
            test_result = false;
          }
          if(result_rows2_match_count !== result_rows2.length) {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from right_join as where - 2");

          fulfill();
        });
      });
    })
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .right_join(test_data2, function($) {
          $.and("left.key1").eq.key("test_data2.key1");
          $.and("test_data2.key1").eq.value("a");
        }).as("test_data2")
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .right_join(test_data2).as("test_data2")
          .where(function($) {
            $.and("test_data2.key1").eq.value("a");
            $.and("left.key1").eq.key("test_data2.key1");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false,
              result_rows2_match_count = 0;

          if(result_rows1.length !== 0 && result_rows2.length !== 0) {
            for(var i = 0, l = result_rows1.length; i < l; i = i + 1) {
              compared = true;

              if(
                result_rows1[i].test_data2 &&
                obj_match(result_rows1[i], result_rows2[result_rows2_match_count])
              ) {
                result_rows2_match_count++;
              } else if(!result_rows1[i].right_1) {
                // ok
              } else {
                test_result = false;
                break;
              }
            }
          } else {
            test_result = false;
          }
          if(result_rows2_match_count !== result_rows2.length) {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from right_join as where - 3");

          fulfill();
        });
      });
    })
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .right_join(test_data2, function($) {
          $.and("key1").eq.key("test_data2.key1");
          $.and("test_data2.key1").eq.value("a");
        }).as("test_data2")
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .right_join(test_data2).as("test_data2")
          .where(function($) {
            $.and("test_data2.key1").eq.value("a");
            $.and("key1").eq.key("test_data2.key1");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false;

          if(result_rows1.length !== 0 && result_rows2.length === 0) {
            compared = true;
          } else {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from right_join as where - 4");

          fulfill();
        });
      });
    })
    .then(function() {
      done();
    });

  });

  it("004_13 - SLII no_idb select from where (no_alias)", function(done) {
    var slii = new SLII("", { mode: "no_idb" });

    (function() {
      return slii
      .select(function($, _) {
        $(_.key1);
        $(_.key2 + 1000).as("calc");
      })
      .from(test_data).as("test_data")
      .where(function($) {
        $.and("test_data.key1").eq.value("e");
        $.and("calc").lt.value(1100);
      })
      .run(function(rows, ok, ng) {
        var test_result = true,
            compared = false;

        for(var i = 0, l = rows.length; i < l; i = i + 1) {
          compared = true;

          if(rows.calc >= 1100) {
            test_result = false;
            break;
          }
        }

        expect(test_result && compared).toEqual(true, "select from (no_alias) - 1");

        ok();
      })
    }())
    .then(function() {
      return slii
      .select(function($, _) {
        $(_.test_data1.key1);
        $(_.test_data1.key2 + _.test_data2.key2).as("sum");
      })
      .from(test_data).as("test_data1")
      .join(test_data2).as("test_data2")
      .where(function($) {
        $.and("test_data1.key1").eq.key("test_data2.key1")
        $.and("test_data1.key1").eq.value("e");
        $.and("sum").gt.value(100);
      })
      .run(function(rows, ok, ng) {
        var test_result = true,
            compared = false;

        for(var i = 0, l = rows.length; i < l; i = i + 1) {
          compared = true;

          if(rows.calc <= 100) {
            test_result = false;
            break;
          }
        }

        expect(test_result && compared).toEqual(true, "select from join where (no_alias) - 1");

        ok();
      });
    })
    .then(function() {
      done();
    });
  });

  it("004_20 - SLII no_idb select from join join where", function(done) {
    var slii = new SLII("", { mode: "no_idb" });

    (function() {
      var result_rows1 = [],
          result_rows2 = [],
          result_rows3 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .join(test_data2, function($) {
          $.and("left.key1").eq.key("right_1.key1");
          $.and("right_1.key1").eq.value("c");
        })
        .join(test_data3, function($) {
          $.and("left.key1").eq.key("right_2.key1");
          $.and("right_2.key1").eq.value("c");
        })
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .join(test_data2, function($) {
            $.and("left.key1").eq.key("right_1.key1");
          })
          .join(test_data3, function($) {
            $.and("right_2.key1").eq.value("c");
          })
          .where(function($) {
            $.and("right_1.key1").eq.value("c");
            $.and("left.key1").eq.key("right_2.key1");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .join(test_data2)
          .join(test_data3)
          .where(function($) {
            $.and("right_1.key1").eq.value("c");
            $.and("right_2.key1").eq.value("c");
            $.and("left.key1").eq.key("right_1.key1");
            $.and("left.key1").eq.key("right_2.key1");
          })
          .run(function(rows, ok, ng) {
            result_rows3 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false;

          if(result_rows1.length === result_rows2.length && result_rows1.length === result_rows3.length) {
            for(var i = 0, l = result_rows1.length; i < l; i = i + 1) {
              compared = true;

              if(!obj_match(result_rows1[i], result_rows2[i]) || !obj_match(result_rows1[i], result_rows3[i])) {
                test_result = false;
                break;
              }
            }
          } else {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from join join where - 1");

          fulfill();
        });
      });

    }())
    .then(function() {
      var result_rows1 = [],
          result_rows2 = [],
          result_rows3 = [];

      return new Promise(function(fulfill, reject) {
        slii
        .select()
        .from(test_data)
        .join(test_data2, function($) {
          $.and("left.key1").eq.key("test_data2.key1");
          $.and("test_data2.key1").eq.value("c");
        }).as("test_data2")
        .join(test_data3, function($) {
          $.and("left.key1").eq.key("test_data3.key1");
          $.and("test_data3.key1").eq.value("c");
        }).as("test_data3")
        .run(function(rows, ok, ng) {
          result_rows1 = rows;

          ok();
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .join(test_data2, function($) {
            $.and("left.key1").eq.key("test_data2.key1");
          }).as("test_data2")
          .join(test_data3, function($) {
            $.and("test_data3.key1").eq.value("c");
          }).as("test_data3")
          .where(function($) {
            $.and("test_data2.key1").eq.value("c");
            $.and("left.key1").eq.key("test_data3.key1");
          })
          .run(function(rows, ok, ng) {
            result_rows2 = rows;

            ok();
          });
        })
        .then(function() {
          return slii
          .select()
          .from(test_data)
          .join(test_data2).as("test_data2")
          .join(test_data3).as("test_data3")
          .where(function($) {
            $.and("test_data2.key1").eq.value("c");
            $.and("test_data3.key1").eq.value("c");
            $.and("left.key1").eq.key("test_data2.key1");
            $.and("left.key1").eq.key("test_data3.key1");
          })
          .run(function(rows, ok, ng) {
            result_rows3 = rows;

            ok();
          });
        })
        .then(function() {
          var test_result = true,
              compared = false;

          if(result_rows1.length === result_rows2.length && result_rows1.length === result_rows3.length) {
            for(var i = 0, l = result_rows1.length; i < l; i = i + 1) {
              compared = true;

              if(!obj_match(result_rows1[i], result_rows2[i]) || !obj_match(result_rows1[i], result_rows3[i])) {
                test_result = false;
                break;
              }
            }
          } else {
            test_result = false;
          }

          expect(test_result && compared).toEqual(true, "select from join as join as where - 1");

          fulfill();
        });
      });
    })
    .then(function() {
      done();
    });
  });

  it("005 - SLII no_idb select from group_by", function(done) {
    var test_result_data = [];
    for(var i = 0, l = test_data.length; i < l; i = i + 1) {
      var match = false;
      for(var j = 0, l2 = test_result_data.length; j < l2; j = j + 1) {
        if(test_data[i].key1 === test_result_data[j].key1) {
          match = true;
          break;
        }
      }

      if(match) {
        test_result_data.splice(j, 1, test_data[i]);
      } else {
        test_result_data[test_result_data.length] = test_data[i];
      }
    }

    var slii = new SLII("", { mode: "no_idb" });

    slii
    .select()
    .from(test_data)
    .group_by("key1")
    .run(function(rows) {
      var test_result = true,
          compared = false;

      for(var i = 0, l = rows.length; i < l; i = i + 1) {
        compared = true;

        if(!obj_match(rows[i], test_result_data[i])) {
          test_result = false;
          break;
        }
      }

      expect(true).toEqual(test_result && compared);

      done();
    });

  });

  it("006 - SLII no_idb seleft from group_by having", function(done) {
    var tmp = [],
        test_result_data = [];
    for(var i = 0, l = test_data.length; i < l; i = i + 1) {
      var match = false;
      for(var j = 0, l2 = tmp.length; j < l2; j = j + 1) {
        if(test_data[i].key1 === tmp[j].key1) {
          match = true;
          break;
        }
      }

      if(match) {
        tmp.splice(j, 1, test_data[i]);
      } else {
        tmp[tmp.length] = test_data[i];
      }
    }
    for(var i = 0, l = tmp.length; i < l; i = i + 1) {
      if(tmp[i].key3 > 100) {
        test_result_data[test_result_data.length] = tmp[i];
      }
    }

    var slii = new SLII("", { mode: "no_idb" });

    slii
    .select()
    .from(test_data)
    .group_by("key1")
    .having(function($) {
      $.and("key3").gt.value(100);
    })
    .run(function(rows) {
      var test_result = true,
          compared = false;

      for(var i = 0, l = rows.length; i < l; i = i + 1) {
        compared = true;

        if(!obj_match(rows[i], test_result_data[i])) {
          test_result = false;
          break;
        }
      }

      expect(true).toEqual(test_result && compared);

      done();
    });

  });

  it("007 - SLII no_idb select from order_by", function(done) {
    var test_result_data = [];
    test_result_data = test_data.sort(function(a, b) { return a.key2 > b.key2; })

    var slii = new SLII("", { mode: "no_idb" });

    slii
    .select()
    .from(test_data)
    .order_by("key2")
    .run(function(rows) {
      var test_result = true,
          compared = false;

      for(var i = 0, l = rows.length; i < l; i = i + 1) {
        compared = true;

        if(!obj_match(rows[i], test_result_data[i])) {
          test_result = false;
          break;
        }
      }

      expect(true).toEqual(test_result && compared);

      done();
    });

  });

  it("008 - SLII no_idb select from group_by having order_by", function(done) {
    var tmp = [],
        test_result_data = [];
    for(var i = 0, l = test_data.length; i < l; i = i + 1) {
      var match = false;
      for(var j = 0, l2 = tmp.length; j < l2; j = j + 1) {
        if(test_data[i].key1 === tmp[j].key1) {
          match = true;
          break;
        }
      }

      if(match) {
        tmp.splice(j, 1, test_data[i]);
      } else {
        tmp[tmp.length] = test_data[i];
      }
    }
    for(var i = 0, l = tmp.length; i < l; i = i + 1) {
      if(tmp[i].key3 > 100) {
        test_result_data[test_result_data.length] = tmp[i];
      }
    }
    test_result_data = test_result_data.sort(function(a, b) { return a.key3 < b.key3; });

    var slii = new SLII("", { mode: "no_idb" });

    slii
    .select()
    .from(test_data)
    .group_by("key1")
    .having(function($) {
      $.and("key3").gt.value(100);
    })
    .order_by({ "key3": "asc" })
    .run(function(rows) {
      var test_result = true,
          compared = false;

      for(var i = 0, l = rows.length; i < l; i = i + 1) {
        compared = true;

        if(!obj_match(rows[i], test_result_data[i])) {
          test_result = false;
          break;
        }
      }

      expect(true).toEqual(test_result && compared);

      done();
    });

  });

  it("009 - SLII no_idb seleft from limit", function(done) {
    var test_result_data = [];
    for(var i = 0, l = 5; i < l; i = i + 1) {
      test_result_data[test_result_data.length] = test_data[i];
    }

    var slii = new SLII("", { mode: "no_idb" });

    slii
    .select()
    .from(test_data)
    .limit(5)
    .run(function(rows) {
      var test_result = true,
          compared = false;

      for(var i = 0, l = rows.length; i < l; i = i + 1) {
        compared = true;

        if(!obj_match(rows[i], test_result_data[i])) {
          test_result = false;
          break;
        }
      }

      expect(true).toEqual(test_result && compared);

      done();
    });

  });

  it("010 - SLII no_idb select from limit offset (1)", function(done) {
    var test_result_data = [];
    for(var i = 2, l = 7; i < l; i = i + 1) {
      test_result_data[test_result_data.length] = test_data[i];
    }

    var slii = new SLII("", { mode: "no_idb" });

    slii
    .select()
    .from(test_data)
    .limit(2, 5)
    .run(function(rows) {
      var test_result = true,
          compared = false;

      for(var i = 0, l = rows.length; i < l; i = i + 1) {
        compared = true;

        if(!obj_match(rows[i], test_result_data[i])) {
          test_result = false;
          break;
        }
      }

      expect(true).toEqual(test_result && compared);

      done();
    });

  });

  it("011 - SLII no_idb select from limit offset (2)", function(done) {
    var test_result_data = [];
    for(var i = 1, l = 6; i < l; i = i + 1) {
      test_result_data[test_result_data.length] = test_data[i];
    }

    var slii = new SLII("", { mode: "no_idb" });

    slii
    .select()
    .from(test_data)
    .limit(5)
    .offset(1)
    .run(function(rows) {
      var test_result = true,
          compared = false;

      for(var i = 0, l = rows.length; i < l; i = i + 1) {
        compared = true;

        if(!obj_match(rows[i], test_result_data[i])) {
          test_result = false;
          break;
        }
      }

      expect(true).toEqual(test_result && compared);

      done();
    });

  });

  it("012 - SLII no_idb select from union select from", function(done) {
    var test_union_data = [];
    for(var i = 0, l = test_data.length; i < l; i = i + 1) {
      test_union_data[test_union_data.length] = test_data[i];
    }
    test_union_data[test_union_data.length] = test_data[0];
    test_union_data[test_union_data.length] = { key1: "x", key2: 1000, key3: 200 };
    test_union_data[test_union_data.length] = test_data[2];
    test_union_data[test_union_data.length] = test_data[3];
    test_union_data[test_union_data.length] = { key1: "x", key2: 1000, key3: 200 };
    test_union_data[test_union_data.length] = { key1: "y", key2: 1100, key3: 210 };

    var test_union_result_data = [];
    for(var i = 0, l = test_data.length; i < l; i = i + 1) {
      test_union_result_data[test_union_result_data.length] = test_data[i];
    }
    test_union_result_data[test_union_result_data.length] = { key1: "x", key2: 1000, key3: 200 };
    test_union_result_data[test_union_result_data.length] = { key1: "y", key2: 1100, key3: 210 };

    var slii = new SLII("", { mode: "no_idb" });

    slii
    .select()
    .from(test_data)
    .union()
    .select()
    .from(test_union_data)
    .run(function(rows) {
      var test_result = true,
          compared = false;

      for(var i = 0, l = rows.length; i < l; i = i + 1) {
        compared = true;

        if(!obj_match(rows[i], test_union_result_data[i])) {
          test_result = false;
          break;
        }
      }

      expect(true).toEqual(test_result && compared);

      done();
    });

  });

  it("013 - SLII no_idb select from union_all select from", function(done) {
    var test_union_all_data = [];
    for(var i = 0, l = test_data.length; i < l; i = i + 1) {
      test_union_all_data[test_union_all_data.length] = test_data[i];
    }
    for(var i = 0, l = test_data.length; i < l; i = i + 1) {
      test_union_all_data[test_union_all_data.length] = test_data[i];
    }

    var slii = new SLII("", { mode: "no_idb" });

    slii
      .select()
      .from(test_data)
      .union_all()
      .select()
      .from(test_data)
      .run(function(rows) {
        var test_result= true,
            compared = false;

        for(var i = 0, l = rows.length; i < l; i = i + 1) {
          compared = true;

          if(!obj_match(rows[i], test_union_all_data[i])) {
            test_result = false;
            break;
          }
        }

        expect(true).toEqual(test_result && compared);

        done();
      });

  });

  it("100 - SLII no_idb deleteDatabase", function(done) {
    var slii = new SLII("", { mode: "no_idb" });

    slii.deleteDatabase("test")
    .then(function() {
      expect(1).toEqual(0);
      done();
    })
    .catch(function(err) {
      console.log(err);
      expect(1).toEqual(1);
      done();
    });

  });

  it("101 - SLII no_idb open", function(done) {
    var slii = new SLII("", { mode: "no_idb" });

    slii.open()
    .then(function() {
      expect(1).toEqual(0);
      done();
    })
    .catch(function(err) {
      console.log(err);
      expect(1).toEqual(1);
      done();
    });

  });

  it("102 - SLII no_idb getNewVersion", function(done) {
    var slii = new SLII("", { mode: "no_idb" });

    try {
      slii.getNewVersion();

      expect(1).toEqual(0);
      done();

    } catch(e) {
      console.log(e);
      expect(1).toEqual(1);
      done();
    }

  });

  it("103 - SLII no_idb createTable", function(done) {
    var slii = new SLII("", { mode: "no_idb" });

    try {
      slii.createTable("table1")
      .run();

      expect(1).toEqual(0);
      done();

    } catch(e) {
      console.log(e);
      expect(1).toEqual(1);
      done();
    }

  });

  it("104 - SLII no_idb dropTable", function(done) {
    var slii = new SLII("", { mode: "no_idb" });

    try {
      slii.dropTable("table1")
      .run();

      expect(1).toEqual(0);
      done();

    } catch(e) {
      console.log(e);
      expect(1).toEqual(1);
      done();
    }

  });

  it("105 - SLII no_idb createIndex", function(done) {
    var slii = new SLII("", { mode: "no_idb" });

    try {
      slii.createIndex("table1", "idx1", {})
      .run();

      expect(1).toEqual(0);
      done();

    } catch(e) {
      console.log(e);
      expect(1).toEqual(1);
      done();
    }

  });

  it("106 - SLII no_idb dropIndex", function(done) {
    var slii = new SLII("", { mode: "no_idb" });

    try {
      slii.dropIndex("table1", "idx1")
      .run();

      expect(1).toEqual(0);
      done();

    } catch(e) {
      console.log(e);
      expect(1).toEqual(1);
      done();
    }

  });

  it("107 - SLII no_idb beginTransaction", function(done) {
    var slii = new SLII("", { mode: "no_idb" });

    slii.beginTransaction("table1", "readwrite", function() {
      console.log("start transaction");
    })
    .then(function() {
      expect(1).toEqual(0);
      done();
    })
    .catch(function(err) {
      console.log(err);
      expect(1).toEqual(1);
      done();
    });

  });

  it("108 - SLII no_idb upgrade", function(done) {
    var slii = new SLII("", { mode: "no_idb" });

    slii.upgrade(function(db, tra) {
      console.log("start upgrading");
    })
    .then(function() {
      expect(1).toEqual(0);
      done();
    })
    .catch(function(err) {
      console.log(err);
      expect(1).toEqual(1);
      done();
    });

  });

  it("109 - SLII no_idb insert_into", function(done) {
    var slii = new SLII("", { mode: "no_idb" });

    try {
      slii.insert_into("table1");

      expect(1).toEqual(0);
      done();

    } catch(e) {
      console.log(e);
      expect(1).toEqual(1);
      done();
    }
  });

  it("110 - SLII no_idb delete_from", function(done) {
    var slii = new SLII("", { mode: "no_idb" });

    try {
      slii.delete_from("table1");

      expect(1).toEqual(0);
      done();

    } catch(e) {
      console.log(e);
      expect(1).toEqual(1);
      done();
    }
  });

  it("111 - SLII no_idb update", function(done) {
    var slii = new SLII("", { mode: "no_idb" });

    try {
      slii.update("table1");

      expect(1).toEqual(0);
      done();
    } catch(e) {
      console.log(e);
      expect(1).toEqual(1);
      done();
    }
  });

  it("112 - SLII no_idb rollback", function(done) {
    var slii = new SLII("", { mode: "no_idb" });

    try {
      slii.rollback();

      expect(1).toEqual(0);
      done();
    } catch(e) {
      console.log(e);
      expect(1).toEqual(1);
      done();
    }
  });

});
