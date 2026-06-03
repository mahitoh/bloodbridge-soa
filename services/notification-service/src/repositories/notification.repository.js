const notifications = [];

const create = (notification) => {
    notifications.push(notification);
    return notification;
};

const findAll = () => {
    return [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const findById = (id) => {
    return notifications.find((notification) => notification.id === id) || null;
};

module.exports = { create, findAll, findById };