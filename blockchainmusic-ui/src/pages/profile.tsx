import react from 'react'
import AppHeader from '../components/appHeader';
import ProfileDetails from '../components/profileDetails';
export default function Profile() : JSX.Element {
    //determine if use is signed in here

    //just hard code it for now
    const isSignedIn = false;
    const userName = 'Zuri';

    return (
        <div>
            <AppHeader isSignedIn={isSignedIn} />
            <ProfileDetails userName={userName}/>
        </div>
    )
}