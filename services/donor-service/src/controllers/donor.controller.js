const donors = [
    {
        id: 'donor_1',
        name: 'Amina Noor',
        bloodType: 'O+',
        phone: '+254700000001',
        city: 'Nairobi',
        latitude: -1.2921,
        longitude: 36.8219,
        available: true
    }
];

const listDonors = (req, res) => {
    res.json({ donors });
};

const getDonor = (req, res) => {
    const donor = donors.find((item) => item.id === req.params.id);
    if (!donor) return res.status(404).json({ error: 'Donor not found' });
    res.json({ donor });
};

const createDonor = (req, res) => {
    const donor = { id: `donor_${Date.now()}`, ...req.body };
    donors.push(donor);
    res.status(201).json({ message: 'Donor created', donor });
};

const updateAvailability = (req, res) => {
    const donor = donors.find((item) => item.id === req.params.id);
    if (!donor) return res.status(404).json({ error: 'Donor not found' });
    donor.available = req.body.available;
    res.json({ message: 'Availability updated', donor });
};

module.exports = { listDonors, getDonor, createDonor, updateAvailability, donors };
