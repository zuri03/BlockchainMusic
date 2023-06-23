import Song from './song';

export interface Paging {
    offset: number,
    pageSize: number,
    totalCount: number
}

export interface PaginatedResult {
    paging: Paging,
    data: Song[]
}