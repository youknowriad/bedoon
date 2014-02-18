module.exports = function (resources) {
    
    var validatorFactory = require('./attribute-validator-factory');
    
    return  {
        validate: function (name, data) {
            var messages = [];
            
            if (resources[name].schema.attributes) {
                Object.keys(resources[name].schema.attributes).forEach(function (field) {
                    if (data[field]) {
                        messages = messages.concat(
                            validatorFactory.getValidator(resources[name].schema.attributes[field]).validate(field, data[field])
                        );
                    }
                }, this);
            }

            if (resources[name].schema.hasMany) {
                Object.keys(resources[name].schema.hasMany).forEach(function (field) {
                    var relation = resources[name].schema.hasMany[field];
                    switch (relation.type) {
                        case 'embed':
                            data[field].forEach(function (subdata) {
                                messages = messages.concat(this.validate(relation.target, subdata).messages);
                            }, this);
                            break;
                        case 'id':
                            data[field].forEach(function (subdata) {
                                messages = messages.concat(validatorFactory.getValidator(String).validate(field, subdata, true));
                            }, this);
                            break;
                        default:
                            throw 'Unknown relation type ' + relation.type;
                    }
                }, this);
            }
            
            if (resources[name].schema.hasOne) {
                Object.keys(resources[name].schema.hasOne).forEach(function (field) {
                    var relation = resources[name].schema.hasOne[field];
                    switch (relation.type) {
                        case 'embed':
                            messages = messages.concat(this.validate(relation.target, data[field]).messages);
                            break;
                        case 'id':
                            messages = messages.concat(validatorFactory.getValidator(String).validate(field, data[field]));
                            break;
                        default:
                            throw 'Unknown relation type ' + relation.type;
                    }
                }, this);
            }

            if (resources[name].user) {
                messages = messages.concat(validatorFactory.getValidator(String).validate('username', data.username));
                if (data.password) {
                    messages = messages.concat(validatorFactory.getValidator(String).validate('password', data.password));
                }
            }
            
            return  {
                valid: messages.length === 0,
                messages: messages
            };
        }
    };
    
};
