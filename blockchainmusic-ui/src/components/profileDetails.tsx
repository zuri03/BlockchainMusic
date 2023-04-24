import react, { FormEvent } from 'react';

export default function ProfileDetails({ userName } : {userName: string}) : JSX.Element {

    const submitNewPassword = function (event : any) {
        event.preventDefault();
        const newPassword = event.target[0].value
        alert(newPassword)
    }

    const leftAlignStyle : React.CSSProperties = { 'textAlign': 'left' }
    
    return (
        <div className='card'>
            <div className='row'>
                <div className='col'>Username:</div>
                <div className='col'>{userName}</div>
            </div>
        </div>
    )
}