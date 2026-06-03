require('dotenv').config({ path: '../../.env', quiet: true });

const express = require('express');
const cors = require('cors');
const {
    getDistance,
    isPointWithinRadius
} = require('geolib');

const app = express();
app.use(cors());
app.use(express.json());

const donorLocations = new Map();

const BLOOD_TYPES = new Set(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);
const DEFAULT_RADIUS_KM = 50;
const MAX_RADIUS_KM = 500;

// Recipient blood type -> donor blood types that can safely donate red cells.
const compatibilityChart = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-']
};

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'location-service' });
});

app.post('/location/donor', (req, res) => {
    const { donorId, bloodType } = req.body;
    const point = readPoint(req.body);

    if (!donorId) {
        return res.status(400).json({ error: 'donorId is required' });
    }

    if (!point.valid) {
        return res.status(400).json({ error: point.error });
    }

    if (bloodType !== undefined && bloodType !== null && !BLOOD_TYPES.has(bloodType)) {
        return res.status(400).json({ error: 'bloodType must be one of A+, A-, B+, B-, AB+, AB-, O+, O-' });
    }

    const donorLocation = {
        donorId: String(donorId),
        latitude: point.latitude,
        longitude: point.longitude,
        bloodType: bloodType || null,
        available: req.body.available !== false,
        updatedAt: new Date().toISOString()
    };

    donorLocations.set(donorLocation.donorId, donorLocation);

    res.json({ message: 'Location registered', donorId: donorLocation.donorId });
});

app.get('/location/donor/:donorId', (req, res) => {
    const donor = donorLocations.get(req.params.donorId);

    if (!donor) {
        return res.status(404).json({ error: 'Donor location not found' });
    }

    res.json(donor);
});

app.delete('/location/donor/:donorId', (req, res) => {
    const existed = donorLocations.delete(req.params.donorId);

    if (!existed) {
        return res.status(404).json({ error: 'Donor not found' });
    }

    res.json({ message: 'Donor location removed' });
});

app.post('/location/nearby', (req, res) => {
    const hospitalPoint = readPoint(req.body);

    if (!hospitalPoint.valid) {
        return res.status(400).json({ error: hospitalPoint.error });
    }

    const radiusKm = parseRadiusKm(req.body.radiusKm ?? req.body.radius);
    if (!radiusKm.valid) {
        return res.status(400).json({ error: radiusKm.error });
    }

    if (req.body.bloodType && !BLOOD_TYPES.has(req.body.bloodType)) {
        return res.status(400).json({ error: 'bloodType must be one of A+, A-, B+, B-, AB+, AB-, O+, O-' });
    }

    const radiusMetres = radiusKm.value * 1000;
    const donors = Array.from(donorLocations.values())
        .filter(donor => donor.available)
        .filter(donor => isCompatible(donor.bloodType, req.body.bloodType))
        .filter(donor => isPointWithinRadius(toGeoPoint(donor), hospitalPoint, radiusMetres))
        .map(donor => {
            const distanceMetres = getDistance(toGeoPoint(donor), hospitalPoint);

            return {
                ...donor,
                distanceMetres,
                distanceKm: roundToTwo(distanceMetres / 1000)
            };
        })
        .sort((a, b) => a.distanceMetres - b.distanceMetres);

    res.json({
        hospital: {
            latitude: hospitalPoint.latitude,
            longitude: hospitalPoint.longitude
        },
        bloodType: req.body.bloodType || 'any',
        radiusKm: radiusKm.value,
        totalFound: donors.length,
        donors
    });
});

app.post('/location/distance', (req, res) => {
    const from = readPoint(req.body.from || {});
    const to = readPoint(req.body.to || {});

    if (!from.valid || !to.valid) {
        return res.status(400).json({ error: 'from and to coordinates are required' });
    }

    res.json(distanceResponse(from, to));
});

// Backward-compatible endpoint for existing clients that still call query params.
app.get('/location/distance', (req, res) => {
    const from = readPoint({ latitude: req.query.lat1, longitude: req.query.lng1 });
    const to = readPoint({ latitude: req.query.lat2, longitude: req.query.lng2 });

    if (!from.valid || !to.valid) {
        return res.status(400).json({ error: 'lat1, lng1, lat2 and lng2 are required' });
    }

    res.json(distanceResponse(from, to));
});

function isCompatible(donorBloodType, recipientBloodType) {
    if (!donorBloodType || !recipientBloodType) return true;

    const compatibleDonors = compatibilityChart[recipientBloodType];
    if (!compatibleDonors) return false;

    return compatibleDonors.includes(donorBloodType);
}

function readPoint(source) {
    const latitude = Number(source.latitude ?? source.lat);
    const longitude = Number(source.longitude ?? source.lng);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return { valid: false, error: 'latitude and longitude are required' };
    }

    if (latitude < -90 || latitude > 90) {
        return { valid: false, error: 'latitude must be between -90 and 90' };
    }

    if (longitude < -180 || longitude > 180) {
        return { valid: false, error: 'longitude must be between -180 and 180' };
    }

    return { valid: true, latitude, longitude };
}

function parseRadiusKm(value = DEFAULT_RADIUS_KM) {
    const radiusKm = Number(value);

    if (!Number.isFinite(radiusKm) || radiusKm <= 0) {
        return { valid: false, error: 'radiusKm must be a positive number' };
    }

    if (radiusKm > MAX_RADIUS_KM) {
        return { valid: false, error: `radiusKm must be ${MAX_RADIUS_KM} or less` };
    }

    return { valid: true, value: radiusKm };
}

function toGeoPoint(point) {
    return {
        latitude: point.latitude,
        longitude: point.longitude
    };
}

function distanceResponse(from, to) {
    const distanceMetres = getDistance(from, to);

    return {
        distanceMetres,
        distanceKm: roundToTwo(distanceMetres / 1000),
        distanceMiles: roundToTwo(distanceMetres / 1609.34)
    };
}

function roundToTwo(value) {
    return Number(value.toFixed(2));
}

const PORT = process.env.PORT || 30005;
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Location Service running on port ${PORT}`));
}

module.exports = {
    app,
    donorLocations,
    isCompatible,
    readPoint,
    parseRadiusKm
};
