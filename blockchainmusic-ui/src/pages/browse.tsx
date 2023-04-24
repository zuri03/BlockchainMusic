import AppHeader from '../components/appHeader';
import Snippet from '../components/snippet';

export default function Browser() : JSX.Element {
    const isSignedIn = false;
    const desc = 'Some quick example text to build on the card title and make up the bulk of the card\'s content.'

    const submitSearch = function (event : any) {
        event.preventDefault();
        const searchText = event.target[0].value;
        alert(searchText)
    }

    return (
        <div>
            <AppHeader isSignedIn={isSignedIn} />
            <div className='container pt-3'>
                <div className='row justify-content-center my-3'>
                <form className="d-flex" onSubmit={submitSearch} style={{ 'width': '25%' }} role="search">
                    <input className="form-control me-2" type="search" placeholder="Search for a song..." aria-label="Search" />
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
                </div>
                <div className='row'>
                    <div className='col'>
                        <Snippet title={'placeholder'} author={'Author'} description={desc}/>
                    </div>
                    <div className='col'>
                        <Snippet title={'placeholder'} author={'Author'} description={desc}/>
                    </div>
                </div>
            </div>
        </div>
    )
}