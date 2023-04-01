import React from 'react';
import IconFacebook from '../img/iconSocialNetworks/iconFacebook.svg'
import IconYoutube from '../img/iconSocialNetworks/iconYoutube.svg'
import IconTwitter from '../img/iconSocialNetworks/iconTwitter.svg'
import IconInstagram from '../img/iconSocialNetworks/iconInstagram.svg'
const Footer = () => {
	return <div className='container_footer'>
		<div className='container_all_content_footer'>

			<div className='container_icons_footer'>
				<div className='content_icons_footer'>

					<div className='icon_footer'><IconTwitter /></div>
					<div className='icon_footer'><IconFacebook /></div>
					<div className='icon_footer'><IconYoutube /></div>
					<div className='icon_footer'><IconInstagram /></div>
				</div>
			</div>
			<div className='container_content_footer'>
				<div className='footer_column footer_column_1'>
					<h1>Company</h1>
					<p>About us</p>
					<p>Blog</p>
					<p>Contact us</p>
				</div>
				<div className='footer_column footer_column_2'>
					<h1>Support</h1>
					<p>Help center</p>
					<p>Terms of service</p>
					<p>Status</p>
				</div>
				<div className='footer_column footer_column_3'>
					<h1>Stay to up date</h1>
					<input type="email" placeholder='Your email address' />
					<button>Send</button>
				</div>
			</div>
		</div>
	</div>;
};
export default Footer;
