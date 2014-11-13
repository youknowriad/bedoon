module.exports = function (serializer, userResourceName, responseHandler) {

    return {

        isAuthenticated: function (req, res, next) {
            if (req.isAuthenticated()) {
                return next();
            }
            res.status(401).send(responseHandler.getErrorResponse(401, 'Authentification required'));
        },

        loggedinUser: function (req, res) {
            var serial = serializer.serialize(userResourceName, req.user);
            res.send(responseHandler.getResponse(serial));
        },

        authenticationFailed: function (req, res) {
            res.status(401).send(responseHandler.getErrorResponse(401, 'Authentification failed'));
        },

        logout: function (req, res) {
            req.logout();
            res.status(200).send(responseHandler.getResponse('logout success'));
        }

    };
};
