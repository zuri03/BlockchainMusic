import Song from '../models/song';

export interface Paging {
    offset: number,
    pageSize: number,
    totalCount: number
}

export interface PaginatedResult {
    paging: Paging,
    data: Song[]
}

export interface SongDB {
    totalDocumentCount(): Promise<number>;
    getSongs(offset?: number, pageSize?: number): Promise<Song[]>;
    getSongByID(songid: string): Promise<Song | undefined>;
    getSongsBySearchTerm(searchTerm: string, offset?: number, pageSize?: number): Promise<Song[]>;
    createSong(title: string, author: string, authorId: string, description?: string): Promise<void>;
    deleteSong(songid: string): Promise<number>;
    updateSong(songid: string, title: string, description?: string): Promise<void>;
}

export interface S3BucketClient {
    uploadCoverFile(file: Express.Multer.File): Promise<string>;
    destroyS3BucketClient(): void;
}