import react, { FormEvent } from 'react';

export default function ProfileDetails({ userName } : {userName: string}) : JSX.Element {

    const submitNewPassword = function (event : any) {
        event.preventDefault();
        const newPassword = event.target[0].value
        alert(newPassword)
    }

    const leftAlignStyle : React.CSSProperties = { 'textAlign': 'left' }
    
    return (
        <div className="container">
            <h1 style={leftAlignStyle}>Hello {userName}</h1>
            <div className='row'>
                <div className='col'>
                    <div className='card'>
                        <div className='row'>
                            <div className='col'>Username:</div>
                            <div className='col'>{userName}</div>
                        </div>
                    </div>
                </div>
                <div className='col'>
                    <form onSubmit={submitNewPassword}>
                        <div className='card'>
                            <div className='card-header'>
                                <h5 style={leftAlignStyle}>Change Password</h5>
                            </div>
                            <div className='card-body'>
                                <label htmlFor="password-field">New Password</label>
                                <input className="form-control" 
                                       id="password-field" 
                                       aria-describedby="password" 
                                       placeholder="Enter new  password"/>
                                <button type='submit' className='btn btn-success'>Submit</button>
                            </div>  
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}