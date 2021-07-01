import React from "react"
import { NavigationContainer } from '@react-navigation/native'

import { useAuth } from "../hooks/auth"

import { AuthRoutes } from "./app.routes"
import { SignIn } from "../screens/SignIn"

export function Routes() {
    const { user } = useAuth()
    return (
        <NavigationContainer>
            {user.id ? <AuthRoutes /> : <SignIn />}
        </NavigationContainer>
    )
}