db.createUser({
    user: encodeURIComponent(process.env.MONGO_USER_SERVICE_USERNAME),
    pwd: encodeURIComponent(process.env.MONGO_USER_SERVICE_PASSWORD),
    roles : [{ role: 'readWrite', db: 'users' }]
});