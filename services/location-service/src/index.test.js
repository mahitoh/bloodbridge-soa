const request = require('supertest');
const {
    app,
    donorLocations,
    isCompatible,
    parseRadiusKm,
    readPoint
} = require('./index');

beforeEach(() => {
    donorLocations.clear();
});

describe('Location Service', () => {
    describe('GET /health', () => {
        test('returns healthy status', async () => {
            const res = await request(app).get('/health');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ status: 'healthy', service: 'location-service' });
        });
    });

    describe('POST /location/donor', () => {
        test('registers a donor location', async () => {
            const res = await request(app)
                .post('/location/donor')
                .send({
                    donorId: 'd1',
                    latitude: 3.848,
                    longitude: 11.502,
                    bloodType: 'O+',
                    available: true
                });

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Location registered', donorId: 'd1' });
            expect(donorLocations.get('d1')).toMatchObject({
                donorId: 'd1',
                latitude: 3.848,
                longitude: 11.502,
                bloodType: 'O+',
                available: true
            });
        });

        test('accepts lat/lng aliases for existing clients', async () => {
            const res = await request(app)
                .post('/location/donor')
                .send({ donorId: 'd1', lat: 3.848, lng: 11.502 });

            expect(res.status).toBe(200);
            expect(donorLocations.get('d1')).toMatchObject({
                latitude: 3.848,
                longitude: 11.502
            });
        });

        test('updates an existing donor location', async () => {
            await request(app)
                .post('/location/donor')
                .send({ donorId: 'd1', latitude: 3.848, longitude: 11.502 });

            const res = await request(app)
                .post('/location/donor')
                .send({ donorId: 'd1', latitude: 4.0, longitude: 11.6, available: false });

            expect(res.status).toBe(200);
            expect(donorLocations.get('d1')).toMatchObject({
                latitude: 4.0,
                longitude: 11.6,
                available: false
            });
        });

        test('fails without donorId', async () => {
            const res = await request(app)
                .post('/location/donor')
                .send({ latitude: 3.848, longitude: 11.502 });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('donorId is required');
        });

        test('fails with invalid coordinates', async () => {
            const res = await request(app)
                .post('/location/donor')
                .send({ donorId: 'd1', latitude: 95, longitude: 11.502 });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('latitude must be between -90 and 90');
        });

        test('fails with unknown blood type', async () => {
            const res = await request(app)
                .post('/location/donor')
                .send({ donorId: 'd1', latitude: 3.848, longitude: 11.502, bloodType: 'X+' });

            expect(res.status).toBe(400);
            expect(res.body.error).toContain('bloodType must be one of');
        });
    });

    describe('GET /location/donor/:donorId', () => {
        test('returns donor location', async () => {
            await request(app)
                .post('/location/donor')
                .send({ donorId: 'd1', latitude: 3.848, longitude: 11.502 });

            const res = await request(app).get('/location/donor/d1');

            expect(res.status).toBe(200);
            expect(res.body.donorId).toBe('d1');
        });

        test('returns 404 for unknown donor', async () => {
            const res = await request(app).get('/location/donor/unknown');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Donor location not found');
        });
    });

    describe('DELETE /location/donor/:donorId', () => {
        test('removes a donor location', async () => {
            await request(app)
                .post('/location/donor')
                .send({ donorId: 'd1', latitude: 3.848, longitude: 11.502 });

            const res = await request(app).delete('/location/donor/d1');

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Donor location removed');
            expect(donorLocations.has('d1')).toBe(false);
        });

        test('returns 404 for unknown donor', async () => {
            const res = await request(app).delete('/location/donor/unknown');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Donor not found');
        });
    });

    describe('POST /location/nearby', () => {
        beforeEach(async () => {
            await request(app)
                .post('/location/donor')
                .send({ donorId: 'd1', latitude: 3.848, longitude: 11.502, bloodType: 'O+', available: true });
            await request(app)
                .post('/location/donor')
                .send({ donorId: 'd2', latitude: 3.86, longitude: 11.51, bloodType: 'A+', available: true });
            await request(app)
                .post('/location/donor')
                .send({ donorId: 'd3', latitude: 4.5, longitude: 12.0, bloodType: 'O+', available: false });
            await request(app)
                .post('/location/donor')
                .send({ donorId: 'd4', latitude: 3.849, longitude: 11.503, bloodType: 'AB+', available: true });
        });

        test('finds nearby available donors', async () => {
            const res = await request(app)
                .post('/location/nearby')
                .send({ latitude: 3.85, longitude: 11.505, radiusKm: 5 });

            expect(res.status).toBe(200);
            expect(res.body.totalFound).toBe(3);
            expect(res.body.donors.every(donor => donor.available)).toBe(true);
        });

        test('filters by compatible donor blood type', async () => {
            const res = await request(app)
                .post('/location/nearby')
                .send({ latitude: 3.85, longitude: 11.505, bloodType: 'O+', radiusKm: 5 });

            expect(res.status).toBe(200);
            expect(res.body.donors.map(donor => donor.donorId)).toEqual(['d1']);
        });

        test('returns universal O- donor for AB+ recipient', async () => {
            await request(app)
                .post('/location/donor')
                .send({ donorId: 'd5', latitude: 3.851, longitude: 11.506, bloodType: 'O-', available: true });

            const res = await request(app)
                .post('/location/nearby')
                .send({ latitude: 3.85, longitude: 11.505, bloodType: 'AB+', radiusKm: 5 });

            expect(res.status).toBe(200);
            expect(res.body.donors.map(donor => donor.donorId)).toEqual(['d5', 'd4', 'd1', 'd2']);
        });

        test('excludes unavailable donors even when radius is large', async () => {
            const res = await request(app)
                .post('/location/nearby')
                .send({ latitude: 3.85, longitude: 11.505, radiusKm: 200 });

            expect(res.body.donors.some(donor => donor.donorId === 'd3')).toBe(false);
        });

        test('sorts donors by distance', async () => {
            const res = await request(app)
                .post('/location/nearby')
                .send({ latitude: 3.85, longitude: 11.505, radiusKm: 5 });

            const distances = res.body.donors.map(donor => donor.distanceMetres);
            expect(distances).toEqual([...distances].sort((a, b) => a - b));
        });

        test('returns empty when no donors are in radius', async () => {
            const res = await request(app)
                .post('/location/nearby')
                .send({ latitude: 0, longitude: 0, radiusKm: 1 });

            expect(res.status).toBe(200);
            expect(res.body.totalFound).toBe(0);
            expect(res.body.donors).toEqual([]);
        });

        test('fails without coordinates', async () => {
            const res = await request(app)
                .post('/location/nearby')
                .send({ bloodType: 'O+' });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('latitude and longitude are required');
        });

        test('fails with invalid radius', async () => {
            const res = await request(app)
                .post('/location/nearby')
                .send({ latitude: 3.85, longitude: 11.505, radiusKm: 0 });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('radiusKm must be a positive number');
        });
    });

    describe('POST /location/distance', () => {
        test('calculates distance between two points', async () => {
            const res = await request(app)
                .post('/location/distance')
                .send({
                    from: { latitude: 3.848, longitude: 11.502 },
                    to: { latitude: 3.86, longitude: 11.51 }
                });

            expect(res.status).toBe(200);
            expect(res.body.distanceMetres).toBeGreaterThan(0);
            expect(res.body.distanceKm).toBeGreaterThan(0);
            expect(res.body.distanceMiles).toBeGreaterThan(0);
        });

        test('fails without from or to', async () => {
            const res = await request(app)
                .post('/location/distance')
                .send({ from: { latitude: 3.848, longitude: 11.502 } });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('from and to coordinates are required');
        });
    });

    describe('GET /location/distance', () => {
        test('supports legacy query-param distance calls', async () => {
            const res = await request(app)
                .get('/location/distance')
                .query({ lat1: 3.848, lng1: 11.502, lat2: 3.86, lng2: 11.51 });

            expect(res.status).toBe(200);
            expect(res.body.distanceKm).toBeGreaterThan(0);
        });

        test('fails without all query params', async () => {
            const res = await request(app)
                .get('/location/distance')
                .query({ lat1: 3.848, lng1: 11.502 });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('lat1, lng1, lat2 and lng2 are required');
        });
    });

    describe('blood compatibility', () => {
        test('O- donor is compatible with all recipients', () => {
            const types = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

            types.forEach(type => expect(isCompatible('O-', type)).toBe(true));
        });

        test('AB+ donor can only donate to AB+', () => {
            expect(isCompatible('AB+', 'AB+')).toBe(true);
            expect(isCompatible('AB+', 'A+')).toBe(false);
        });

        test('returns true when blood type is unknown', () => {
            expect(isCompatible(null, 'O+')).toBe(true);
            expect(isCompatible('O+', null)).toBe(true);
        });

        test('returns false for invalid recipient blood type', () => {
            expect(isCompatible('O+', 'X+')).toBe(false);
        });
    });

    describe('helpers', () => {
        test('validates longitude range', () => {
            expect(readPoint({ latitude: 3.848, longitude: 200 })).toEqual({
                valid: false,
                error: 'longitude must be between -180 and 180'
            });
        });

        test('limits search radius', () => {
            expect(parseRadiusKm(501)).toEqual({
                valid: false,
                error: 'radiusKm must be 500 or less'
            });
        });
    });
});
