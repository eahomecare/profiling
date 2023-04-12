import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { getToken } from "./auth";

export type Auth = {
    token: string
}

export interface AuthContextInterface {
    token: Auth,
}

export const AuthContext = createContext<Partial<Auth>>({})

type AuthProvideProps = {
    children: ReactNode
}

export default function AuthProvider({ children }: AuthProvideProps) {
    const [token, setToken] = useState<string>('')
    useEffect(() => {
        getToken().then((res) => {
            setToken(res.access_token)
        })
    }, [])
    console.log('Authcontext provider just ran!')
    return (
        <AuthContext.Provider value={{ token }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext)

