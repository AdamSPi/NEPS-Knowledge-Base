/*
TODO: Security Login Hooks
TODO: Tag Popularity
TODO: Input Moderation
TODO: Divs
TODO: Search scope/filter by tag
TODO: search suggestions w/ material-ui
TODO: Revision History
*/
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

// Hooks will go here...

app.get('/user/authenticate', function() {});

//---------------------------------------------------------------------------------------------------------------------

// Socket.IO
// Real time event feedback
io.on('connection', function(socket) {
    // Article Socket -----------------------------------------------------------------
    socket.on('send', function(data) {
        // No tags
        console.log(data);
        if (data[6].value === "") {
            db.run("INSERT INTO Articles (Title, Symptoms, Summary, Created, Content, Delta, Customer, Current) " +
                "VALUES(?,?,?,datetime('now'),?, ?, ?, 1)",
            [
                data[0].value, // title field
                data[1].value, // symptoms field
                data[2].value, // summary field
                data[3].value, // content field
                data[4].value, // delta field
                data[5].value, // customer field
            ], function(err, result) {
                if (err) {
                    throw err.stack;
                }
                return;
            });
        } else {
            // split tag field
            let tagRes = data[6].value.substr(0, data[6].value.length - 1); // remove last ; at end
            let tagField = tagRes.split(';');
            // insert into database
            db.run("INSERT INTO Articles (Title, Symptoms, Summary, Created, Content, Delta, Tags, Customer, Current) " +
                "VALUES(?,?,?,datetime('now'),?, ?, ?, ?, 1)",
            [
                data[0].value, // title field
                data[1].value, // symptoms field
                data[2].value, // summary field
                data[3].value, // content field
                data[4].value, // delta field
                tagRes, // tag field
                data[5].value //customer field
            ], function(err, result) {
                if (err) {
                    throw err.stack;
                }
                tagField.forEach((tag) => {
                    db.run("INSERT INTO Tag (Text, Created,Frequency) " +
                        "VALUES(?,datetime('now'),'0')",
                    [tag], function(err, result) {
                        // Tag already exists, increment freq.
                        if (err) {
                            db.run("UPDATE Tag SET Frequency= Frequency + 1 WHERE Text=?", [tag], function(error, res) {
                                if (error) {
                                    throw error.stack;
                                }
                            });
                        }
                    });
                });
            });
        }

        // get the article just inserted
        db.all('SELECT * FROM Articles ORDER BY datetime(Created) DESC LIMIT 1;', function(err, result) {
            if (err) {
                throw err.stack;
            } else {

                // emit to original client
                socket.emit('receieved', result[0]);

                // emit to all other clients
                socket.broadcast.emit('receieved', result[0]);
            }

        });

    });

    // REVISION SOCKET ---------------------------------------------------------------

    socket.on('update', function(data) {
        // Make new article
        // split tag field
        let tagRes = data[6].value.substr(0, data[6].value.length - 1); // remove last ; at end
        let tagField = tagRes.split(';');
        // insert into database
        db.run("INSERT INTO Articles (Title, Symptoms, Summary, Created, Content, Delta, Tags, Customer, Current) " +
            "VALUES(?,?,?,datetime('now'),?, ?, ?, ?, 1)",
        [
            data[0].value, // title field
            data[1].value, // symptoms field
            data[2].value, // summary field
            data[3].value, // content field
            data[4].value, // delta field
            tagRes,       // tag field
            data[5].value //customer field
        ], function(err, result) {
            if (err) {
                throw err.stack;
            }
            tagField.forEach((tag) => {
                db.run("INSERT INTO Tag (Text, Created,Frequency) " +
                    "VALUES(?,datetime('now'),'0')",
                [tag], function(err, result) {
                    // Tag already exists, increment freq.
                    if (err) {
                        db.run("UPDATE Tag SET Frequency= Frequency + 1 WHERE Text=?", [tag], function(error, res) {
                            if (error) {
                                throw error.stack;
                            }
                        });
                    }
                });
            });
        });

        // get the article just inserted
        db.all('SELECT * FROM Articles ORDER BY datetime(Created) DESC LIMIT 1;', function(err, result) {
            if (err) {
                throw err.stack;
            } else {
                // Update all previously revised articles with new ID including the one just revised
                db.all("UPDATE Articles SET Revision=?, Current=0 WHERE Revision=? OR ID=?", [
                    result[0].ID, // new ID
                    data[4].value, // old ID
                    data[4].value
                ], function(err, res) {
                    // emit to original client
                    socket.emit('success', result[0]);
                });
            }
        });

    });

    // COMMENT SOCKET ----------------------------------------------------------------
    socket.on('comment', function(data) {
        console.log(data);
    });
});

//HTTP Request Handlers -----------------------------------------------------------------------------------------------

app.post('/upload', function(request, response) {
    var form = new formidable.IncomingForm();
    form.multiples = true;
    form.uploadDir = path.join(__dirname, '/uploads');

    form.on('file', function(field, file) {
        // fs.rename(file.path, path.join(form.uploadDir, file.name));
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

        db.all("SELECT ID FROM Attachments WHERE Article=?", request.query.origin, function(err, results) {
            let resultString = '';
            results.forEach(function(obj) {
                if (!resultString) {
                    resultString += obj.ID;
                } else {
                    resultString += ';' + obj.ID;
                }
            });

            db.run("UPDATE Articles SET Attachments=? WHERE ID=?", [
                resultString, request.query.origin
            ], function(err) {
                if (err) {
                    throw err.stack;
                }
            });
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

app.get('/customer', function(request, response) {
    response.render('AddCustomer.html');
});

app.get('/post', function(request, response) {
    db.all("SELECT Name FROM Customer", function(err, customer) {
        if (err) {
            throw err.stack;
        } else {
            response.render('NewArticle.html', {customerdata: customer});
        }
    });
});

app.get('/', function(request, response) {
    var array = [];
    db.all("SELECT *, strftime('%m/%d/%Y %H:%M',Created) Time FROM Articles WHERE " +
        "(julianday('now') - julianday(Created)) <= 30 AND Current=1 ORDER BY Created DESC LIMIT 30;",
    function(err, result) {
        if (err) {
            throw err.stack;
        } else {
            array = result;
        }
    });
    db.all("SELECT * FROM Tag", function(err, tagsresult) {
        if (err) {
            throw err.stack;
        } else {
            response.render('Articles.html', {
                data: array,
                tagdata: tagsresult
            });
        }
    });
});

// auto complete query
app.get('/all', function(request, response) {
  // TODO: SELECT ALL FROM EVERY OTHER TABLE TOO
  db.all('SELECT Title FROM Articles', function(err, result){
    if(err){
      throw err.stack;
    }
    response.send(result);
  });
});

app.get('/articles/:title', function(request, response) {
    db.all('SELECT * FROM Articles WHERE ID=?', request.query.id, function renderArticle(err, result) {
        if (err) {
            throw err.stack;
        } else {
            // Article doesn't have attachments
            if (result[0].Attachments === null) {
                response.render('ArticleLayout.html', {data: result} // Article has one (or more) attachment(s)
                );
            } else if (result[0].Attachments !== null) {
                let data = [];
                var results = result[0].Attachments.split(';');
                async.each(results, function(id, callback) {
                    db.all('SELECT * FROM Attachments WHERE ID=?', id, function(err, rows, fields) {
                        if (err) {
                            throw err.stack;
                        }
                        data.push(rows[0]);
                        callback();
                    });
                },
                // done
                function(err) {
                    if (err) {
                        throw err.stack;
                    }
                    response.render('ArticleLayout.html', {
                        data: result,
                        attachment: data
                    });
                });
            }
        }
    });
});

// search engine
app.get('/articles/search/:title', function(request, response) {
    var text = (request.params.title).replace(/-/g, " ");
    var splittext = text.split(' ');
    let searchResults = [];

    // TODO: Query db for likeness word by word and then the whole phrase
    async.each(splittext, function(string, callback) {
        let sql = '%' + string + '%';
        db.all('SELECT * FROM Articles WHERE Title like ? OR Tags like ? OR Symptoms like ? OR Content like ? LIMIT 10;', [
            sql, sql, sql, sql
        ], function(err, result) {
            // Loop through results to filter out non-current articles
            async.each(result, function(res, cb) {
                if (res.Current == 1) {
                    searchResults.push(res);
                }
                cb();
            });

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
        let searchSorted = levenSort(noDuplicates, text, ['Title', 'Tags', 'Symptoms', 'Content']);
        response.render('ArticleSearch.html', {data: searchSorted});
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
