module.exports = {
    validate: function (field, data) {
        if (!(data instanceof Date)) {
            return ['the "' + field + '" attribute must be a date' ];
        }
        
        return [];
    }
};
