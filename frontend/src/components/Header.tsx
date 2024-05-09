import React from 'react'
import Logo from './shared/Logo'
import { AppBar, Toolbar } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import NavigationLink from './shared/NavigationLink';
function Header() {
  const auth = useAuth();
  return (
    <div>
      <AppBar sx={{bgcolor:"transparent", position:"static", boxShadow:"none"}}>
        <Toolbar sx={{display:"flex"}}>
            <Logo />
            <div>
              {auth?.isLoggedIn ? (
                <>
                <NavigationLink
                  bg="#2a55de"
                  to="/"
                  text="Logout"
                  textColor="white"
                  onClick={auth.logout}
                />
                </>):
                (<>
                <NavigationLink
                  bg="#dbd249"
                  to="/login"
                  text="Login"
                  textColor="black"
                />
                <NavigationLink
                  bg="#2a55de"
                  to="/signup"
                  text="Signup"
                  textColor="white"
                />
                </>)}
            </div>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Header
