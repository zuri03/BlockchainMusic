interface Song {
    _id: string,
    title: string,
    author: string,
    authorid: string,
    description?: string,
    createdAt: string
}

export default function SongCard({ title, author, description }: Song) {
    return (
        <div className="col-6 my-2">
            <div className="card">
                <img src="./example-cover.png" className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title text-start"><b>{author}</b>: {title}</h5>
                    <p className="card-text text-start" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{description || ''}</p>
                    <a href="#" className="btn app-btn">Download</a>
                </div>
            </div>
        </div>
    )
}