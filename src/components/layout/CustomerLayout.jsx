import React, { useState } from 'react'
import Header from '../home/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../home/Footer'
import ChatBotBox from '../helper/ChatBotBox'
import ScrollToTop from '../helper/ScrollToTop'
import ScrollToTopButton from '../home/ScrollToTopButton'
const CustomerLayout = () => {

    const [chatOpen, setChatOpen] = useState(false);
    return (
        <>
            <ScrollToTop enabled={!chatOpen} />
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
            <ChatBotBox open={chatOpen} setOpen={setChatOpen} />
            <ScrollToTopButton />
        </>
    )
}

export default CustomerLayout