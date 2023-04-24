import cover from './../example-cover.png'
export default function Snippet({ title, author, description }: { title: string, author: string, description: string | undefined}) : JSX.Element {
    return (
        <div className='card'>
            <img src={cover} className="card-img-top" alt="..." />
            <div className="card-body">
                <h5 className="card-title text-start"><b>{author}</b>: {title}</h5>
                <p className="card-text text-start">{description}</p>
                <a href="#" className="btn btn-success">Download</a>
            </div>
        </div>
    )
}