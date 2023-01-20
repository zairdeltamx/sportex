import React, { useEffect } from 'react';
// import NftImage from '../../img/NFT.png';

import './style.css';
import { Paragraph, Title } from '../../components/elements/Elements';
export const Banner = () => {

	return (
		<div className='containerBanner'>
			<section className='itemsBanner'>
				<Title size='50px' color='#D8A31A' font>
					SPORTEX
				</Title>
				<Paragraph size='20px'>PLAY SPORTEX!</Paragraph>
				<img
					id="image_png"
					className='imgNFT'
					src='https://imgur.com/M86Ekiy.png'
					width={120}
					height={120}
					alt=''
				/>
			</section>
			<svg
				className='waveBanner'
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 1440 320'>
				<path
					fill='#0f1b2f'
					fillOpacity='1'
					d='M0,224L80,234.7C160,245,320,267,480,256C640,245,800,203,960,186.7C1120,171,1280,181,1360,186.7L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z'></path>
			</svg>
		</div>
	);
};
