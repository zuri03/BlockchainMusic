console.log('music-service')

/*
GET: /Music: Gets info on all music available (will need pagination),
GET: /Music/<id>: Gets information for a specific song
GET: /Music/Search/<searchTerm>: Gets all music where the title matches the serach term
POST: /Music: Adds new music to the DB
{
    'title': 'example',
    'author': 'example',
    'cover': <id>,
    'createdAt': <datetime>,
}
DELETE: /Music/<id>: Deletes music from the db

GET: /Author: Gets informaiton on all authors
GET: /Author/<id>: Gets information on a specific artist
GET: /Author/Search/<searchTerm>: Gets info on all artists that match a search term

GET: /Cover/<id>: Gets a song's cover image 

*/