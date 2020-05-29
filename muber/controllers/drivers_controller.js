const Driver = require('../models/driver');

module.exports = {
    greeting(req, res) {
        res.send({ hi: 'there' });
    },

    index(req, res, next) {
        const { lng, lat } = req.query;

        Driver.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)],
                    },
                    distanceField: 'dist.calculated',
                    maxDistance: 200000,
                    spherical: true,
                },
            },
        ])
            .then((drivers) => {
                res.send(drivers);
            })
            .catch(next);
    },

    create(req, res, next) {
        const driverProps = req.body;
        Driver.create(driverProps)
            .then((driver) => res.send(driver))
            .catch(next);
    },

    edit(req, res, next) {
        const driverId = req.params.id;
        const driverProps = req.body;

        Driver.findByIdAndUpdate({ _id: driverId }, driverProps, {
            useFindAndModify: false,
        })
            .then(() => Driver.findById({ _id: driverId }))
            .then((driver) => res.send(driver))
            .catch(next);
    },

    delete(req, res, next) {
        driverId = req.params.id;

        Driver.findByIdAndDelete(driverId)
            .then((driver) => res.send(driver))
            .catch(next);
    },
};
