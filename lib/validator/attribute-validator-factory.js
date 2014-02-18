var stringValidator = require('./string-validator'),
    dateValidator   = require('./date-validator'),
    noValidator   = require('./no-validator');

module.exports = {

    getValidator: function (type) {
        switch (type) {
            case String:
                return stringValidator;
            case Date:
                return dateValidator;
            default:
                return noValidator;
        }
    }

};
