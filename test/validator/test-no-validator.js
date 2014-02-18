var validator = require('../../lib/validator/no-validator');

exports['validate'] = function (test) {
    test.expect(1);
    test.deepEqual(validator.validate('test'), []);
    test.done();
};

