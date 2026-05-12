const BASE_URL = import.meta.env.VITE_API_URL || 'http://64.225.100.80';

export const API = {
    auth:         `${BASE_URL}:30001`,
    donor:        `${BASE_URL}:30002`,
    hospital:     `${BASE_URL}:30003`,
    request:      `${BASE_URL}:30004`,
    location:     `${BASE_URL}:30005`,
    notification: `${BASE_URL}:30006`,
};
