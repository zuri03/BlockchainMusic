import { useState, useEffect } from 'react';
import SongRow from '../components/SongRow';
import SongPaginator from '../components/SongPaginator';

interface Song {
    _id: string,
    title: string,
    author: string,
    authorid: string,
    description?: string,
    createdAt: string
}

interface Paging {
    offset: number,
    pageSize: number,
    totalCount: number
}

export default function Browse() {
    const [ songs, setSongs ] = useState<Song[]>([]);
    //TODO: set initial value for paging
    const [ paging, setPaging ] = useState<Paging>({ offset: 0, pageSize: 10, totalCount: 100 });

    useEffect(() => {
        showLoader();
        fetchData()
            .then(result =>  {
                setSongs(result.data as Song[])
                setPaging(result.paging as Paging)
            })
            .catch(error => alertServerError())
            .finally(() => hideLoader())
    }, [])

    const showLoader = function () {
        document.getElementById('song-loading')!.style.display = 'block';
    }

    const hideLoader = function () {
        document.getElementById('song-loading')!.style.display = 'none';
    }

    const alertServerError = function () {
        document.getElementById('error-alert')!.style.display = 'block';
        setTimeout(() => document.getElementById('error-alert')!.style.display = 'none', 5000);
    }

    const fetchData = async function (searchTerm?: string) {
        const url = searchTerm ? 
            `http://localhost:9090/api/Song/Search/${searchTerm}`:
            'http://localhost:9090/api/Song';
        const response = await fetch(url);
        return await response.json();
    }
    
    const submitSearch = function (event: any) {
        event.preventDefault();
        const searchTerm: string = event.target[0].value;
        showLoader();
        fetchData(searchTerm)
            .then(result =>  {
                setSongs(result.data as Song[])
                setPaging(result.paging as Paging)
            })
            .catch(error => alertServerError())
            .finally(() => hideLoader())
    }

    var songRows = [];
    for (let i = 0; i < songs.length; i += 2) {
        if (i === songs.length - 1) {
            songRows.push(<SongRow {...[ songs[i] ]}/>)
        } else {
            songRows.push(<SongRow {...[ songs[i], songs[i + 1] ]}/>)
        }
    }

    return (
        <>
            <div className="alert alert-danger" id="error-alert" style={{ display: "none" }} role="alert">
                Oops, an error has occurred while searching for songs.
            </div>
            <div className="row justify-content-center my-3">
                <form className="d-flex" id="search-form" role="search" onSubmit={submitSearch} style={{ width: "50%" }}>
                    <input className="form-control me-2" id="search-box-input" type="search" placeholder="Search for a song..." aria-label="Search" />
                    <button className="btn app-outline-btn" type="submit">Search</button>
                </form>
            </div>
            <div className="row" id="song-loading" style={{ display: 'none', justifyContent: 'center', width: '100% !important' }}>
                <div className="spinner-border"></div>
            </div>
            <div className="row" id="song-no-result" style={{ display: 'none', justifyContent: 'center', width: '100% !important' }}>
                No Results...
            </div>
            <div className="mx-5" id="song-list-container">
                {songRows.map(row => row)}
                <SongPaginator {...paging} />
            </div>
        </>
    )
}