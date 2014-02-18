module.exports = function (serializer, userResourceName, responseHandler) {

    return {

        isAuthenticated: function (req, res, next) {
            if (req.isAuthenticated()) {
                return next();
            }
            res.send(401, JSON.stringify(responseHandler.getErrorResponse(401, 'Authentification required')));
        },

        loggedinUser: function (req, res) {
            var serial = serializer.serialize(userResourceName, req.user);
            res.end(JSON.stringify(responseHandler.getResponse(serial)));
        },

        authenticationFailed: function (req, res) {
            res.send(401, JSON.stringify(responseHandler.getErrorResponse(401, 'Authentification failed')));
        },

        logout: function (req, res) {
            req.logout();
            res.send(200, JSON.stringify(responseHandler.getResponse('logout success')));
        }

    };
};
