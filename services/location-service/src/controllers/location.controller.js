const locationService = require('../services/location.service');

const findNearbyDonors = async (req, res, next) => {
    try {
        const result = await locationService.findNearbyDonors(req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getDistance = async (req, res, next) => {
    try {
        const { lat1, lon1, lat2, lon2 } = req.body;
        const distance = locationService.calculateDistance(lat1, lon1, lat2, lon2);

        res.json({ distance_km: distance.toFixed(2) });
    } catch (error) {
        next(error);
    }
};

module.exports = { findNearbyDonors, getDistance };