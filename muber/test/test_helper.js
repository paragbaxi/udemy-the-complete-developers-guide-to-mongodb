const mongoose = require('mongoose');

before((done) => {
    mongoose.connect('mongodb://localhost/muber_test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    mongoose.connection
        .once('open', () => done())
        .on('error', (error) => {
            console.warn('Warning', error);
        });
});

beforeEach((done) => {
    const { drivers } = mongoose.connection.collections;
    drivers
        .drop()
        .then(() => drivers.ensureIndex({ 'geometry.coordinates': '2dsphere' }))
        .then(() => done())
        .catch(() => done()); // in case we try to drop an empty db
});
