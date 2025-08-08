import React from 'react'
import Header from '../home/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../home/Footer'
import ChatBotBox from '../helper/ChatBotBox'
const CustomerLayout = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
            <ChatBotBox />
        </>
    )
}

export default CustomerLayout