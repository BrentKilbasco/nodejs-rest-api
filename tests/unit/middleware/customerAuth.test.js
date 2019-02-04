const mongoose = require( 'mongoose' );

// Middleware
const customerAuth = require( '../../../middleware/customerAuth' );

// Data Models
const { Customer } = require( '../../../models/customer' );


describe( 'customer auth middleware - unit', () => {

  it( 'should populate req.user with the payload of a valid JWT', () => {

    const user = { _id: new mongoose.Types.ObjectId().toHexString(), isGold: true };
    const token = new Customer( user ).generateAuthToken();
    const next = jest.fn();
    const res = {};
    const req = { header: jest.fn().mockReturnValue(token) };  

    customerAuth( req, res, next );

    expect( req.user ).toMatchObject( user );

  });

});


