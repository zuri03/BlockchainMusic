db.createUser({
    user: encodeURIComponent(process.env.MONGO_MUSIC_SERVICE_USERNAME),
    pwd: encodeURIComponent(process.env.MONGO_MUSIC_SERVICE_PASSWORD),
    roles : [{ role: 'readWrite', db: 'songs' }]
});

const now = new Date().toISOString();

db.songs.insertMany([
    {
        title: 'song title 1',
        author: 'song title 1',
        authorId: 'authorID1',
        desciption: 'song title 1',
        createdAt: now
    },
    {
        title: 'new title 1',
        author: 'song title 1',
        authorId: 'authorID1',
        createdAt: now
    },
    {
        title: 'song title 2',
        author: 'newArtist',
        authorId: 'newArtistId',
        desciption: 'Brand new description',
        createdAt: now
    },
    {
        title: 'song title 3',
        author: 'song title 1',
        authorId: 'authorID1',
        createdAt: now
    },
]);