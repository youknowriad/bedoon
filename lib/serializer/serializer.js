module.exports = function(resources, passwordHandler) {

    return  {

        hydrate: function(name, document, data) {
            if (resources[name].schema.attributes) {
                Object.keys(resources[name].schema.attributes).forEach(function(field) {
                    document[field] = data[field];
                });
            }

            if (resources[name].schema.hasMany) {
                Object.keys(resources[name].schema.hasMany).forEach(function(field) {
                    var relation = resources[name].schema.hasMany[field];
                    switch (relation.type) {
                        case 'embed':
                            var subdocuments = [];
                            data[field].forEach(function(subdata) {
                                var subdocument = document[field].create();
                                this.hydrate(relation.target, subdocument, subdata);
                                subdocuments.push(subdocument);
                            }, this);
                            document[field] = subdocuments;
                            break;
                        case 'id':
                            document[field] = data[field];
                            break;
                        default:
                            throw 'Unknown relation type ' + relation.type;
                    }
                }, this);
            }

            if (resources[name].schema.hasOne) {
                Object.keys(resources[name].schema.hasOne).forEach(function(field) {
                    var relation = resources[name].schema.hasOne[field];
                    switch (relation.type) {
                        case 'embed':
                            var subdocument = document[field];
                            this.hydrate(relation.target, subdocument, data[field]);
                            document[field] = subdocument;
                            break;
                        case 'id':
                            document[field] = data[field];
                            break;
                        default:
                            throw 'Unknown relation type ' + relation.type;
                    }
                }, this);
            }

            if (resources[name].user) {
                document.username = data.username;
                if (data.password) {
                    document.password = passwordHandler.crypt(data.password);
                }
            }
        },

        serialize: function(name, document, withPrimaryKey) {
            var serial = {},
                withPrimaryKey = withPrimaryKey === undefined ? true : withPrimaryKey;

            if (withPrimaryKey) {
                serial._id = document._id;
            }

            if (resources[name].schema.attributes) {
                Object.keys(resources[name].schema.attributes).forEach(function(field) {
                    serial[field] = document[field];
                });
            }

            if (resources[name].schema.hasMany) {
                Object.keys(resources[name].schema.hasMany).forEach(function(field) {
                    var relation = resources[name].schema.hasMany[field];
                    switch (relation.type) {
                        case 'embed':
                            var subserials = [];
                            document[field].forEach(function(subdocument) {
                                subserials.push(this.serialize(relation.target, subdocument, false));
                            }, this);
                            serial[field] = subserials;
                            break;
                        case 'id':
                            serial[field] = document[field];
                            break;
                        default:
                            throw 'Unknown relation type ' + relation.type;
                    }
                }, this);
            }

            if (resources[name].schema.hasOne) {
                Object.keys(resources[name].schema.hasOne).forEach(function(field) {
                    var relation = resources[name].schema.hasOne[field];
                    switch (relation.type) {
                        case 'embed':
                            serial[field] = this.serialize(relation.target, document[field], false);
                            break;
                        case 'id':
                            serial[field] = document[field];
                            break;
                        default:
                            throw 'Unknown relation type ' + relation.type;
                    }
                }, this);
            }

            if (resources[name].user) {
                serial.username = document.username;
            }

            return serial;
        }

    }
};
