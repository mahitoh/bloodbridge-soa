const pool = require('../config/db');
const redis = require('../config/redis');

const toRadians = (degrees) => degrees * (Math.PI / 180);

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const earthRadiusKm = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) ** 2;

    return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const findNearbyDonors = async ({ latitude, longitude, radius, blood_type }) => {
    const cacheKey = `nearby:${latitude}:${longitude}:${radius}:${blood_type || 'all'}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
        return { donors: JSON.parse(cached), source: 'cache' };
    }

    const params = [blood_type].filter(Boolean);
    const bloodTypeFilter = blood_type ? 'AND blood_type = $1' : '';

    const result = await pool.query(
        `
            SELECT id, name, blood_type, phone, city, latitude, longitude, available
            FROM donors
            WHERE available = true
            ${bloodTypeFilter}
        `,
        params
    );

    const donors = result.rows
        .filter((donor) => donor.latitude !== null && donor.longitude !== null)
        .map((donor) => ({
            ...donor,
            distance: Number(
                calculateDistance(
                    latitude,
                    longitude,
                    Number(donor.latitude),
                    Number(donor.longitude)
                ).toFixed(2)
            )
        }))
        .filter((donor) => donor.distance <= radius)
        .sort((a, b) => a.distance - b.distance);

    await redis.set(cacheKey, JSON.stringify(donors), 'EX', 60);

    return { donors, source: 'database' };
};

module.exports = { calculateDistance, findNearbyDonors };