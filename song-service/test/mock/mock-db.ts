import { SongDB } from '../../src/types/app-types';
import Song from '../../src/models/song';
import { ObjectId } from 'mongodb';

export default class MockDB implements SongDB {
    private songs: Song[];

    constructor(initialSongs?: Song[]) {
        if (initialSongs) {
            this.songs = [ ...initialSongs ];
        } else {
            this.songs = []
        }
    }

    totalDocumentCount(): number {
        return this.songs.length;
    }
    
    async getSongs(offset?: number, pageSize?: number): Promise<Song[]> {
        const start: number = offset || 0;
        const end: number = pageSize && offset ? pageSize + offset : start + 10;

        return this.songs.slice(start, end);
    }

    async getSongByID(songid: string): Promise<Song | undefined> {
        return this.songs.find(song => song['id']?.equals(new ObjectId(songid)));
    }

    async getSongsBySearchTerm(searchTerm: string, offset?: number, pageSize?: number): Promise<Song[]> {
        const start: number = offset || 0;
        const end: number = pageSize && offset ? pageSize + offset : start + 10;

        return this.songs.filter(song => song['title'].includes(searchTerm))
            .slice(start, end)
    }

    async createSong(title: string, author: string, authorId: string, description?: string): Promise<void> {
        const song: Song = {
            id: new ObjectId(),
            title,
            author,
            authorId,
            createdAt: new Date().toISOString()
        }

        if (description) {
            song.description = description;
        }

        this.songs.push(song);
    }

    async deleteSong(songid: string): Promise<number> {
        const deletedElementIndex = this.songs.findIndex(song => song['id']?.equals(new ObjectId(songid)));
        if (deletedElementIndex === -1) {
            return 0;
        }
        this.songs.splice(deletedElementIndex, 1)[0];

        return 1;
    }

    async updateSong(songid: string, title: string, description?: string): Promise<void> {
        const index = this.songs.findIndex(song => song['id']?.equals(new ObjectId(songid)));

        const originalSong = this.songs[index];
        originalSong.title = title;
        originalSong.description = description;
        
        this.songs[index] = originalSong;
    }

    resetData(songs?: Song[]): void {
        if (songs) {
            this.songs = [ ...songs ];
        } else {
            this.songs = []
        }
    }
}