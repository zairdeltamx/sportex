import React from 'react'

import imageNftBanner from '../img/NFT.png';
import { Paragraph, Title, Title2 } from './CustomStyledComponents';
import styled from '../css/banner.module.css'
export const Banner = () => {
  return (
    <div>
         <div className={styled.banner}>
            <div className={styled.textBanner}>
              <Title2 secondary size='40px'>Hi this is a title</Title2>
              <Paragraph>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iusto natus tempore asperiores, provident minima voluptas commodi quasi nam omnis blanditiis odit animi dolores corrupti esse nihil mollitia vel sit quod.</Paragraph>
            </div>
            <div className={styled.imgBanner} >
              <img src={imageNftBanner} width={200} height={200} alt="" />
            
            </div>
              
          </div>
    </div>
  )
}
