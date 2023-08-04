export default function SignUp () {
    const alertError = function (elementId: string): void {
        document.getElementById(elementId)!.style.display = 'block';
        setTimeout(() => document.getElementById(elementId)!.style.display = 'none', 5000);
    }

    const validateFormInputs = function (): boolean {
        const password = document.getElementById('password');
        const confirmedPassword = document.getElementById('password-confirm');
        if (password !== confirmedPassword) {
            alertError('password-alert');
            return false;
        }
        return true;
    }

    const submitSignUpForm = async function (event: any) {
        event.preventDefault();

        if (!validateFormInputs()) {
            return;
        }

        const username = event.target[0].value;
        const password = event.target[1].value;

        const response = await fetch('http://localhost:9090/api/User', {
            method: 'POST',
            credentials: "include",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (response.status !== 200) {
            alertError('error-alert');
        } 
    }

    return (
        <div className="container">
            <div className="row justify-content-center pt-5">
                <div className="alert alert-danger" id="password-alert" style={{ display: 'none', width: '50%' }} role="alert">
                    Passwords do not match!
                </div>
                <div className="alert alert-danger" id="error-alert" style={{ display: 'none' }} role="alert">
                    Oops, an error has occurred while creating a new account.
                </div>
                <div className="card w-50">
                    <div className="custom-header">
                        <h5 className="card-title">Sign Up</h5>
                    </div>
                    <form id="signup-form" className="val" onSubmit={submitSignUpForm}>
                        <div className="card-body row justify-content-center">
                            <div className="row w-75 my-2">
                                <input type="text" className="form-control" name="username" placeholder="username" aria-label="username"/>
                            </div>
                            <div className="row w-75 my-2">
                                <input type="password" className="form-control"  id="password" name="password" placeholder="password" aria-label="password"/>
                            </div>
                            <div className="row w-75 my-2">
                                <input type="password" className="form-control" id="password-confirm" name="passwordConfirm" placeholder="confirm password" aria-label="confirm password"/>
                            </div>
                            <div className="row w-75 my-2">
                                <button className="btn app-btn" type="submit">Sign Up</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}