//For now the db will remain as internal memory until an external db is added
export type Song = {
    id: string,
    title: string,
    author: string,
    authorId: string,
    description: string | undefined,
    createdAt: string 
}

const defaultSongList: Song[] = [{
    id: '1',
    title: 'title1',
    authorId: 'authorId',
    author: 'author1',
    createdAt: 'createdAt',
    description: 'description'
},
{
    id: '2',
    title: 'title2',
    authorId: 'authorId',
    author: 'author2',
    createdAt: 'createdAt',
    description: 'description'
},
{
    id: '3',
    title: 'title3',
    authorId: 'authorId',
    author: 'author3',
    createdAt: 'createdAt',
    description: 'description'
}];

export class SongRepository {

    private static instance: SongRepository;

    private songs: Song[];

    private constructor() {
        this.songs =  defaultSongList;
    }

    public static getInstance(): SongRepository {
        if (!SongRepository.instance) {
            SongRepository.instance = new SongRepository();
        }

        return SongRepository.instance;
    }

    public resetRepository(): void {
        this.songs = defaultSongList;
    }
    
    public getAllSongs(): Song[] {
        return this.songs;
    } 

    public getAllAuthors(): object[] {
        return this.songs.map<object>(song => { 
            return {  'author': song['author'], 'authorId': song['authorId'] }
        });
    }

    public getSong(id: number | string): Song | undefined {
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

    public DeleteSong(id: number | string) : Song | undefined {
        id = id.toString();
        const deletedElementIndex = this.songs.findIndex(song => song['id'] === id);

        let deletedSong: Song | undefined;
        if (deletedElementIndex === -1) {
            return deletedSong;
        }

        //at this point we have a garuantee one song will be deleted
        deletedSong = this.songs.splice(deletedElementIndex, 1)[0];

        return deletedSong;
    }
} 