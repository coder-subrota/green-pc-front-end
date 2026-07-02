import React from 'react';

import Footer from '../../components/Shares/Footer/Footer';
import Navbar from '../../components/Shares/Navbar/Navbar';
import { Outlet } from 'react-router-dom';

const MainLayOut = () => {
    return (
        <>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </>
    );
};

export default MainLayOut;