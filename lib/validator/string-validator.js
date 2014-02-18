module.exports = {
    validate: function (field, data, array) {
        array = array || false;
        if (!(typeof data === 'string' || data instanceof String)) {
            if (array) {
                return ['the "' + field + '" attribute should only contain string values' ];
            } else {
                return ['the "' + field + '" attribute must be a string' ];
            }
        }
        
        return [];
    }
};
