module.exports = function(config, mongoose) {

    /**
     * Get the schema attributes for a resource
     * @param resources
     * @param name
     * @returns {Schema}
     */
    var getSchemaAttributesForResource = function(resources, name) {

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
                        schemaAttributes[relationName] = [getSchemaForResource(resources, relation.target)];
                        break;
                    default:
                        throw 'Unknown relation type ' + relation.type;
                }
            });
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
                        schemaAttributes[relationName] = getSchemaAttributesForResource(resources, relation.target);
                        break;
                    default:
                        throw 'Unknown relation type ' + relation.type;
                }
            });
        }

        return schemaAttributes;
    };

    /**
     * Build the mongoose schema based on the resource definiation
     * @param resources
     * @param name
     * @returns {Schema}
     */
    var getSchemaForResource = function(resources, name) {
        return new mongoose.Schema(getSchemaAttributesForResource(resources, name));
    };

    var models = {};
    Object.keys(config.resources).forEach(function(name) {
        var resource = config.resources[name];
        if (resource.type === 'document') {
            console.log('Creating Mongo schema for resource "' + name + '"');
            models[name] = mongoose.model(name, getSchemaForResource(config.resources, name));
        }
    });

    return models;
}
