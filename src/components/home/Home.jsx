import React from 'react'
import HomeSection from './HomeSection'
import Newest from '../section/Newest'
import Loa from '../section/Loa'
import BanPhim from '../section/BanPhim'
import Chuot from '../section/Chuot'

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className='container mt-20 mb-10'>
                <HomeSection />
                <Newest />
                <BanPhim />
                <Chuot />
                <Loa />
            </div>
        </div>
    )
}

export default Home