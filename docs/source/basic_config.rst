Resource Config
===============

This page explains how to configure your resources (storage and apis)

Global config object
--------------------

The bedoon configuration object must have a "db" attribute with the url of your mongo database and a resources attribute
which contains all your resources config like this :

.. code-block:: javascript

    var config = {
        db: "mongodb://localhost/mydatabase",
        resources: {
            resource_name: {
                // resource config details
            }
        }
    };

Resource config object
----------------------

A resource have a type ("document" is the default type), and an schema that contains resource attributes, relations ...
A basic resource configuration look like this :

.. code-block:: javascript

    resource_name: {
        type: 'document'
        schema: {
            attributes: {
                attribute1: String,
                attribute2: String
            }
        }
    }

The above resource will create a mongo document called "resource_name" and each record will have two attributes,
"attribute1" and "attribute2" and an auto-generated "_id" attribute. This will also create the following apis :

**Find All**

.. code-block:: bash

    GET /resource_name # To retrieve all the records

response:

.. code-block:: javascript

    {
        status: "success",
        data: [
            {
                _id: "id",
                attribute1: "value",
                attribute2: "value"
            }

            // ...
        ]
    }

**Find One**

.. code-block:: bash

    GET /resource_name/:id # To retrieve a record by its id

response:

.. code-block:: javascript

    {
        status: "success",
        data: {
            _id: "id",
            attribute1: "value",
            attribute2: "value"
        }
    }

**Find Query**

.. code-block:: bash

    GET /resource_name?attribute1=value # To retrieve records with some filters

response:

.. code-block:: javascript

    {
        status: "success",
        data: [
            {
                _id: "id",
                attribute1: "value",
                attribute2: "value"
            }

            // ...
        ]
    }

**Create a record**

.. code-block:: bash

    POST /resource_name # To retrieve a record by its id

request body:

.. code-block:: javascript

    {
        attribute1: "value",
        attribute2: "value"
    }

response:

.. code-block:: javascript

    {
        status: "success",
        data: {
            _id: "id",
            attribute1: "value",
            attribute2: "value"
        }
    }

**Update a record**

.. code-block:: bash

    PUT /resource_name/:id # To retrieve a record by its id

request body:

.. code-block:: javascript

    {
        _id: "id",
        attribute1: "value",
        attribute2: "value"
    }

response:

.. code-block:: javascript

    {
        status: "success",
        data: {
            _id: "id",
            attribute1: "value",
            attribute2: "value"
        }
    }

**Delete a record**

.. code-block:: bash

    DELETE /resource_name/:id # To retrieve a record by its id

