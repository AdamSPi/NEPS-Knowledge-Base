# NEPS Knowledge Base

Private repo for the KB project.

## Getting Started

In the command line at the root of project directory, run npm start and it will run. If it doesn't,
you are probably missing the right dependencies (99% of the time). In the same directory, run npm install 
*insert dependency name here. For example, if I want react, npm install react. Pretty simple. Just keep npm
installing until it works. To see the site once it's running, open chrome and go to localhost:5000.

### Prerequisites

You need NodeJs and npm installed to run this.

### Installing

Unzip folder.

## Directory structure

The main directory is home to the Web.js file (which holds the node server code), .babelrc and .jshintrc
(which are config files for babel and jshint respectively), package.json, and the database file. Inside the 
public folder is all the fancy client side stuff. The folders inside there are pretty self-explanatory. The
node_modules folder holds the many dependencies that enables this site to work.

## Client Scripts

In /public/scripts folder there is almost a dozen js files that do important client side stuff. Most of them
are easy to understand, so I'll explain the complicated ones instead. 

#### autocomplete.js 

Holds the code for the search suggestions. It depends on react, babel,
and jsx to run. Since these are npm modules that can only easily be included on server side code,
We used browserify to pack their dependencies into the bundle.js file.

#### bundle.js

As I said before, bundle.js holds the important dependencies for autocomplete js. It also runs the code in
autocomplete.js, so to get it to run on our html page, it's just <script src="../scripts/bundle.js"/>

#### realtime.socket.js

Listen on a websocket for any events that happen concerning articles that are posted. On a 'received' event,
jQuery is used to append the newly posted article data to the display. 

## Built With

* [jQuery](https://jquery.com/) - Used for client side coding
* [SQLite](https://www.sqlite.org/) - Database
* [express](https://expressjs.com/) - Used for web framework
* [browserify](http://browserify.org/) - Packages npm modules for client-side use
* [Node](https://nodejs.org/en/) - Used for back-end
* [async](https://github.com/caolan/async) - Used to asynchronously loop through DB queries for search engine
* [quill](https://quilljs.com/) - Rich text box editor
* [ejs](http://www.embeddedjs.com/) - Templating engine
* [react](https://facebook.github.io/react/) - Used for material-ui autocomplete/ search suggestions
* [bootstrap](http://getbootstrap.com/) - Helped the site look pretty :)
* [nodemon](https://github.com/remy/nodemon) - Monitor for any changes in your node.js application and automatically restart the server
* [leven-sort](https://www.npmjs.com/package/leven-sort) - Algorithm used for search engine
* [Atom](https://atom.io/) - Text Editor/IDE used for development


## Authors

* **Adam Espinola** - *Initial work* - (https://github.com/AdamSPi)

* **Patrick Kennedy** - *Initial work* - (https://github.com/patkenne56)

## Acknowledgments

* Dave Martina and Jake Balfour - Project Managers
* John Shumway and Don Tiet - Technical/Programming Advisors
* Kyle Wilmarth and Kyle Tavares - Front-end/UI Expertise

