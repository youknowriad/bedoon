var responseHandler = require('../../lib/utils/response-handler');

exports['response success'] = function (test) {
    test.expect(1);

    test.deepEqual(responseHandler.getResponse('response'), {
        status: responseHandler.STATUS_SUCCESS,
        data: 'response'
    });

    test.done();
};

exports['response error'] = function (test) {
    test.expect(1);

    test.deepEqual(responseHandler.getErrorResponse(500, 'error'), {
        status: responseHandler.STATUS_ERROR,
        message: 'error',
        code: 500
    });

    test.done();
};
