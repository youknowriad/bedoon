module.exports = function(resources, mongoose) {

    return {

        /**
         * Get the schema attributes for a resource
         * @param resources
         * @param name
         * @returns {Schema}
         */
        getSchemaAttributes: function(name) {

            if (!resources[name]) {
                throw 'The entity "' + name + '" was not defined';
            }

            var resource = resources[name],
                schemaAttributes = {},
                Schema = mongoose.Schema;

            // Handling simple attributes
            if (resource.schema.attributes) {
                Object.keys(resource.schema.attributes).forEach(function(attributeName) {
                    schemaAttributes[attributeName] = resource.schema.attributes[attributeName];
                });
            }

            // Handling Has Many Relations
            if (resource.schema.hasMany) {
                Object.keys(resource.schema.hasMany).forEach(function(relationName) {
                    var relation = resource.schema.hasMany[relationName];
                    switch (relation.type) {
                        case 'id':
                            schemaAttributes[relationName] = [{type: Schema.Types.ObjectId, ref: relation.target}];
                            break;
                        case 'embed':
                            schemaAttributes[relationName] = [this.getSchema(relation.target)];
                            break;
                        default:
                            throw 'Unknown relation type ' + relation.type;
                    }
                }, this);
            }

            // Handling Has One Relations
            if (resource.schema.hasOne) {
                Object.keys(resource.schema.hasOne).forEach(function(relationName) {
                    var relation = resource.schema.hasOne[relationName];
                    switch (relation.type) {
                        case 'id':
                            schemaAttributes[relationName] = {type: Schema.Types.ObjectId, ref: relation.target};
                            break;
                        case 'embed':
                            schemaAttributes[relationName] = this.getSchemaAttributes(relation.target);
                            break;
                        default:
                            throw 'Unknown relation type ' + relation.type;
                    }
                }, this);
            }

            if (resource.user) {
                schemaAttributes.username = String;
                schemaAttributes.password = String;
            }

            return schemaAttributes;
        },

        /**
         * Build the mongoose schema based on the resource definiation
         * @param resources
         * @param name
         * @returns {Schema}
         */
        getSchema: function(name) {
            return new mongoose.Schema(this.getSchemaAttributes(name));
        }
    }
};

