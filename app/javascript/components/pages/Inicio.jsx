import React from 'react'
import { Link, Outlet } from 'react-router-dom'
function Inicio() {
    return (

<div >
    <nav className='border-b p-6'>
        <p className='text-4xl font-bold text-blue-500'>Ax_Metaverse_Marketplace</p>
        <div className='flex mt-4'>
        
        <Link className='mr-6 text-pink-500' to="home">
            Home
        </Link>
        <Link className='mr-6 text-pink-500' to="createitem">
            Sell digital asset
        </Link>
        <Link className='mr-6 text-pink-500' to="myassets">
            My Digital Assets
        </Link>
        <Link className='mr-6 text-pink-500' to="creatordashboard">
            Creator Dashboard
          </Link>
        </div>
      </nav>
      <Outlet>

      </Outlet>
    </div>
    )
}

export default Inicio