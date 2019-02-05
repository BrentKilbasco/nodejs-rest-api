# NodeJS RESTful API

---

## 👋 Intro

This project is a RESTful API for a mock luxury car rental service, built with NodeJS. This API was built with the intention of having a website/webapp for customers to log in and use, and a separate dashboard for employees to use for data entry and rental processing. 

Customers can create an account, log in and out, browse through cars by style/brand/name, view their own profile and their full user history of rentals, and can request to rent a specific car. 

Employees can view and create new brands, styles, cars, and can process rental records, updating them and setting them as processed and returned. Managers have a few extra permissions such as deleting rental records and viewing a full employee list.

Authentication and authorization for Customers, Employees, and Managers is handled using JSON web tokens, and user passwords are encrypted before being saved to the database.

Practically 100% code test coverage using the Jest library, with the only things not covered being extra error handling for edge cases which theoretically should never happen. Paranoid programming 😉

Some of the libraries used for this project include:

- __Express__
    - [Express](https://www.npmjs.com/package/express)
- __Mongoose__
    - [Mongoose](https://www.npmjs.com/package/mongoose)
- __Logging via Winston__ 
    - [Winston](https://www.npmjs.com/package/winston)
- __Data validation with Joi__ 
    - [Joi](https://www.npmjs.com/package/joi)
- __Encrpytion through BCrypt__ 
    - [BCrypt](https://www.npmjs.com/package/bcrypt)
- __Code Linting with ESLint__
    - [ESLint](https://www.npmjs.com/package/eslint)
    - Following [Airbnb's JS Linting](https://github.com/airbnb/javascript) guidelines
- __Integration and Unit testing with Jest__
    - [Jest](https://www.npmjs.com/package/jest)
---

## 📖 Docs


---

## 🚀 Getting it up and running

#### 1. Clone and Install

```bash
# Clone the repo
git clone https://github.com/BrentKilbasco/nodejs-rest-api

# Install dependencies
npm install
```

#### 2. Set up MongoDB Deployments
Set up a MongoDB database deployment for dev and test environments.

#### 3. Create a dev and test config file

Create two new files in the config folder: 'devEnv.js' and 'testEnv.js', and point them to the deployments we created in step #2. 

The jwtPrivatekey property can be any unique string, and is used for JSON web token signing and verifying.

```bash
module.exports = {
  mongoURI : 'mongodb://<username>:<password><mongoDB-dev-or-test-address>',
  jwtPrivateKey: 'someUniqueKey',
};
```


---

## 👊 Further Help?

Need further help? No worries! Just [get in touch with me directly](http://portfolio.bkilbasco.com) 😄

---


_If there's any other ideas presented in this repo, that you think worth mentioning - feel free to give me a shout or open a pull request_ 😄  _Cheers!!_ 🍻 
