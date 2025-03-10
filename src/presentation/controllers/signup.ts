import { InvalidParamError, MissingPararmError } from "../errors";

import { badRequest, serverError } from "../helpers/http-helper";

import type {
	Controller,
	EmailValidator,
	HttpRequest,
	HttpResponse,
} from "../protocols";

export class SignUpController implements Controller {
	private readonly emailValidator: EmailValidator;

	constructor(emailValidator: EmailValidator) {
		this.emailValidator = emailValidator;
	}

	handle(httpRequest: HttpRequest): HttpResponse {
		try {
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
		} catch (error) {
			return serverError();
		}
	}
}
