const assert = require('assert');
const User = require('../src/user');

describe('Updating records', () => {
    let joe;

    beforeEach((done) => {
        joe = new User({
            name: 'Joe',
            likes: 0,
        });
        joe.save().then(() => done());
    });

    function assertName(operation, done) {
        operation
            .then(() => User.find({}))
            .then((users) => {
                assert(users.length === 1);
                assert(users[0].name === 'Alex');
                done();
            });
    }

    it('instance type using set n save', (done) => {
        joe.set('name', 'Alex');
        assertName(joe.save(), done);
    });

    it('model instance can update', (done) => {
        assertName(joe.updateOne({ name: 'Alex' }), done);
    });

    it('model class can update', (done) => {
        assertName(User.updateMany({ name: 'Joe' }, { name: 'Alex' }), done);
    });

    it('model class can update one record', (done) => {
        assertName(
            User.findOneAndUpdate(
                { name: 'Joe' },
                { name: 'Alex' },
                { useFindAndModify: false }
            ),
            done
        );
    });

    it('model class can find by id and update', (done) => {
        assertName(
            User.findByIdAndUpdate(
                joe._id,
                { name: 'Alex' },
                { useFindAndModify: false }
            ),
            done
        );
    });

    // Skip test, turns into "Pending"
    // xit('user can have their likes incremented by one', (done) => {
    it('user can have their likes incremented by one', (done) => {
        // instance based is easy
        // joe.set('likes', 1);'
        User.updateMany({ name: 'Joe' }, { $inc: { likes: 10 } })
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                assert(user.likes === 10);
                done();
            });
    });
});