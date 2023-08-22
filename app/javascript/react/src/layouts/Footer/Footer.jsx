import React from "react";
import IconFacebook from "../../img/iconSocialNetworks/iconFacebook.svg";
import IconYoutube from "../../img/iconSocialNetworks/iconYoutube.svg";
import IconTwitter from "../../img/iconSocialNetworks/iconTwitter.svg";
import IconInstagram from "../../img/iconSocialNetworks/iconInstagram.svg";

import styles from "./Footer.module.css";
const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.containerContent}>
        <div className={styles.containerIcons}>
          <div className={styles.contentIcons}>
            <div className={styles.iconFooter}>
              <IconTwitter />
            </div>
            <div className={styles.icon}>
              <IconFacebook />
            </div>
            <div className={styles.icon}>
              <IconYoutube />
            </div>
            <div className={styles.icon}>
              <IconInstagram />
            </div>
          </div>
        </div>
        <div className={styles.containerContentLeft}>
          <div className={`${styles.footerColumn} ${styles.footerColumn1}`}>
            <h1>Company</h1>
            <p>About us</p>
            <p>Blog</p>
            <p>Contact us</p>
          </div>
          <div className={`${styles.footerColumn} ${styles.footerColumn2}`}>
            <h1>Support</h1>
            <p>Help center</p>
            <p>Terms of service</p>
            <p>Status</p>
          </div>
          <div className={`${styles.footerColumn} ${styles.footerColumn3}`}>
            <h1>Stay up to date</h1>
            <input type="email" placeholder="Your email address" />
            <button>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
