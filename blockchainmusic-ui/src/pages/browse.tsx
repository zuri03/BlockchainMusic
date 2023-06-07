import { useState, useEffect, useReducer } from 'react';
//import { useFetch } from 'react-async';
import AppHeader from '../components/appHeader';
import Snippet from '../components/snippet';

type Song = {
    title: string,
    author: string,
    createdAt: string,
    desciption: string
}

const SongList = ({ searchTerm } : { searchTerm? : string }) : JSX.Element => {

    /*
    const { data, error } = useFetch<Song[]>(`http://localhost:8888/api/Song`, {
        method: 'GET',
        headers: { accept: "application/json" },
    });

    */
   let initialState : Song[] = [];
   const [loading, setLoading] = useState(true);

   const [ songList, setSongList ] : [ Song[], React.Dispatch<React.SetStateAction<Song[]>>] = useState(initialState);

   const getSongList =  function (searchTerm? : string) : void {

        setLoading(true);

        //alert(searchTerm)

        const url = searchTerm !== '' && searchTerm ? `http://localhost:8888/api/Song/Search/${searchTerm}` : `http://localhost:8888/api/Song`

        //alert(url)

        fetch(url)
            .then(response => {
                console.log(response)
                setLoading(false)
                return response.json()
            })
            .then(json => {
                setSongList(json)
            })
            .catch(err => {
                console.log(err)
            });
    }

    useEffect(() => {
        //alert('use effect')
        getSongList();
    }, [])


    if (loading) {
        return <div>Loading...</div>;
    }

    if (songList.length === 0) {
        return <div>No Results</div>;
    }

    let musicList : Song[][] = [];
    for (let i = 0; i < songList.length; i += 2) {
        let songRow = [ songList[i] ]

        if (i + 1 < songList.length) {
            songRow.push(songList[i + 1])
        }   

        musicList.push(songRow)
    }

    return( 
        <div>
            {musicList.map(songRow => {
                let [ firstSong, secondSong ] = songRow;
                //This NEEDS to be fixed
                return (
                    <div className='row'>
                        <div className='col-6 my-2'>
                            <Snippet title={firstSong.title} author={firstSong.author} description={firstSong.desciption}/>
                        </div>
                        {secondSong ? 
                        <div className='col-6 my-2'>
                            <Snippet title={firstSong.title} author={firstSong.author} description={firstSong.desciption}/>
                        </div> : <div></div>} 
                    </div>
                )
            })}
        </div>
    );
}
export default function Browse() : JSX.Element {

    let initialState : Song[] = [];
    const [ searchTerm, setSearchTerm ] : [ string, React.Dispatch<React.SetStateAction<string>>] = useState('');
    const [ songList, setSongList ] : [ Song[], React.Dispatch<React.SetStateAction<Song[]>>] = useState(initialState);

    const submitSearch = function (event : any) : void {
        event.preventDefault();
        const searchTerm = event.target[0].value;
        setSearchTerm(searchTerm);
    }

    const getSongList =  function (searchTerm? : string) : void {

       // setLoading(true);

        //alert(searchTerm)

        const url = searchTerm !== '' && searchTerm ? `http://localhost:8888/api/Song/Search/${searchTerm}` : `http://localhost:8888/api/Song`

        //alert(url)

        fetch(url)
            .then(response => {
                console.log(response)
                //setLoading(false)
                return response.json()
            })
            .then(json => {
                setSongList(json)
            })
            .catch(err => {
                console.log(err)
            });
    }

    useEffect(() => {
        //alert('use effect')
        getSongList();
    }, [])

    const isSignedIn = false;

    let musicList : Song[][] = [];
    for (let i = 0; i < songList.length; i += 2) {
        let songRow = [ songList[i] ]

        if (i + 1 < songList.length) {
            songRow.push(songList[i + 1])
        }   

        musicList.push(songRow)
    }


    return (
        <div>
            <AppHeader isSignedIn={isSignedIn} />
            <div className='container pt-3'>
                <div className='row justify-content-center my-3'>
                <form className="d-flex" onSubmit={submitSearch} style={{ 'width': '50%' }} role="search">
                    <input className="form-control me-2" type="search" placeholder="Search for a song..." aria-label="Search" />
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
                </div>
                <div>
            {musicList.map(songRow => {
                let [ firstSong, secondSong ] = songRow;
                //This NEEDS to be fixed
                return (
                    <div className='row'>
                        <div className='col-6 my-2'>
                            <Snippet title={firstSong.title} author={firstSong.author} description={firstSong.desciption}/>
                        </div>
                        {secondSong ? 
                        <div className='col-6 my-2'>
                            <Snippet title={firstSong.title} author={firstSong.author} description={firstSong.desciption}/>
                        </div> : <div></div>} 
                    </div>
                )
            })}
        </div>
            </div>
        </div>
    )
}

/*
const isSignedIn = false;
    const desc = 'Some quick example text to build on the card title and make up the bulk of the card\'s content.'  
 <div className='col'>
                        <Snippet title={'placeholder'} author={'Author'} description={desc}/>
                    </div>
                    <div className='col'>
                        <Snippet title={'placeholder'} author={'Author'} description={desc}/>
                    </div>
*/