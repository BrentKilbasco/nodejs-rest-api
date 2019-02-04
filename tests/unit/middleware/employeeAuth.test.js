const mongoose = require( 'mongoose' );

// Middleware
const employeeAuth = require( '../../../middleware/employeeAuth' );

// Data Models
const { Employee } = require( '../../../models/employee' );


describe( 'employee auth middleware - unit', () => {

  it( 'should populate req.user with the payload of a valid JWT', () => {

    const user = { _id: new mongoose.Types.ObjectId().toHexString(), isAdmin: false };
    const token = new Employee( user ).generateAuthToken();
    const next = jest.fn();
    const res = {};
    const req = { header: jest.fn().mockReturnValue(token) };  

    employeeAuth( req, res, next );

    expect( req.user ).toMatchObject( user );

  });

});


