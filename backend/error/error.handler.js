export class AppError extends Error{
	constructor(message, statusCode){
		super(message);
		this.statusCode = statusCode;
		this.name = "AppError";
		Error.captureStackTrace(this, this.constructor)
	}
}

export class AuthenticationError extends AppError{
	constructor(message = "Authentication error"){
		super(message, 401);
		this.name = "AuthenticationError"; 
	}
}

