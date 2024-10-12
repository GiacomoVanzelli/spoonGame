import { useState } from "react";

type AuthUser = {
    name: string
    email: string
}

export const User = () => {
    const [user, setUser] = useState<AuthUser>({} as AuthUser)
    const handlelogin = () => {
        setUser({
            name: 'Giacomo',
            email: 'giacomovanzelli06@gmail.com'
        })
    }
    return (
        <div>
            <button onClick={handlelogin}>Login</button>
            <div>User name is {user.name}</div>
            <div>User email is {user.email}</div>
        </div>
    )
}