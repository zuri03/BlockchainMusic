export default function User() {
    return (
        <div className="container">
            <div className="row justify-content-center pt-5">
                <div className="alert alert-danger" id="error-alert" style={{ display: "none" }} role="alert">
                    Oops, an error has occurred while creating a new account.
                </div>
                <div className="card w-50">
                    <div className="custom-header">
                        <h5 className="card-title">Login</h5>
                    </div>
                    <form id="signup-form" className="val">
                        <div className="card-body row justify-content-center">
                            <div className="row w-75 my-2">
                                <input type="text" className="form-control" name="username" placeholder="username" aria-label="username"/>
                            </div>
                            <div className="row w-75 my-2">
                                <input type="password" className="form-control"  id="password" name="password" placeholder="password" aria-label="password"/>
                            </div>
                            <div className="row w-75 my-2">
                                <button className="btn app-btn">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}