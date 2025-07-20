import React from 'react'
import Header from '../home/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../home/Footer'
const CustomerLayout = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default CustomerLayout