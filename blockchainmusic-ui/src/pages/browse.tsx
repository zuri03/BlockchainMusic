import { useState } from 'react';
import AppHeader from '../components/appHeader';
import Snippet from '../components/snippet';

type Song = {
    title: string,
    author: string,
    createdAt: string,
    desciption: string
}

export default function Browse() : JSX.Element {

    let initialState : Song[] = [{
        title: 'title',
        author: 'author',
        createdAt: 'createdAt',
        desciption: 'description'
    },
    {
        title: 'title',
        author: 'author',
        createdAt: 'createdAt',
        desciption: 'description'
    },
    {
        title: 'title',
        author: 'author',
        createdAt: 'createdAt',
        desciption: 'description'
    }];

    const [ music, setMusic ] : [ Song[], React.Dispatch<React.SetStateAction<Song[]>> ]= useState(initialState)

    const GetMusic = async function (searchTerm : string | undefined | null) : Promise<void> {

        const url = searchTerm ? `http://localhost:5000/Music/Search/${searchTerm}` : `http://localhost:5000/Music`
        
        const resposne : Response = await fetch(url)

        if (!resposne.ok) {
            //flash alert
            return;
        }

        const music : Song[] = JSON.parse(await resposne.json())

        setMusic(music)
    }

    const submitSearch = function (event : any) : void {
        event.preventDefault();
        const searchTerm = event.target[0].value;
        GetMusic(searchTerm)
    }

    let musicList : Song[][] = [];
    for (let i = 0; i < music.length; i += 2) {
        let songRow = [ music[i] ]

        if (i + 1 < music.length) {
            songRow.push(music[i + 1])
        }   

        musicList.push(songRow)
    }

    const isSignedIn = false;

    let musicElement : JSX.Element[];

    if (music.length === 0) {
        musicElement = [ <div>No Results</div> ];
    } else {
        musicElement = musicList.map(songRow => {
            let [ firstSong, secondSong ] = songRow;
            //This NEEDS to be fixed
            return (
                <div className='row'>
                    <div className='col-6 my-2'>
                        <Snippet title={firstSong.title} author={firstSong.author} description={firstSong.desciption}/>
                    </div>
                    {secondSong ? <div className='col-6 my-2'><Snippet title={firstSong.title} author={firstSong.author} description={firstSong.desciption}/></div> : <div></div>} 
                </div>
            )
        })
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
                {musicElement}
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