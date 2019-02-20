# NodeJS RESTful API



[![Build Status](https://travis-ci.com/BrentKilbasco/nodejs-rest-api.svg?branch=master)](https://travis-ci.com/BrentKilbasco/nodejs-rest-api)

A RESTful API for a mock luxury car rental service, built with NodeJS. This API was built with the intention of having a website/webapp for customers to log in and use, and a separate dashboard for employees to use for data entry and rental processing. 

Customers can create an account, log in and out, browse through cars by style/brand/name, view their own profile and their full user history of rentals, and can request to rent a specific car. 

Employees can view and create new brands, styles, cars, and can process rental records, updating them and setting them as processed and returned. Managers have a few extra permissions such as deleting rental records and viewing a full employee list.


## 🧠 Motivation

One of the reasons I created this project is to use in a tutorial I plan on writing out in the near(ish) future. Also I don't have many public repos, and wanted to change that 😃

Some features I plan on adding in the future include a web site that customers can access that allows them to login, browse, and rent cars, and a client web dashboard that would be used by the employees of the car rental service. 



## 💻 Technologies used

Authentication and authorization for Customers, Employees, and Managers is handled using JSON web tokens, and user passwords are encrypted before being saved to the database.

Practically 100% code test coverage using the Jest library, with the only things not covered being extra error handling for edge cases which theoretically should never happen. Paranoid programming 😉

Some of the frameworks and libraries used for this project include:
- [Express](https://www.npmjs.com/package/express)
- [Mongoose](https://www.npmjs.com/package/mongoose)
- [Winston](https://www.npmjs.com/package/winston)
- [Joi](https://www.npmjs.com/package/joi)
- [BCrypt](https://www.npmjs.com/package/bcrypt)
- [Jest](https://www.npmjs.com/package/jest)
- [Travis CI](https://github.com/travis-ci/travis-ci)
- [ESLint](https://www.npmjs.com/package/eslint) following [Airbnb's JS Linting](https://github.com/airbnb/javascript) guidelines




## 📖 API Reference

Coming soon - just need to clean up the documentation first!



## 🚀 Installation - getting it up and running

#### 1. Clone and Install

```bash
# Clone the repo
git clone https://github.com/BrentKilbasco/nodejs-restful-api.git

# Install dependencies
npm install
```

#### 2. Create a dev and test config file

Create two new files in the config folder: 'devEnv.js' and 'testEnv.js'.
```javascript
module.exports = {
  mongoURI : 'mongodb://<username>:<password><mongoDB-dev-or-test-address>',
  jwtPrivateKey: 'someUniqueKey',
};
```

#### 3. Set up MongoDB Deployments
Set up a dev and test MongoDB database deployment, and then point those two new files (from step #2) to their respective databases.


#### 4. Start it up!

Ok, now we're ready to navigate to the project folder in a terminal window and run the app.

```
node index.js
```


## 👊 Further Help?

Need further help? No worries! Just [get in touch with me directly](http://portfolio.bkilbasco.com) 😄




_If there's any other ideas presented in this repo, that you think worth mentioning - feel free open a pull request_ 😄  _Cheers!!_ 🍻 
