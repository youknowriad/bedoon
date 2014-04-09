Relations Config
================

Bedoon can handle different sort of relations between resources : has many relations and has one relations.
Each relation type has different strategies that alter the storage and the object contents.

Id Strategy
-----------

With this strategy, the related resources are stored in separated documents, and the relation is materialized by referencing
the id of the child object in the parent one (or an array of ids in the case of hasMany relations)

**example**

.. code-block:: javascript

    var config = {
        db: "mongodb://localhost/mydatabase"
        resources: {
            user: {
                type: "document",
                schema: {
                    attributes: {
                        username: String,
                        name: String
                    }
                }
            },

            post: {
                type: "document",
                schema: {
                    attributes: {
                        title: String
                    },
                    hasMany: {
                        comments: {type: "id", target: "comment"},
                        author: {type: "id", target: "user"}
                    }
                }
            },

            comment: {
                type: "document",
                schema: {
                    attributes: {
                        message: String
                    }
                }
            }
        }
    }

With this configuration a post record will look like this

**example**

.. code-block:: javascript

    {
        title: "post title",
        comments: ["id_comment1", "id_comment2"],
        author: "id_user"
    }

Embed Strategy
--------------

With this strategy, the child resources are stored inside the parent document, and the relation is materialized by embedding
the child object in the parent one (or an array of child objects in the case of hasMany relations)

**example**

.. code-block:: javascript

    var config = {
        db: "mongodb://localhost/mydatabase"
        resources: {
            user: {
                type: "embed",
                schema: {
                    attributes: {
                        username: String,
                        name: String
                    }
                }
            },

            post: {
                type: "document",
                schema: {
                    attributes: {
                        title: String
                    },
                    hasMany: {
                        comments: {type: "embed", target: "comment"},
                        author: {type: "embed", target: "user"}
                    }
                }
            },

            comment: {
                type: "embed",
                schema: {
                    attributes: {
                        message: String
                    }
                }
            }
        }
    }

With this configuration a post record will look like this.. code-block:: javascript

.. code-block:: javascript

    {
        title: "post title",
        comments: [
            {
                message: "message comment 1"
            },
            {
                message: "message comment 2"
            }
            // ...
        ],
        author: {
            username: "username value",
            name: "name"
        }
    }

Note that the user and comment resource have a type "embed", this avoid creating APIs for these resources.
