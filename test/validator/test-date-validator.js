var validator = require('../../lib/validator/date-validator');

exports['validate'] = function (test) {
    test.expect(2);
    test.deepEqual(validator.validate('field', 'test'), ['the "field" attribute must be a date']);
    test.deepEqual(validator.validate('field', new Date('10/12/2014')), []);
    test.done();
};

