import React from 'react'
import '../css/profile.css'
import NavbarComponent from '../utils/navbar';
export const Profile = () => {
  return (
    <>
    <NavbarComponent/>
    <div className='form-profile'>
        
      <div className='background-profile'>
      <h1>Your profile</h1>
        <img src="" alt="" />
        <input placeholder="Username" className="" />
        <input placeholder="Email@gmail.com" className="" type="email" />
        </div>
      </div>
    </>
  );
};
