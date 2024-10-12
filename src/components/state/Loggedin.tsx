import { useState } from "react";

export const LoggedIn = () => {
    const [isLoggedIn, setLoggedIn] = useState(false)

    const handlelogin = () => {
        setLoggedIn(true)
    }
    const handleLogout = () => {
        setLoggedIn(false)
    }
    return (
        <div>
            <button onClick={handlelogin}>Login</button>
            <button onClick={handleLogout}>Logout</button>
            <div>User is {isLoggedIn ? 'logged in' : 'logged out'}</div>
        </div>
    )
}