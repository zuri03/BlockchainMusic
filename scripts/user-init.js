console.log('MONGO INIT SCRIPT STARTED!')
db.createUser({
    user: encodeURIComponent(process.env.MONGO_USER_SERVICE_USERNAME),
    pwd: encodeURIComponent(process.env.MONGO_USER_SERVICE_PASSWORD),
    roles : [{ role: 'readWrite', db: 'users' }]
});
console.log('MONGO INIT SCRIPT COMPLETE!')