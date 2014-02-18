module.exports = {
    validate: function (field, data) {
        if (!(data instanceof Date)) {
            var createdDate = new Date(data);
            if (createdDate.toISOString() !== data) {
                return ['the "' + field + '" attribute must be a date' ];
            }
        }
        
        return [];
    }
};
