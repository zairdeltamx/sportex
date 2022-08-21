import React from 'react'
import { Link, Outlet } from 'react-router-dom'

export default function Navbar() {
  return (
    <div >
      <nav className='border-b p-6'>
        <div className='flex mt-4'>
          <Link className='mr-6 text-pink-500' to="/">
            <p className='text-4xl font-bold text-blue-500'>Sportex Marketplace</p>
          </Link>
    <hr></hr>
          <Link className='mr-6 text-pink-500' to="myassets">
          My Digital Assets
          </Link>
        </div>
      </nav>
      <Outlet>
      </Outlet>
    </div>
  )
}
