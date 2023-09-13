import React from 'react';
import MainHeader from './MainHeader';
import MainNavbar from './MainNavbar';

const AppShell = ({ children }) => {
    return (
        <div>
            <MainHeader />
            <MainNavbar />
            <div>
                {children}
            </div>
        </div>
    );
}

export default AppShell;