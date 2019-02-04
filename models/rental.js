
const mongoose = require( 'mongoose' );
const moment = require( 'moment' );
const Joi = require( 'joi' );


// Rental Customer Schema
const rentalCustomerSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  isGold: {
    type: Boolean,
    required: true,
  },
  phone: {
    type: String,
    trim: true,
    required: true,
    minLength: 1,
    maxLength: 255,
  },
});


// Rental Car Schema
const rentalCarSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 1024,
  },
});


// Rental SChema
const rentalSchema = new mongoose.Schema({
  customer: {
    type: rentalCustomerSchema,
    required: true,
  },
  car: {
    type: rentalCarSchema,
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});


// lookup()
//
rentalSchema.statics.lookup = function _lookup(customerId, carId){
  return this.findOne({
    'customer._id': customerId,
    'car._id': carId,
  });
};//END lookup


// return()
//
rentalSchema.methods.return = async function _return() {

  // Set the returned date to now
  this.dateReturned = Date.now();

  // Calculate the rental fee based on the total days rented
  const daysOut = moment().diff( this.dateOut, 'days' );
  this.rentalFee = daysOut * this.car.dailyRentalRate;

};//END return



const Rental = mongoose.model( 'Rental', rentalSchema );


// Validate incoming request data
//
function validateRental(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    carId: Joi.objectId().required(),
  };

  return Joi.validate( rental, schema );
}//END validateRental


// Exports
//
module.exports.Schema = rentalSchema;
module.exports.Rental = Rental;
module.exports.validate = validateRental;
