import { InvalidParamError } from "../errors/invalid-param-error";
import { MissingPararmError } from "../errors/missing-param-error";
import { badRequest } from "../helpers/http-helper";

import type { Controller } from "../protocols/controller";
import type { EmailValidator } from "../protocols/email-validator";
import type { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController implements Controller {
	private readonly emailValidator: EmailValidator;

	constructor(emailValidator: EmailValidator) {
		this.emailValidator = emailValidator;
	}

	handle(httpRequest: HttpRequest): HttpResponse {
		const requiredFields = [
			"name",
			"email",
			"password",
			"passwordConfirmation",
		];

		for (const field of requiredFields) {
			if (!httpRequest.body[field]) {
				return badRequest(new MissingPararmError(field));
			}
		}

		const isValidEmail = this.emailValidator.isValid(httpRequest.body.email);

		if (!isValidEmail) {
			return badRequest(new InvalidParamError("email"));
		}

		return {
			statusCode: 200,
			body: { message: "tudo certo" },
		};
	}
}
