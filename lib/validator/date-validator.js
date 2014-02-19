module.exports = {
    validate: function (field, data) {
        if (!(data instanceof Date)) {
            try {
                var createdDate = new Date(data);
                if (createdDate.toISOString() !== data) {
                    return ['the "' + field + '" attribute must be a date' ];
                }
            } catch (error) {
                return ['the "' + field + '" attribute must be a date' ];
            }
        }
        
        return [];
    }
};
