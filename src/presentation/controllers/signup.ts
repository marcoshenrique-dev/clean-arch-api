import { MissingPararmError } from "../errors/missing-param-error";
import type { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController {
	handle(httpRequest: HttpRequest): HttpResponse {
		if (!httpRequest.body.name) {
			return {
				statusCode: 400,
				body: new MissingPararmError("name"),
			};
		}
		if (!httpRequest.body.email) {
			return {
				statusCode: 400,
				body: new MissingPararmError("email"),
			};
		}
		return {
			statusCode: 200,
			body: { message: "tudo certo" },
		};
	}
}
