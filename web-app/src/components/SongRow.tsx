import SongCard from './SongCard';

interface Song {
    _id: string,
    title: string,
    author: string,
    authorid: string,
    description?: string,
    createdAt: string
}

export default function SongRow(songs: Song[]) {
    return (
        <div className='row'>
            <SongCard {...songs[0]} />
            {songs[1] ? <SongCard {...songs[1]} /> : <></>}
        </div>
    )
}