import React from 'react'
import HomeSection from './HomeSection'
import FeaturedProducts from './FeaturedProducts'
import Laptop from '../section/Laptop'
import DesktopsAndMonitors from '../section/DesktopsAndMonitors'
import Tablets from '../section/Tablets'
import AudioProducts from '../section/AudioProducts'

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className='container mt-20 mb-10'>
                <HomeSection />
                <FeaturedProducts />
                <Laptop />
                <DesktopsAndMonitors />
                <Tablets />
                <AudioProducts />
            </div>
        </div>
    )
}

export default Home