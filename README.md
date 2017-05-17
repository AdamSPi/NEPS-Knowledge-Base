
<img src="/public/images/favicon.ico" width="100" height="100" />

# NEPS Knowledge Base

Readme file for the KB project.

## Getting Started

In the command line at the root of project directory, run npm start and it will run. If it doesn't,
you are probably missing the right dependencies (99% of the time). In the same directory, run npm install 
*insert dependency name here. For example, if I want react, npm install react. To see the site once it's running, open chrome and go to localhost:5000.

### Prerequisites

You need NodeJs and npm installed to setup and compile the code.

### Installing

Unzip folder.

Go to the unzipped directory and hold shift and right click and select open cmd here.

*You may need to run cmd as admin*

In cmd, run these commands:
<em>
* npm install express
* npm install express-helpers
* npm install react
* npm install react-dom
* npm install material-ui
* npm install body-parser
* npm install async
* npm install socket.io
* npm install formidable
* npm install sqlite3
* npm install ejs
* npm install babel-cli 
* npm install babel-preset-es2015 babel-preset-react
* npm install nodemon
* npm install leven-sort
* npm install browserify
</em>

You can run them one by one or all at once. It'll probably take 5-10 mins so grab some popcorn while you wait.

Once that is done, in the same cmd window, run npm start and it should start the server.

In any browser, go to localhost:5000 to view the site.

## Acknowledgments

* Dave Martina and Jake Balfour - Project Managers
* John Shumway and Don Tiet - Technical/Programming Advisors
* Kyle Wilmarth and Kyle Tavares - Front-end/UI Expertise

# Important Dev stuff ↓

## Directory structure

The main directory is home to the Web.js file (which holds the node server code), .babelrc and .jshintrc
(which are config files for babel and jshint respectively), package.json, and the database file. Inside the 
public folder is all the fancy client side stuff. The folders inside there are pretty self-explanatory . 
The node_modules folder holds the many dependencies that enables this site to work.

## Client Scripts

In /public/scripts folder there is more than a dozen js files that do important client side stuff. Most of them
are easy to understand, so I'll explain the complicated ones instead. 

#### autocomplete.js 

Holds the code for the search suggestions. It depends on react, babel,
and jsx to run. Since these are npm modules that can only be included on server side code,
we used browserify to pack their dependencies into the bundle.js file.

#### bundle.js

Holds the code for autocomplete.js and its dependencies. Any js file starting with bundle holds the dependencies
for the js file named in its suffix. For example, bundle-search-react.js holds the dependencies for
search-react.js.

#### socket.js

Listens on socket.io for any events. On a 'received' event,
jQuery is used to append the newly posted article data to the display. Relies on socket.io to function.

#### add-customer.js

Adds the customer clicked to the customer input field on the article edit page.

#### edit-customer.js

On the edit page of an article, this script is used so that whenever the user clicks on a customer 
suggestion in the customer search, it will add that customer to the recent customers list so that it
can be selected.

##### Anything associated with revising is in revise.js
##### Anything associated with posting is in post.js
##### Anything associated with commenting is in comment.js
##### Anything associated with tagging is in tag.js
##### Anything associated with file attachments is in upload.js

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
    - starts the server
* browserify ./public/scripts/(*source file* ) > ./public/scripts/( *dest. file* )
    - finds all dependencies for source file and puts them in dest. file along with the 
        source file's code

### Important files - don't delete these
* .babelrc
    - tells babel (a compiler for js) what presets/plugins the code is using in order to compile
* package.json
    - tells npm our dependencies, and tells browserify our babel plugins in order to link our modules.
* db.sqlite
    - the database, you can open it with SQLite Manager
* Web.js
    - the server code, a huge mess of callbacks

### Not-so Important files
* jshintrc
    - only need this if you're using jshint for intellisense

## Authors

* **Adam Espinola** - *Initial Server Programmer* - (adamsp123@gmail.com)

* **Patrick Kennedy** - *Initial Client Programmer* - (patchkennedy56@gmail.com)

