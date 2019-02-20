require( '../../helpers/testprep' );
const mongoose = require( 'mongoose' );
const request = require( 'supertest' );

require('events').EventEmitter.defaultMaxListeners = 20;

const { Car } = require( '../../../models/car' );
const { Style } = require( '../../../models/style' );
const { Brand } = require( '../../../models/brand' );
const { Rental } = require( '../../../models/rental' );
const { Customer } = require( '../../../models/customer' );
const { Employee } = require( '../../../models/employee' );



const endpoint = '/api/v1/rentals';
let server = null;

describe( endpoint, async () => {

  let newBrand = null;
  let newStyle = null;
  let newCar = null;
  let newCustomer = null;
  let newEmployee = null;
  let newManager = null;
  let newRental = null;


  beforeEach( async () => {

    // Open/start server before each test
    server = await require( '../../../startup/startup' ).init();

    // Create a customer
    //
    newCustomer = await new Customer({
      name: 'joe bob', 
      email: 'joebob@hotmale.com',
      password: '123456',
      phone: '555-5555',
      isGold: false, 
    }).save();

    // Create an employee
    //
    newEmployee = await new Employee({
      name: 'joe bob', 
      email: 'joebob@hotmale.com',
      password: '123456',
      phone: '555-5555',
      isAdmin: false,       
    }).save();

    // Create a manager/admin
    //
    newManager = await new Employee({
      name: 'jan jen', 
      email: 'janjen@hotfemale.com',
      password: '123456',
      phone: '555-5555',
      isAdmin: true,       
    }).save();

    // Create a brand
    //
    newBrand = await new Brand({
      name: 'brand1',
      description: 'the brand name 1',
    }).save();

    // Create a style
    //
    newStyle = await new Style({
      name: 'style1',
      description: 'the style 1',
    }).save();

    // Create a car
    //
    newCar = await new Car({
      name: 'dynomight',
      description: 'a strong baby',
      brand: {
        _id: newBrand._id,
        name: newBrand.name,
      },
      style: {
        _id: newStyle._id,
        name: newStyle.name,
      },
      numberInStock: 10,
      dailyRentalRate: 90,
    }).save();

    // Rental record
    //
    newRental = await new Rental({
      customer: {
        _id: newCustomer._id,
        name: newCustomer.name,
        phone: newCustomer.phone,
        isGold: newCustomer.isGold,
      },
      car: {
        _id: newCar._id,
        name: newCar.name,
        dailyRentalRate: newCar.dailyRentalRate,
      },
    }).save();

  });//END beforeEach


  afterEach( async () => {
    
    // Clean up db
    await Rental.collection.deleteMany();
    await Customer.collection.deleteMany();
    await Employee.collection.deleteMany();
    await Car.collection.deleteMany();
    await Brand.collection.deleteMany();
    await Style.collection.deleteMany();
    
    // Close server after each test
    await server.close();
    await mongoose.disconnect();

  });//END afterEach


  describe( 'GET /', async () => {

    it( 'returns all rentals', async () => {

      const res = await request( server )
        .get( endpoint )
        .set( 'x-auth-token', newCustomer.generateAuthToken() );

      expect( res.status ).toBe( 200 );
      expect( res.body.length ).toBe( 1 );

    });

  });//END GET all


  describe( 'GET /me', async () => {

    it( 'returns rentals for customer of given ID', async () => {

      const res = await request( server )
        .get( endpoint + '/me' )
        .set( 'x-auth-token', newCustomer.generateAuthToken() );

      expect( res.status ).toBe( 200 );
      expect( res.body ).toHaveLength( 1 );

    });

  });


  describe( 'GET /:id', async () => {

    it( 'returns rental by id', async () => {

      const res = await request( server )
        .get( endpoint + '/' + newRental._id )
        .set( 'x-auth-token', newEmployee.generateAuthToken() );

      expect( res.status ).toBe( 200 );
      expect( res.body ).toHaveProperty( 'customer._id', newCustomer._id.toHexString() );

    });

    // It returns 404 if the car was not found


  });//END GET by id


  describe( 'POST /', () => {
    it( 'creates a new rental record', async () => {

      const res = await request( server )
        .post( endpoint )
        .set( 'x-auth-token', newCustomer.generateAuthToken() )
        .send({ customerId: newCustomer._id, carId: newCar._id });

      expect( res.status ).toBe( 200 );
      expect( res.body ).toHaveProperty( 'customer._id', newCustomer._id.toHexString() );

    });

    it( 'updates the number in stock for the appropriate car', async () => {

      // Cache the 'before' numberInStock value
      const beforeCount = newCar.numberInStock;

      const res = await request( server )
        .post( endpoint )
        .set( 'x-auth-token', newCustomer.generateAuthToken() )
        .send({ customerId: newCustomer._id, carId: newCar._id });


      // Get the updated car record
      const freshCar = await Car.findById( newCar._id );
      const afterCount = freshCar.numberInStock;

      expect( res.status ).toBe( 200 );
      expect( afterCount ).toBeLessThan( beforeCount );

    });

    it( 'returns 400 if invalid customer ID', async () => {

      const res = await request( server )
        .post( endpoint )
        .set( 'x-auth-token', newCustomer.generateAuthToken() )
        .send({ 
          customerId: new mongoose.Types.ObjectId(), 
          carId: newCar._id, 
        });

      expect( res.status ).toBe( 400 );

    });    

    it( 'returns 400 if invalid car ID', async () => {

      const res = await request( server )
        .post( endpoint )
        .set( 'x-auth-token', newCustomer.generateAuthToken() )
        .send({ 
          customerId: newCustomer._id, 
          carId: new mongoose.Types.ObjectId(), 
        });

      expect( res.status ).toBe( 400 );

    });   

    it( 'returns 400 if not enough cars in stock', async () => {

      // Create new car with no stock
      const noStockCar = await new Car({
        name: 'no stock',
        description: 'empty, just like your soul',
        brand: {
          _id: newBrand._id,
          name: newBrand.name,
        },
        style: {
          _id: newStyle._id,
          name: newStyle.name,
        },
        numberInStock: 0,
        dailyRentalRate: 90,
      }).save();

      const res = await request( server )
        .post( endpoint )
        .set( 'x-auth-token', newCustomer.generateAuthToken() )
        .send({ 
          customerId: newCustomer._id, 
          carId: noStockCar._id, 
        });

      expect( res.status ).toBe( 400 );

    });   

  });

  describe( 'PUT /:id', () => {

    let updateRentalId = null;
    let updateRental = null;

    beforeEach( () => {

      // Create an update record
      updateRentalId = newRental._id;

      updateRental = { 
        dateOut: Date.now(),
        dateReturned: Date.now(),
        rentalFee: 0,
      };

    });//END beforeEach


    const exec = () => {

      return request( server )
        .put( endpoint + '/' + updateRentalId )
        .set( 'x-auth-token', newEmployee.generateAuthToken() )
        .send( updateRental );

    };//END exec



    it( 'updates rental record by id', async () => {

      const res = await exec();

      expect( res.status ).toBe( 200 );    

    });

    it( 'updates customer within rental record', async () => {

      // Create new customer
      const newRenterCustomer = await new Customer({
        name: 'jim jam', 
        email: 'jimjam@hotmale.com',
        password: '123456',
        phone: '555-5555',
        isGold: false, 
      }).save();
  
      updateRental.customerId = newRenterCustomer._id;

      const res = await exec();

      expect( res.status ).toBe( 200 );

    });

    it( 'updates car within rental record', async () => {

      // Create new car
      const newRenterCar = await new Car({
        name: 'dynomight',
        description: 'a strong baby',
        brand: {
          _id: newBrand._id,
          name: newBrand.name,
        },
        style: {
          _id: newStyle._id,
          name: newStyle.name,
        },
        numberInStock: 10,
        dailyRentalRate: 90,
      }).save();
  
      updateRental.carId = newRenterCar._id;

      const res = await exec();

      expect( res.status ).toBe( 200 );

    });

    it( 'returns 400 if invalid customer id', async () => {

      updateRental.customerId = new mongoose.Types.ObjectId();

      const res = await exec();

      expect( res.status ).toBe( 400 );          

    });

    it( 'returns 400 if invalid car id', async () => {

      updateRental.carId = new mongoose.Types.ObjectId();

      const res = await exec();

      expect( res.status ).toBe( 400 );          

    });


    it( 'returns 404 if rental with given id was not found', async () => {

      updateRentalId = new mongoose.Types.ObjectId();

      const res = await exec();

      expect( res.status ).toBe( 404 );          

    });

  });

  describe( 'DELETE /:id', () => {

    it( 'deletes rental record by id', async () => {

      const res = await request( server )
        .delete( endpoint + '/' + newRental._id )
        .set( 'x-auth-token', newManager.generateAuthToken() );

      const frDB = await Rental.lookup( newCustomer._id, newCar._id );

      expect( res.status ).toBe( 200 );
      expect( res.body ).toHaveProperty( 'customer._id', newCustomer._id.toHexString() );
      expect( frDB ).toBeNull();

    });

    it( 'returns 404 if rental record not found', async () => {

      const res = await request( server )
        .delete( endpoint + '/' + new mongoose.Types.ObjectId() )
        .set( 'x-auth-token', newManager.generateAuthToken() );

      expect( res.status ).toBe( 404 );

    });

  });

});
