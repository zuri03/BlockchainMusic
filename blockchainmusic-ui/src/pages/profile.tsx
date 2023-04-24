import react from 'react'
import AppHeader from '../components/appHeader';
import ProfileDetails from '../components/profileDetails';
import UpdateProfile from '../components/updateProfile';

export default function Profile() : JSX.Element {
    //determine if use is signed in here

    //just hard code it for now
    const isSignedIn = false;
    const userName = 'Zuri';

    const leftAlignStyle : React.CSSProperties = { 'textAlign': 'left' }

    return (
        <div>
            <AppHeader isSignedIn={isSignedIn} />
            <div className="container">
                <h1 style={leftAlignStyle}>Hello {userName}</h1>
                <div className='row'>
                    <div className='col'>
                        <ProfileDetails userName={userName}/>
                    </div>
                    <div className='col'>
                       <UpdateProfile />
                    </div>
                </div>
            </div>
        </div>
    )
}