interface AppHeaderProps {
    isLoggedIn: boolean
}

export default function AppHeader({ isLoggedIn }: AppHeaderProps) {

    const accountSeciton = isLoggedIn ? 
        <a className="btn btn-outline-light" aria-current="page" href="/Account">Account</a> :
        <a className="btn btn-outline-light" aria-current="page" href="/Login">Login</a>

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Blockchain Music</a>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/user.html">User Profile</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/music.html">Music Management</a>
                        </li>
                    </ul>
                </div>
                <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                    <ul className="navbar-nav mb-2 mb-lg-0">
                        <li className="nav-item">
                            {accountSeciton}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}