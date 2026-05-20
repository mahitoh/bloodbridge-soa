const sampleDonors = [
    { id: 'donor_1', name: 'Amina Noor', bloodType: 'O+', latitude: -1.2921, longitude: 36.8219, available: true },
    { id: 'donor_2', name: 'Brian Otieno', bloodType: 'A-', latitude: -1.2833, longitude: 36.8167, available: true },
    { id: 'donor_3', name: 'Grace Wanjiku', bloodType: 'O+', latitude: -1.4200, longitude: 36.9500, available: false }
];

const toRadians = (degrees) => degrees * (Math.PI / 180);

const calculateDistanceKm = (from, to) => {
    const earthRadiusKm = 6371;
    const dLat = toRadians(to.latitude - from.latitude);
    const dLon = toRadians(to.longitude - from.longitude);
    const lat1 = toRadians(from.latitude);
    const lat2 = toRadians(to.latitude);

    const a = Math.sin(dLat / 2) ** 2
        + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((earthRadiusKm * c).toFixed(2));
};

const findNearbyDonors = (req, res) => {
    const origin = { latitude: req.body.latitude, longitude: req.body.longitude };
    const donors = sampleDonors
        .filter((donor) => donor.available)
        .filter((donor) => !req.body.bloodType || donor.bloodType === req.body.bloodType)
        .map((donor) => ({
            ...donor,
            distanceKm: calculateDistanceKm(origin, donor)
        }))
        .filter((donor) => donor.distanceKm <= req.body.radiusKm)
        .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json({ donors });
};

const getDistance = (req, res) => {
    res.json({ distanceKm: calculateDistanceKm(req.body.from, req.body.to) });
};

module.exports = { findNearbyDonors, getDistance, calculateDistanceKm };
