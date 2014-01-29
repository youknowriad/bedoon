Getting started
===============

Requirements
------------
* `nodejs <http://nodejs.org/>`_
* `mongodb <http://www.mongodb.org/>`_

Quick start
-----------
A simple bedoon application looks like this

.. code-block:: javascript

    // Loading Config
    var Bedoon = require("bedoon");

    var config = {
        db: 'mongodb://localhost/mydatabase',
        resources: {

            post: {
                type: 'document',
                schema: {
                    attributes: {
                        title: String,
                        content: String
                    }
                }
            }

        }
    }

    var bedoon = new Bedoon(config);
    var port = 3700;
    console.log("Listening on port " + port);
    bedoon.app.listen(port);

And then run your application

.. code-block:: bash

    $ node example.js
    Listnening on port 3700

And this will automatically generate for you different json apis for handling posts

.. code-block:: bash

    GET    /post        # to get all your posts
    GET    /post/:id    # to get a post by id
    POST   /post        # to create a new post
    PUT    /post/:id    # to update an existing post
    DELETE /post/:id    # to delete a post

