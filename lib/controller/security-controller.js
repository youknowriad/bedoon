module.exports = function(serializer, userResourceName) {

    return {

        isAuthenticated: function (req, res, next) {
            if (req.isAuthenticated()) {
                return next();
            }
            res.send(401, { error: 'Authentification required' });
        },

        loggedinUser: function (req, res) {
            var serial = serializer.serialize(userResourceName, req.user);
            res.end(JSON.stringify(serial));
        },

        authenticationFailed: function (req, res) {
            res.send(401, { error: 'Authentification failed' });
        },

        logout: function(req, res){
            req.logout();
            res.send(200, 'logout success');
        }

    };
};
