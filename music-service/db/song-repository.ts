//For now the db will remain as internal memory until an external db is added
export type Song = {
    id: string,
    title: string,
    author: string,
    authorId: string,
    description: string | undefined,
    createdAt: string 
}

export class SongRepository {

    private songs: Song[];

    public constructor() {
        this.songs =  [{
            id: '1',
            title: 'title',
            authorId: 'authorId',
            author: 'author',
            createdAt: 'createdAt',
            description: 'description'
        },
        {
            id: '2',
            title: 'title',
            authorId: 'authorId',
            author: 'author',
            createdAt: 'createdAt',
            description: 'description'
        },
        {
            id: '3',
            title: 'title',
            authorId: 'authorId',
            author: 'author',
            createdAt: 'createdAt',
            description: 'description'
        }];
    }

    public getAllSongs() : Song[] {
        return this.songs;
    } 

    public getAllAuthors(): object[] {
        return this.songs.map<object>(song => { 
            return {  'author': song['author'], 'authorId': song['authorId'] }
        });
    }

    public getSong(id: number | string) : Song | undefined {
        id = id.toString();
        return this.songs.find(song => song['id'] === id);
    }

    public getAuthor(id: number | string) : Song | undefined {
        id = id.toString();
        return this.songs.find(song => song['authorId'] === id);
    }

    public searchSong(searchTerm: string) : Song[] {
        return this.songs.filter(song => song['title'].includes(searchTerm) || song['author'].includes(searchTerm));
    }

    public searchAuthors(searchTerm: string): object[] {
        return this.songs
            .filter(song => song['author'].includes(searchTerm))
            .map<object>(song => { 
                return {  'author': song['author'], 'authorId': song['authorId'] }
            });
    }

    public AddSong(newSong : Song): void {
        this.songs.push(newSong);
    }

    public DeleteSong(id: number | string) : void {
        id = id.toString();
        const deletedElementIndex = this.songs.findIndex(song => song['id'] === id);

        if (deletedElementIndex === -1) {
            throw new Error(`No song with id ${id} found`);
        }

        this.songs.splice(deletedElementIndex, 1);
    }
} 