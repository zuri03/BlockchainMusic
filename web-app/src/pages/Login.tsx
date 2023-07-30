interface LoginProps {
    notifyLogin(): void
}

export default function User({ notifyLogin }: LoginProps) {

    const alertLoginError = function () {
        document.getElementById('login-alert')!.style.display = 'block';
        setTimeout(() => document.getElementById('login-alert')!.style.display = 'none', 5000);
    }

    const alertServerError = function () {
        document.getElementById('error-alert')!.style.display = 'block';
        setTimeout(() => document.getElementById('error-alert')!.style.display = 'none', 5000);
    }

    const submitLoginForm = function (event: any) {
        event.preventDefault();
        const username = event.target[0].value;
        const password = event.target[1].value;
        const fetchOptions = {
            method: 'POST',
            headers: new Headers({
                'authorization': `Basic ${username}:${password}`
            })
        };

        fetch('http://localhost:9090/login', fetchOptions)
            .then(response => {
                response.status === 200 ? notifyLogin() : alertLoginError();
            })
            .catch(error => alertServerError());
    }

    return (
        <div className="container">
            <div className="row justify-content-center pt-5">
                <div className="alert alert-danger" id="error-alert" style={{ display: "none" }} role="alert">
                    Oops, an error has occurred while creating a new account.
                </div>
                <div className="alert alert-danger" id="login-alert" style={{ display: "none" }} role="alert">
					Username or password is incorrect!
				</div>
                <div className="card w-50">
                    <div className="custom-header">
                        <h5 className="card-title">Login</h5>
                    </div>
                    <form id="signup-form" className="val" onSubmit={submitLoginForm}>
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