import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ClippedDrawer from './DashboardLayoutBasic';
const Tongquan = () => {
    const navigate = useNavigate();

    return (
        <ClippedDrawer>
            <div>
                <div className="sticky top-16 z-10 bg-white border-b shadow-sm">
                    <div className="flex items-center text-sm text-gray-600 space-x-2 px-4 pt-2">
                        <button className="hover:underline text-blue-600">
                            Dashboard
                        </button>
                        <span>/</span>
                        <span className="text-gray-700 font-medium">Tổng quan</span>
                    </div>
                    <h2 className="text-xl font-semibold p-4">Tổng quan</h2>
                </div>
                <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-[calc(100vh-80px)]">

                </div>
            </div>
        </ClippedDrawer>
    )
}

export default Tongquan