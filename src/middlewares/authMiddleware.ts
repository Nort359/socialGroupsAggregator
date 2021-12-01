import ApiError from '../exceptions/apiError'
import tokenService from '../service/tokenService';
import TokenTypes from '../enums/TokenTypes';

export default function (req, res, next) {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return next(ApiError.UnauthorizedError());
        }

        const [, token] = authorization.split(' ');

        if (!token) {
            return next(ApiError.UnauthorizedError());
        }

        const data = tokenService.validateToken(TokenTypes.Access, token);

        if (!data) {
            return next(ApiError.UnauthorizedError());
        }

        req.user = data;
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
}
