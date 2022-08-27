import React from 'react'

import imageNftBanner from '../img/NFT.png';
export const Banner = () => {
  return (
    <div>
         <div className='banner'>
            <div className='text-banner'>
            <h1 className='text-style'><span className='text-gradiant'>Sportex</span></h1>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iusto natus tempore asperiores, provident minima voluptas commodi quasi nam omnis blanditiis odit animi dolores corrupti esse nihil mollitia vel sit quod.</p>
            </div>
            <div className='img-banner'>
              <img src={imageNftBanner} alt="" />
            </div>
          </div>
    </div>
  )
}
