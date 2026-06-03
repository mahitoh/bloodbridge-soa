const { updateRequestMetrics } = require('../metrics');

const bloodRequests = [
    {
        id: 'request_1',
        hospitalId: 'hospital_1',
        bloodType: 'O+',
        units: 2,
        urgency: 'HIGH',
        city: 'Nairobi',
        status: 'OPEN',
        notes: 'Emergency surgery'
    }
];

const listRequests = (req, res) => {
    res.json({ requests: bloodRequests });
};

const getRequest = (req, res) => {
    const bloodRequest = bloodRequests.find((item) => item.id === req.params.id);
    if (!bloodRequest) return res.status(404).json({ error: 'Blood request not found' });
    res.json({ request: bloodRequest });
};

const createRequest = (req, res) => {
    const bloodRequest = {
        id: `request_${Date.now()}`,
        ...req.body,
        status: 'OPEN',
        createdAt: new Date().toISOString()
    };
    bloodRequests.push(bloodRequest);
    updateRequestMetrics(bloodRequests);
    res.status(201).json({ message: 'Blood request created', request: bloodRequest });
};

const updateStatus = (req, res) => {
    const bloodRequest = bloodRequests.find((item) => item.id === req.params.id);
    if (!bloodRequest) return res.status(404).json({ error: 'Blood request not found' });
    bloodRequest.status = req.body.status;
    updateRequestMetrics(bloodRequests);
    res.json({ message: 'Request status updated', request: bloodRequest });
};

module.exports = { listRequests, getRequest, createRequest, updateStatus, bloodRequests };
