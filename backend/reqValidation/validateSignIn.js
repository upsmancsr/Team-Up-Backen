const Validator = require('validator');
const isEmpty = require('is-empty');

// The function validateSignInInput takes as argument inputData,
// which should be an object 
// containing email and password:
module.exports = function validateSignInInput(inputData) {
    // Initialize an empty object called errors
    // to hold any errors returned from the checks below:
    let errors = {};

    // Convert empty fields to empty strings to use validator functions:
    inputData.email = !isEmpty(inputData.email) ? inputData.email : '';
    inputData.password = !isEmpty(inputData.password) ? inputData.password : '';

    // Check the input email:
    if (Validator.isEmpty(inputData.email)) {
        errors.email = 'Email field is required';       // check if empty
    } else if (!Validator.isEmail(inputData.email)) {   // check if valid email
        errors.email = 'Email is invalid';
    }

    // Check the input password:
    if (Validator.isEmpty(inputData.password)) {
        errors.password = 'Password field is required';
    }
    
    // Return errors object and boolean for isValid based on contents of errors object:
    return {
        errors,
        isValid: isEmpty(errors)
    };
};