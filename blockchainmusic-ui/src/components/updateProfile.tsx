export default function UpdateProfile() : JSX.Element{

    const submitNewPassword = function (event : any) {
        event.preventDefault();
        const newPassword = event.target[0].value
        alert(newPassword)
    }

    const leftAlignStyle : React.CSSProperties = { 'textAlign': 'left' }

    return (
        <form onSubmit={submitNewPassword}>
            <div className='card'>
                <div className='card-header'>
                    <h5 style={leftAlignStyle}>Change Password</h5>
                </div>
                <div className='card-body'>
                    <div className='row mx-1 mb-2 form-group justify-content-start'>
                        <label htmlFor="password-field" className='text-start'>New Password</label>
                        <input className="form-control" 
                            id="password-field" 
                            aria-describedby="password" 
                            placeholder="Enter new  password"/>
                    </div>
                    <div className="row mx-1" style={{ "justifyContent": "start" }}>
                        <button type='submit' style={{ 'width': '20%' }} className='btn btn-success'>Submit</button>
                    </div>
                </div>  
            </div>
        </form>
    )
}