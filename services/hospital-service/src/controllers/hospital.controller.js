const hospitals = [
    {
        id: 'hospital_1',
        name: 'Kenyatta National Hospital',
        email: 'bloodbank@knh.example',
        phone: '+254700000003',
        city: 'Nairobi',
        address: 'Hospital Road',
        latitude: -1.3008,
        longitude: 36.8073
    }
];

const listHospitals = (req, res) => {
    res.json({ hospitals });
};

const getHospital = (req, res) => {
    const hospital = hospitals.find((item) => item.id === req.params.id);
    if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
    res.json({ hospital });
};

const createHospital = (req, res) => {
    const hospital = { id: `hospital_${Date.now()}`, ...req.body };
    hospitals.push(hospital);
    res.status(201).json({ message: 'Hospital created', hospital });
};

const updateHospital = (req, res) => {
    const index = hospitals.findIndex((item) => item.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Hospital not found' });
    hospitals[index] = { ...hospitals[index], ...req.body };
    res.json({ message: 'Hospital updated', hospital: hospitals[index] });
};

module.exports = { listHospitals, getHospital, createHospital, updateHospital, hospitals };
