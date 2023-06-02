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

    public GetAllSongs() : Song[] {
        return this.songs;
    } 

    public GetSong(id: number | string) : Song | undefined {
        id = id.toString();
        return this.songs.find(song => song['id'] === id);
    }

    public searchSong(searchTerm: string) : Song[] {
        return this.songs.filter(song => song['title'].includes(searchTerm) || song['author'].includes(searchTerm));
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