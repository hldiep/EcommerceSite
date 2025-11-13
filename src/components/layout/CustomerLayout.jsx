import React, { useState } from 'react'
import Header from '../home/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../home/Footer'
import ScrollToTop from '../helper/ScrollToTop'
import ScrollToTopButton from '../home/ScrollToTopButton'
import Chatbot from '../helper/Chatbot'
// import Chatbot from '../search/Chatbot'
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
            {/* <Chatbot /> */}
            <Chatbot open={chatOpen} setOpen={setChatOpen} />
            <ScrollToTopButton />
        </>
    )
}

export default CustomerLayout