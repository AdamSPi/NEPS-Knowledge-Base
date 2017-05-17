// Inits --------------------------------------------------------------------------------------------------------------
// Dependecies

/* jshint node: true */
'use strict';

var express = require('express');
var helpers = require('express-helpers');
var async = require('async');
var levenSort = require('leven-sort');
var socket = require('socket.io');
var formidable = require('formidable');

var http = require('http');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

// sqlite database init
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db.sqlite');

var app = express();
helpers(app);

var server = http.createServer(app);
var io = socket.listen(server);

// EJS inits
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));

// start server
var port = process.env.PORT || 5000;
server.listen(port, function() {
    console.log("Listening on " + port);
});

// Hooks --------------------------------------------------------------------------------------------------------------

// https://www.npmjs.com/package/cookies
// authenicate user's cookies
app.get('/user/authenticate', function(request, response) {

});

app.get('/login', function(request, response) {

});

//---------------------------------------------------------------------------------------------------------------------

// Socket.IO code

io.on('connection', function(socket) {

    // Article Socket -----------------------------------------------------------------
    socket.on('send', function(data) {

        // No tags
        if (data[6].value === "") {
            db.run("INSERT INTO Articles (Title, Symptoms, Summary, Created, Content, Delta, Customer, Current) " +
                "VALUES(?,?,?,datetime('now'),?, ?, ?, 1)",
            [
                data[0].value, // title field
                data[1].value, // symptoms field
                ( data[2].value || 'n/a' ), // summary field
                data[3].value, // content field
                data[4].value, // delta field
                data[5].value, // customer field
            ], function(err, result) {
                if (err) {
                    throw err.stack;
                }
                // get the article just inserted
                db.all('SELECT * FROM Articles ORDER BY datetime(Created) DESC LIMIT 1;', function(err, result) {
                    if (err) {
                        throw err.stack;
                    } else {
                        // emit to all other clients
                        socket.broadcast.emit('receieved', result[0]);
                    }

                });
            });
        }
        else {
            // split tag field
            let tagRes = data[6].value.substr(0, data[6].value.length - 1); // remove last ; at end
            let tagField = tagRes.split(';');
            // insert into database
            db.run("INSERT INTO Articles (Title, Symptoms, Summary, Created, Content, Delta, Tags, Customer, Current) " +
                "VALUES(?,?,?,datetime('now'),?, ?, ?, ?, 1)",
            [
                data[0].value, // title field
                data[1].value, // symptoms field
                ( data[2].value || 'n/a' ), // summary field
                data[3].value, // content field
                data[4].value, // delta field
                tagRes,        // tag field
                data[5].value  //customer field
            ], function(err, result) {
                if (err) {
                    throw err.stack;
                }
                tagField.forEach((tag) => {
                    if(tag.trim()){
                      db.run("INSERT INTO Tag (Text, Created,Frequency) " +
                          "VALUES(?,datetime('now'),'0')",
                      [tag.trim()], function(err, result) {
                          // Tag already exists, increment freq.
                          if (err) {
                            db.run("UPDATE Tag SET Frequency= Frequency + 1 WHERE Text=?", [tag.trim()],
                            function(error, res) {
                                if (error) {
                                    throw error.stack;
                                }
                            });
                          }
                      });
                    }
                });
                // get the article just inserted
                db.all('SELECT * FROM Articles ORDER BY datetime(Created) DESC LIMIT 1;', function(err, result) {
                    if (err) {
                        throw err.stack;
                    } else {

                        // emit to all other clients
                        socket.broadcast.emit('receieved', result[0]);
                    }

                });
            });
        }

    });

    // REVISION SOCKET ---------------------------------------------------------------

    socket.on('update', function(data) {
        // Make new article
        if (data[7].value === "") {

          db.run('UPDATE Articles SET EditedOn = datetime("now") WHERE ID=?', [data[5].value], function(er, res) {
              if (er) {
                  throw er.stack;
              }
          });

          // insert into database
          db.run("INSERT INTO Articles (Title, Symptoms, Summary, Content, Delta, Customer, Modified, Created, Current) " +
              "VALUES(?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), 1)",
          [
              data[0].value, // title field
              data[1].value, // symptoms field
              ( data[2].value || 'n/a' ), // summary field
              data[3].value, // content field
              data[4].value, // delta field
              data[6].value, // customer field
          ], function(err, result) {
              if (err) {
                  throw err.stack;
              }

      // get the article just inserted
      db.all('SELECT * FROM Articles ORDER BY datetime(Modified) DESC LIMIT 1;', function(err, result) {
          if (err) {
              throw err.stack;
          } else {
              // Update all previously revised articles with new ID including the one just revised
              db.all("UPDATE Articles SET Revision=?, Modified = datetime('now'), Current=0 WHERE Revision=? OR ID=?", [
                  result[0].ID, // new ID
                  data[5].value, // old ID
                  data[5].value
              ], function(err, res) {
                  // emit to original client
                  db.run('UPDATE Articles SET Created=(SELECT Created FROM Articles WHERE ID = ?) WHERE ID = ?', [
                      data[5].value, result[0].ID
                  ], (er) => {
                      if (er) {
                          throw er.stack;
                      }
                  });
                  db.run('UPDATE Attachments SET Article=? WHERE Article = ?', [
                      result[0].ID, data[5].value
                  ], (er) => {
                      if (er) {
                          throw er.stack;
                      }
                  });
              });
          }
      });
          });

        }
        else {
          // split tag field
          let tagRes = data[7].value.substr(0, data[7].value.length-1); // remove last ; at end
          let tagField = tagRes.split(';');

          db.run('UPDATE Articles SET EditedOn = datetime("now") WHERE ID=?', [data[5].value], function(er, res) {
              if (er) {
                  throw er.stack;
              }
          });

          // insert into database
          db.run("INSERT INTO Articles (Title, Symptoms, Summary, Content, Delta, Customer, Tags, Modified, Created, Current) " +
              "VALUES(?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), 1)",
          [
              data[0].value, // title field
              data[1].value, // symptoms field
              ( data[2].value || 'n/a' ), // summary field
              data[3].value, // content field
              data[4].value, // delta field
              data[6].value, // customer field
              tagRes,        // tag field
          ], function(err, result) {
              if (err) {
                  throw err.stack;
              }
              tagField.forEach((tag) => {
                if(tag.trim()){
                  db.run("INSERT INTO Tag (Text, Created,Frequency) " +
                      "VALUES(?,datetime('now'),'0')",
                  [tag.trim()], function(err, result) {
                      // Tag already exists, increment freq.
                      if (err) {
                          db.run("UPDATE Tag SET Frequency= Frequency + 1 WHERE Text=?", [tag.trim()], function(error, res) {
                              if (error) {
                                  throw error.stack;
                              }
                          });
                      }
                  });
                }
              });
              // get the article just inserted
              db.all('SELECT * FROM Articles ORDER BY datetime(Modified) DESC LIMIT 1;', function(err, result) {
                  if (err) {
                      throw err.stack;
                  } else {
                      // Update all previously revised articles with new ID including the one just revised
                      db.all("UPDATE Articles SET Revision=?, Modified = datetime('now'), Current=0 WHERE Revision=? OR ID=?", [
                          result[0].ID, // new ID
                          data[5].value, // old ID
                          data[5].value
                      ], function(err, res) {
                          // emit to original client
                          db.run('UPDATE Articles SET Created=(SELECT Created FROM Articles WHERE ID = ?) WHERE ID = ?', [
                              data[5].value, result[0].ID
                          ], (er) => {
                              if (er) {
                                  throw er.stack;
                              }
                          });
                          db.run('UPDATE Attachments SET Article=? WHERE Article = ?', [
                              result[0].ID, data[5].value
                          ], (er) => {
                              if (er) {
                                  throw er.stack;
                              }
                          });
                      });
                  }
              });
          });
        }

    });

    // COMMENT SOCKET ----------------------------------------------------------------
    socket.on('comment', function(data) {
        console.log(data);
    });
});

//HTTP Request Handlers -----------------------------------------------------------------------------------------------

// home page
app.get('/', function(request, response) {
    let array = [];
    let customerResult = [];

    db.all("SELECT Title, ID, Customer, Tags, Current, strftime('%m/%d/%Y %H:%M',Created) Time, strftime('%m/%d/%Y %H:%M',Modified) Updated FROM Articles WHERE " +
        "(julianday('now') - julianday(Created)) <= 30 AND Current=1 ORDER BY Created DESC LIMIT 30;",
    function(err, result) {
        if (err) {
            throw err.stack;
        } else {
            array = result;
        }
    });

    db.all("SELECT ID, Name FROM Customer", function(err, result) {
        if (err) {
            throw err.stack;
        } else {
            customerResult = result;
        }
    });

    db.all("SELECT * FROM Tag ORDER BY Frequency DESC LIMIT 5", function(err, tagsResult) {
        if (err) {
            throw err.stack;
        } else {
            response.render('Articles.html', {
                data: array,
                tagdata: tagsResult,
                customerdata: customerResult
            });
        }
    });
});

// get for an article
app.get('/articles/:title', function(request, response) {
    db.all('SELECT *,  strftime("%m/%d/%Y %H:%M",Created) Time, strftime("%m/%d/%Y %H:%M",Modified) Updated FROM Articles WHERE ID=?', request.query.id, function renderArticle(err, result) {
        if (err) {
            throw err.stack;
        }
        db.all("SELECT ID, Name FROM Customer WHERE ID = ?", result[0].Customer, function(err, res) {
            if (err) {
                throw err.stack;
            }
            response.render('ArticleLayout.html', {
                data: result,
                customerdata: res
            });
        });
    });
});

// get for an article's attachments
app.post('/attachments', function(request, response) {
    db.all('SELECT Name, ID, strftime("%m/%d/%Y %H:%M",Created) Time FROM Attachments WHERE Article = ?', request.query.origin, function(err, result) {
        if (err) {
            throw err.stack;
        }
        response.send(result);
    });
});

// get all of an articles past versions
app.post('/revisions', function(request, response) {
    db.all('SELECT ID, Revision, Title, strftime("%m/%d/%Y %H:%M",EditedOn) Time FROM Articles WHERE Revision = ?', request.query.origin, function(err, result) {
        if (err) {
            throw err.stack;
        }
        response.send(result);
    });
});

// get for an article's updated version
app.post('/update', function(request, response) {
    db.all('SELECT * FROM Articles WHERE ID = ?', request.query.origin, function(err, result) {
        if (err) {
            throw err.stack;
        }
        db.all('SELECT *, strftime("%m/%d/%Y %H:%M",Modified) Time FROM Articles WHERE ID = ?',
        result[0].Revision, function(err, res){
            response.send(res);
        });
    });
});

// get for outdated article
app.get('/prev/:title', function(request, response) {
    db.all('SELECT *, strftime("%m/%d/%Y %H:%M",Created) Time, strftime("%m/%d/%Y %H:%M",Modified) Updated FROM Articles WHERE ID=?', request.query.id, function renderArticle(err, result) {
        if (err) {
            throw err.stack;
        }
        db.all("SELECT ID, Name FROM Customer WHERE ID = ?", result[0].Customer, function(err, res) {
            if (err) {
                throw err.stack;
            }
            response.render('ArticleRevisionLayout.html', {
                data: result,
                customerdata: res
            });
        });
    });
});


// get for uploading an attachment
app.post('/upload', function(request, response) {
    var form = new formidable.IncomingForm();
    form.multiples = true;
    form.uploadDir = path.join(__dirname, '/uploads');

    form.on('file', function(field, file) {
        //fs.rename(file.path, path.join(form.uploadDir, file.name));
        var data = fs.readFileSync(file.path);
        db.run("INSERT INTO Attachments (Type, Data, Article, Created, Name, Path) " +
            "VALUES(?,?,?,datetime('now'), ?, ?)",
        [
            file.type, data, request.query.origin, file.name, file.path
        ], function(err, result) {
            if (err) {
                throw err.stack;
            }
        });
    });

    form.on('error', function(err) {
        console.log(err);
    });

    form.on('end', function() {
        response.end('receieved successfully!');
    });

    form.parse(request);
});

app.get('/download', function(request, response){
  db.all('SELECT Name, Path FROM Attachments WHERE ID=?', request.query.file, function(err, file){
      if(err){
          throw err.stack;
      }
      var pathArray = file[0].Path.split('\\');
      var filename = pathArray[pathArray.length-1];
      response.download('./uploads/'+filename, file[0].Name);
    });
});

// auto complete queries
// -------------------------------------------------------------------------------

app.post('/articles', function(request, response) {
    db.all('SELECT (Symptoms) Title FROM Articles WHERE Current = 1', function(err, result) {
        if (err) {
            throw err.stack;
        }
        response.send(result);
    });
});

app.post('/customers', function(request, response) {
    db.all('SELECT ID, Name FROM Customer', function(err, result) {
        if (err) {
            throw err.stack;
        }
        response.send(result);
    });
});

app.post('/tags', function(request, response) {
    db.all('SELECT Text FROM Tag', function(err, result) {
        if (err) {
            throw err.stack;
        }
        response.send(result);
    });
});

//-----------------------------------------------------------------------------------

// get for posting a new customer
app.get('/post-customer', function(request, response) {
    response.render('AddCustomer.html');
});

// get for posting a new article
app.get('/post', function(request, response) {
    db.all("SELECT ID, Name FROM Customer ORDER BY Created DESC LIMIT 5", function(err, customer) {
        if (err) {
            throw err.stack;
        } else {
            response.render('NewArticle.html', {customerdata: customer});
        }
    });
});

// search engine
// -------------------------------------------------------------------------------

app.post('/search/:title', function(request, response) {
    var text = (request.params.title).replace(/-/g, " ");
    var splittext = text.split(' ');
    let searchResults = [];

    let regtext = '%'+text+'%';
    let pretext = '%'+text;
    let posttext = text+'%';

    // Whole phrase first
    db.all("SELECT Title, Tags, Symptoms, Summary, Current strftime('%m/%d/%Y %H:%M',Created) Time, "+
            "strftime('%m/%d/%Y %H:%M',Modified) Updated FROM Articles "+
           "WHERE (Title like ? OR Tags like ? OR Symptoms like ? OR Summary like ?) "+
           'OR (Title like ? OR Tags like ? OR Symptoms like ? OR Summary like ?) '+
           'OR (Title like ? OR Tags like ? OR Symptoms like ? OR Summary like ?) LIMIT 30',
    [
        regtext, regtext, regtext, regtext,
        pretext, pretext, pretext, pretext,
        posttext, posttext, posttext, posttext
    ],
    function(err, result) {
        async.each(result, function(res, cb) {
            if (res.Current == 1 && text > 1) {
                searchResults.push(res);
            }
            cb();
        });
    });

    // Then each word
    async.each(splittext, function(string, callback) {
        let sql = '%' + string + '%';
        let presql = '%' + string;
        let postsql = string + '%';
        db.all("SELECT ID, Title, Tags, Symptoms, Summary, Current, strftime('%m/%d/%Y %H:%M',Created) Time, "+
                "strftime('%m/%d/%Y %H:%M',Modified) Updated FROM Articles "+
               "WHERE (Title like ? OR Tags like ? OR Symptoms like ? OR Summary like ?) "+
               'OR (Title like ? OR Tags like ? OR Symptoms like ? OR Summary like ?) '+
               'OR (Title like ? OR Tags like ? OR Symptoms like ? OR Summary like ?) LIMIT 30',
        [
            sql, sql, sql, sql,
            presql, presql, presql, presql,
            postsql, postsql, postsql, postsql
        ],
        function(err, result) {
            if(string.length > 1){
                // Loop through results to filter out non-current articles
                async.each(result, function(res, cb) {
                    if (res.Current == 1) {
                        searchResults.push(res);
                    }
                    cb();
                });
            }
            // move on to next element
            callback();
        });
    },
    // done
    function(err) {
        if (err) {
            throw err.stack;
        } else if (searchResults.length === 0) {
            searchResults = [
                {
                    ID: '-1',
                    Title: 'No results found :/'
                }
            ];
        }
        var noDuplicates = removeDuplicates(searchResults, "ID");

        // sort by likeness to orignal string
        let searchSorted = levenSort(noDuplicates, text, ['Title', 'Tags', 'Symptoms', 'Summary']);
        response.send(searchSorted);
        });
    });

// Functions ----------------------------------------------------------------------------------------------------------

// by James Drinkard http://stackoverflow.com/questions/2218999/remove-duplicates-from-an-array-of-objects-in-javascript
function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}
