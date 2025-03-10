import { InvalidParamError, MissingPararmError, ServerError } from "../errors";

import type { EmailValidator } from "../protocols";

import { SignUpController } from "./signup";

interface SutTypes {
	sut: SignUpController;
	emailValidatorStub: EmailValidator;
}

const makeEmailValidator = (): EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid(email: string): boolean {
			return true;
		}
	}

	return new EmailValidatorStub();
};

const makeEmailValidatorWithError = (): EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid(email: string): boolean {
			throw new Error();
		}
	}

	return new EmailValidatorStub();
};

const makeSut = (): SutTypes => {
	const emailValidatorStub = makeEmailValidator();

	const sut = new SignUpController(emailValidatorStub);

	return {
		sut,
		emailValidatorStub,
	};
};

describe("SignUp Controller", () => {
	test("Should return 400 if no name is provided", () => {
		const { sut } = makeSut(); // system under testing
		const httpRequest = {
			body: {
				email: "any_email@gmail.com",
				password: "any_password",
				passwordConfirmation: "any_password",
			},
		};
		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingPararmError("name"));
	});
	test("Should return 400 if no email is provided", () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "any_name",
				password: "any_password",
				passwordConfirmation: "any_password",
			},
		};
		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingPararmError("email"));
	});

	test("Should return 400 if no password is provided", () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "any_name",
				email: "any_email@gmail.com",
				passwordConfirmation: "any_password",
			},
		};
		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingPararmError("password"));
	});

	test("Should return 400 if no passwordConfirmation is provided", () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "any_name",
				email: "any_email@gmail.com",
				password: "any_password",
			},
		};
		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(
			new MissingPararmError("passwordConfirmation"),
		);
	});

	test("Should return 400 if an invalid email is provided", () => {
		const { sut, emailValidatorStub } = makeSut();

		jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

		const httpRequest = {
			body: {
				name: "any_name",
				email: "invalid_email@gmail.com",
				password: "any_password",
				passwordConfirmation: "any_password",
			},
		};
		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new InvalidParamError("email"));
	});

	test("Should call email validator with correct email", () => {
		const { sut, emailValidatorStub } = makeSut();

		const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");

		const httpRequest = {
			body: {
				name: "any_name",
				email: "any_email@gmail.com",
				password: "any_password",
				passwordConfirmation: "any_password",
			},
		};
		sut.handle(httpRequest);
		expect(isValidSpy).toHaveBeenCalledWith("any_email@gmail.com");
	});

	test("Should return 500 if email validator throws", () => {
		const emailValidatorStub = makeEmailValidatorWithError();
		const sut = new SignUpController(emailValidatorStub);

		const httpRequest = {
			body: {
				name: "any_name",
				email: "any_email@gmail.com",
				password: "any_password",
				passwordConfirmation: "any_password",
			},
		};
		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toEqual(new ServerError());
	});
});
