# NEPS Knowledge Base

Private repo for the KB project. A website like stackoverflow, but for NEPS!

![alt tag](/public/images/favicon.ico)

<sup>Cool logo I made</sup>


## Getting Started

In the command line at the root of project directory, run npm start and it will run. If it doesn't,
you are probably missing the right dependencies (99% of the time). In the same directory, run npm install 
*insert dependency name here. For example, if I want react, npm install react. Pretty simple. Just keep npm
installing until it works. To see the site once it's running, open chrome and go to localhost:5000.

### Prerequisites

You need NodeJs and npm installed to setup and compile the code.

### Installing

Unzip folder.

## Acknowledgments

* Dave Martina and Jake Balfour - Project Managers
* John Shumway and Don Tiet - Technical/Programming Advisors
* Kyle Wilmarth and Kyle Tavares - Front-end/UI Expertise

# Important Dev stuff
### if you aren't a dev, you won't understand any of this ↓

## Directory structure

The main directory is home to the Web.js file (which holds the node server code), .babelrc and .jshintrc
(which are config files for babel and jshint respectively), package.json, and the database file. Inside the 
public folder is all the fancy client side stuff. The folders inside there are pretty self-explanatory 
(except for a few). The node_modules folder holds the many dependencies that enables this site to work.

## Client Scripts

In /public/scripts folder there is almost a dozen js files that do important client side stuff. Most of them
are easy to understand, so I'll explain the complicated ones instead. 

#### autocomplete.js 

Holds the code for the search suggestions. It depends on react, babel,
and jsx to run. Since these are npm modules that can only easily be included on server side code,
we used browserify to pack their dependencies into the bundle.js file.

#### bundle.js

As I said before, bundle.js holds the important dependencies for autocomplete js. It also runs the code in
autocomplete.js, so to get it to run on our html page, it's just <script src="../scripts/bundle.js"/>

#### realtime.socket.js

Listens on a websocket for any events. On a 'received' event,
jQuery is used to append the newly posted article data to the display. Relies on socket.io to function.

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
* [Socket.io](https://socket.io/) - Used for websocket code

### Important Commands

* npm start 
    - starts the server (duh)
* browserify ./public/scripts/autocomplete.js > ./public/scripts/bundle.js 
    - finds all dependencies for autocomplete and puts them bundle.js along with the autocomplete.js source code

### Important files - don't delete these
* .babelrc
    - tells babel (a compiler for js) what presets/plugins the code is using in order to compile
* package.json
    - tells npm our dependencies, and tells browserify our babel plugins in order to link our modules.
* db.sqlite
    - the database, you can open it with SQLite Manager
* Web.js
    - the server code, a huge mess of callbacks

### Not-so Important files - delete these if you want idc
* jshintrc
    - only need this if you're using atom

## Authors

* **Adam Espinola** - *Initial Server Programmer* - (adamsp123@gmail.com)

* **Patrick Kennedy** - *Initial Client Programmer* - (patchkennedy56@gmail.com)

