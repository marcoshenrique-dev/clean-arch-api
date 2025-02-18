import { MissingPararmError } from "../errors/missing-param-error";
import { badRequest } from "../helpers/http-helper";
import type { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController {
	handle(httpRequest: HttpRequest): HttpResponse {
		if (!httpRequest.body.name) {
			return badRequest(new MissingPararmError("name"));
		}
		if (!httpRequest.body.email) {
			return badRequest(new MissingPararmError("email"));
		}
		return {
			statusCode: 200,
			body: { message: "tudo certo" },
		};
	}
}
