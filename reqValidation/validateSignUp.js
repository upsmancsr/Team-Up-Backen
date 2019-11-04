const Validator = require('validator');
const isEmpty = require('is-empty');

// The function validateSignUpInput takes as argument inputData,
// which should be an object 
// containing name, email, password, and password2 (a confirmation password):
module.exports = function validateSignUpInput(inputData) {
    // Initialize an empty object called errors
    // to hold any errors returned from the checks below:
    let errors = {};

    // Convert empty fields to empty strings to use validator functions:
    inputData.name = !isEmpty(inputData.name) ? inputData.name : '';
    inputData.email = !isEmpty(inputData.email) ? inputData.email : '';
    inputData.password = !isEmpty(inputData.password) ? inputData.password : '';
    inputData.password2 = !isEmpty(inputData.password2) ? inputData.password2 : '';

    // Check the input name:
    if (Validator.isEmpty(inputData.name)) {
        errors.name = 'Name field is required';
    }

    // Check the input email:
    if (Validator.isEmpty(inputData.email)) {           // check if empty
        errors.email = 'Email field is required';
    } else if (!Validator.isEmail(inputData.email)) {   // check if valid email
        errors.email = 'Email is invalid';
    }

    // Check input passwords to see if empty:
    if (Validator.isEmpty(inputData.password)) {
        errors.password = 'Password field is required';
    }
    if (Validator.isEmpty(inputData.password2)) {
        errors.password2 = 'Confirmation password field is required';
    }

    // Check if input password is of required length:
    if (!Validator.isLength(inputData.password, { min: 6, max: 30 })) {
        errors.password = 'Password must be at least 6 characters';
    }
    // Check that the confirmation password is same as password 1:
    if (!Validator.equals(inputData.password, inputData.password2)) {
        errors.password2 = 'Passwords must match';
    }
    // Return errors object and boolean for isValid based on contents of errors object:
    return {
        errors,
        isValid: isEmpty(errors)
    };
};