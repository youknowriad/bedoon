module.exports = function(config, mongoose) {

    /**
     * Build the mongoose schema based on the resource definiation
     * @param resources
     * @param name
     * @returns {Schema}
     */
    var getSchemaForResource = function(resources, name) {

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
                schemaAttributes[relationName] = {type: Schema.Types.ObjectId, ref: resource.schema.hasOne[relationName]};
            });
        }

        return new Schema(schemaAttributes);
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
