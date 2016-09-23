# TheMovieApp

## Installation and setup requirements
* Install required dependencies
  * `npm install`
  * To run database (MySQL) locally
    * From terminal: `brew install mysql`
      * To run:
        * start the db server `mysql.server start`
        * create password for as new user if needed `mysqladmin -u *username* password`
        * to invoke mysql CLI tool `mysql -u *username* -p`

## Running dev server
	* to compile client ES6 code and start server `npm run dev:start`
	* to compile client as files changes `npm run watch`

