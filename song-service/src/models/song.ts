export default interface Song {
    id?: string,
    title: string,
    author: string,
    authorId: string,
    description?: string | undefined,
    coverURL?: string | undefined,
    createdAt?: string | undefined,
}

