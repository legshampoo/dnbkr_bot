require('dotenv').config({ path: 'variables.env' });

const mongoose = require('mongoose');

const passport = require('passport');
const User = mongoose.model('User');

const promisify = require('es6-promisify');

exports.attemptedLoginDetection = function(req, res, next){
	console.log('User attempting to login...');
	next();
}

exports.validateRegisterUser = (req, res, next) => {
	console.log('REGISTER USER: validating input');

	req.sanitizeBody('name');
	req.checkBody('name', 'You must supply a name').notEmpty();
	req.checkBody('email', 'That email is  not valid').isEmail();
	req.sanitizeBody('email').normalizeEmail({
		remove_dots: false,
		remove_extension: false,
		gmail_remove_subaddress: false
	});

	req.checkBody('password', 'Password cannot be blank').notEmpty();
	req.checkBody('passwordConfirm', 'Confirmed Password Cannot be blank').notEmpty();
	req.checkBody('passwordConfirm', 'Oops! Your passwords do not match').equals(req.body.password);

	const errors = req.validationErrors();  //does all the checks and puts errors into an object

	if(errors){
		console.log(errors);
		var response = {
			api: {
				error: true,
				message: 'Error validating user data',
				errors: errors
			}
		}

		return res.send(response);
	}

	console.log('REGISTER USER: validation complete');

	next();
}

exports.registerUser = async (req, res, next) => {
  console.log('REGISTER USER:');
	console.log('name: ', req.body.name);
	console.log('email: ', req.body.email);

	const user = new User({
		email: req.body.email,
		name: req.body.name,
		hash: req.body.password
	});

	await user.save()
	.then(res => {
		console.log('Created new user: ', res);
		return next();
	})
	.catch(err => {
		console.log('MongoDB error adding user:');
		console.log(err);

		var response = {
			authorized: false,
			api: {
				error: true,
				message: 'Failed to create new user.  Perhaps email already exists'
			}
		}

		console.log('Server response:');
		console.log(response);

		return res.send(response);
	});
}

exports.login = (req, res) => {
	console.log('LOGIN: logging in...');

	if(!req.user || req.user === undefined){

		var response = {
			authorized: false,
			api: {
				error: false,
				message: 'Login error: No user found, username or password does not match'
			}
		}

		console.log('Server Response: ');
		console.log(response);

		return res.send(response);
	}

	if(req.user){
		var response = {
			authorized: true,
			user: req.user,
			api: {
				error: false,
				message: 'User is authorized, proceed to dashboard homepage'
			}
		}

		console.log('LOGIN: SUCCESS');
		console.log('Server Response: ');
		console.log(response);

		return res.send(response);
	}
}

exports.logout = (req, res) => {
	console.log('USER LOGOUT')
	req.logout();

	var response = {
		authorized: false,
		api: {
			error: false,
			message: 'User has logged out'
		}
	}

	res.send(response);
}
