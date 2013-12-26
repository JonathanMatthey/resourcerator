objectId = require('mongodb').ObjectID;
var red, blue, reset;
red = '\u001b[31m';
blue = '\u001b[34m';
reset = '\u001b[0m';
console.log(red + 'This is red 2 ' + reset + ' while ' + blue + ' this is blue 2 ' + reset);

var LIMIT = 10;
var SKIP = 0;

exports.add = function(req, res, next) {
  if (req.body) {
    req.db.Project.create({
      title: req.body.title,
      text: req.body.text || null,
      url: req.body.url || null,
      author: {
        id: req.session.user._id,
        name: req.session.user.displayName
      }
    }, function(err, docs) {
      if (err) {
        console.error(err);
        next(err);
      } else {
        res.json(200, docs);
      }

    });
  } else {
    next(new Error('No data'));
  }
};

exports.getProjects = function(req, res, next) {
  var limit = req.query.limit || LIMIT;
  var skip = req.query.skip || SKIP;
  req.db.Project.find({}, null, {
    limit: limit,
    skip: skip,
    sort: {
      '_id': -1
    }
  }, function(err, obj) {
    if (!obj) next('There are not projects.');
    obj.forEach(function(item, i, list) {
      if (req.session.user.admin) {
        item.admin = true;
      } else {
        item.admin = false;
      }
      if (item.author.id == req.session.userId) {
        item.own = true;
      } else {
        item.own = false;
      }
      if (item.likes && item.likes.indexOf(req.session.userId) > -1) {
        item.like = true;
      } else {
        item.like = false;
      }
      if (item.watches && item.watches.indexOf(req.session.userId) > -1) {
        item.watch = true;
      } else {
        item.watch = false;
      }
    });
    var body = {};
    body.limit = limit;
    body.skip = skip;
    body.projects = obj;
    req.db.Project.count({}, function(err, total) {
      if (err) next(err);
      body.total = total;
      res.json(200, body);
    });
  });
};


exports.getProject = function(req, res, next) {
  if (req.params.id) {
    req.db.Project.findById(req.params.id, {
      title: true,
      text: true,
      url: true,
      author: true,
      comments: true,
      watches: true,
      likes: true
    }, function(err, obj) {
      if (err) next(err);
      if (!obj) {
        next('Nothing is found.');
      } else {
        res.json(200, obj);
      }
    });
  } else {
    next('No project id');
  }
};

exports.del = function(req, res, next) {
  req.db.Project.findById(req.params.id, function(err, obj) {
    if (err) next(err);
    if (req.session.admin || req.session.userId === obj.author.id) {
      obj.remove();
      res.json(200, obj);
    } else {
      next('User is not authorized to delete project.');
    }
  })
};

function watchProject(req, res, next) {
  req.db.Project.findByIdAndUpdate(req.body._id, {
    $push: {
      watches: req.session.userId
    }
  }, {}, function(err, obj) {
    if (err) next(err);
    else {
      res.json(200, obj);
    }
  });
};

exports.updateProject = function(req, res, next) {
  var anyAction = false;
  if (req.body._id && req.params.id) {
    if (req.body && req.body.action == 'like') {
      anyAction = true;
      likeProject(req, res);
    }
    if (req.body && req.body.action == 'watch') {
      anyAction = true;
      watchProject(req, res);
    }
    if (req.body && req.body.action == 'comment' && req.body.comment && req.params.id) {
      anyAction = true;
      req.db.Project.findByIdAndUpdate(req.params.id, {
        $push: {
          comments: {
            author: {
              id: req.session.userId,
              name: req.session.user.displayName
            },
            text: req.body.comment
          }
        }
      }, {
        safe: true,
        new: true
      }, function(err, obj) {
        if (err) throw err;
        res.json(200, obj);
      });
    }
    if (req.body && req.body.action == 'splitAllocation' && req.params.id) {
      anyAction = true;
      req.db.Project.findByIdAndUpdate(req.params.id, {
        $pull: {
          allocations: {_id:req.body.allocationId}
        }
      }, {
        safe: true,
      }, function(err, obj) {
        if (err) throw err;
        console.log(obj);
        req.db.Project.findByIdAndUpdate(req.params.id, {
          $push: {
            allocations: {
              user: {
                id: req.body.allocation.userId,
                name: req.body.allocation.displayName
              },
              capacity: 50,
              timeLeft: 10
            }
          }
        }, {
          safe: true,
          new: true
        }, function(err, obj) {
          if (err) throw err;
          req.db.Project.findByIdAndUpdate(req.params.id, {
            $push: {
              allocations: {
                user: {
                  id: req.body.allocation.userId,
                  name: req.body.allocation.displayName
                },
                capacity: 50,
                timeLeft: 10
              }
            }
          }, {
            safe: true,
            new: true
          }, function(err, obj) {
            if (err) throw err;
            res.json(200, obj);
          });
        });
      });
    }
    if (req.body && req.body.action == 'allocate' && req.params.id) {
      anyAction = true;
      req.db.Project.findByIdAndUpdate(req.params.id, {
        $push: {
          allocations: {
            user: {
              id: req.body.allocation.userId,
              name: req.body.allocation.displayName
            },
            capacity: 100,
            timeLeft: 10
          }
        }
      }, {
        safe: true,
        new: true
      }, function(err, obj) {
        if (err) throw err;
        res.json(200, obj);
      });
    }
    if (req.body && req.body.action == 'deallocate' && req.params.id) {
      anyAction = true;
      req.db.Project.findByIdAndUpdate(req.params.id, {
        $pull: {
          allocations: {_id:req.body.allocationId}
        }
      }, {
        safe: true,
      }, function(err, obj) {
        if (err) throw err;
        res.json(200, obj);
      });
    }
    if (req.session.auth && req.session.userId && req.body && req.body.action != 'comment' &&
      req.body.action != 'watch' && req.body != 'like' &&
      req.params.id && (req.body.author.id == req.session.user._id || req.session.user.admin)) {
      req.db.Project.findById(req.params.id, function(err, doc) {
        if (err) next(err);
        doc.title = req.body.title;
        doc.text = req.body.text || null;
        doc.url = req.body.url || null;
        doc.save(function(e, d) {
          if (e) next(e);
          res.json(200, d);
        });
      })
    } else {
      if (!anyAction) next('Something went wrong.');
    }

  } else {
    next('No project ID.');
  }
};