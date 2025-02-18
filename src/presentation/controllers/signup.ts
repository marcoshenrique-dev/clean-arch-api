import { MissingPararmError } from "../errors/missing-param-error";
import { badRequest } from "../helpers/http-helper";

import type { Controller } from "../protocols/controller";
import type { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController implements Controller {
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

		return {
			statusCode: 200,
			body: { message: "tudo certo" },
		};
	}
}
