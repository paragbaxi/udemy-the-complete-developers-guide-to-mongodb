const assert = require('assert');
const User = require('../src/user');

describe('Validating records', () => {
    it('requires a user name', () => {
        const user = new User({ name: undefined });
        const validationResult = user.validateSync();
        const { message } = validationResult.errors.name;
        assert(message === User.schema.obj.name.required[1]);
    });

    it("requires a user's name longer than 2 characters", () => {
        const user = new User({ name: 'Al' });
        const validationResult = user.validateSync();
        const { message } = validationResult.errors.name;
        assert(message === User.schema.obj.name.validate.message);
    });

    it('disallows invalid records from being saved', (done) => {
        const user = new User({ name: 'Al' });
        user.save().catch((validationResult) => {
            const { message } = validationResult.errors.name;
            assert(message === User.schema.obj.name.validate.message);
            done();
        });
    });
});