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




const endpoint = '/api/v1/returns';
let server = null;



describe( 'manager/admin employee auth middleware - integration', () => {



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


  const exec = (customerId, carId) => {

    return request( server )
      .post( endpoint )
      .set( 'x-auth-token', newEmployee.generateAuthToken() )
      .send({ customerId, carId });

  };//END exec


  it( 'returns 200 if rental record was successfully returned/processed', async () => {

    const res = await exec( newCustomer._id, newCar._id );

    expect( res.status ).toBe( 200 );

  });

  it( 'increments number in stock for returned car', async () => {

    const beforeCount = newCar.numberInStock;
    
    const res = await exec( newCustomer._id, newCar._id );

    const freshCar = await Car.findById( newCar._id );
    const afterCount = freshCar.numberInStock;

    expect( res.status ).toBe( 200 );    
    expect( beforeCount ).toBeLessThan( afterCount );

  });


  it( 'returns 404 if rental record was not found - invalid customer id', async () => {

    const res = await exec( new mongoose.Types.ObjectId(), newCar._id );

    expect( res.status ).toBe( 404 );

  });

  it( 'returns 404 if rental record was not found - invalid car id', async () => {

    const res = await exec( newCustomer._id, new mongoose.Types.ObjectId() );

    expect( res.status ).toBe( 404 );

  });

  it( 'returns 400 if rental record was already processed', async () => {

    await exec( newCustomer._id, newCar._id );

    const res = await exec( newCustomer._id, newCar._id );

    expect( res.status ).toBe( 400 );

  });


});
