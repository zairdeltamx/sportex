import React, { useEffect, useRef, useState } from 'react';
import { Wave } from '../../components/Wave';
import { getUser, updateAvatar } from '../../services/users';
import PencelIcon from '../../img/pencelIcon.svg';
import { updateUser } from '../../services/users';
import { useMetamask } from '../../useContext/MetamaskContext';
import { useLazyQuery } from '@apollo/client';
import ClipboardJS from 'clipboard';
import { notification } from '../../components/alerts/notifications';

import styles from './Profile.module.css';
import { GET_USER } from '../../graphql/user/graphql-queries';
export default function Profile() {
  const [form, setForm] = useState(null);
  const [get_user, { data, loading, error }] = useLazyQuery(GET_USER, {
    fetchPolicy: 'network-only',
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setisDisabled] = useState(true);
  const { addressMetamask } = useMetamask();

  const handleAvatarUpdate = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    await updateAvatar({ id: form.id, avatar: formData, getUser: get_user });
  };

  const isUsernameValid = (username) => {
    // if (username === "") {
    //   return false;
    // }
    return username && username.length >= 5;
  };

  const isEmailValid = (email) => {
    console.log(email, 'EMAIL');
    if (email === '') {
      return true;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };
  const textoRef = useRef(null);

  useEffect(() => {
    const clipboard = new ClipboardJS('.copy_button', {
      text: () => textoRef.current.innerText,
    });
    clipboard.on('success', () => {
      notification.showSuccess({ title: 'Copied', message: '¡Copied token!' });
    });
    return () => {
      clipboard.destroy();
    };
  }, []);

  useEffect(() => {
    if (addressMetamask) {
      get_user();
    }
  }, [addressMetamask]);

  useEffect(() => {
    if (data) {
      console.log(data, 'DATA');
      setForm({
        id: data.currentUser?.id,
        username: data.currentUser?.username,
        email: data.currentUser?.email !== null ? data.currentUser?.email : '',
        avatar: data.currentUser.avatarUrl,
        token: data.currentUser?.token,
      });
    }
  }, [data]);

  const editButtons = () => {
    setisDisabled(false);
    setIsVisible(true);
  };

  if (!form) {
    return <p style={{ marginTop: '90px', color: 'white' }}>LOADING..</p>;
  }
  return (
    <div style={{ marginTop: '80px' }}>
      <Wave />
      <div className={styles.containerProfile}>
        <div className={styles.profile}>
          <h1>Profile</h1>
          <div className={styles.profileInformation}>
            <p>Profile information</p>
            <p className={styles.optionEdit} onClick={editButtons}>
              Editar <PencelIcon />
            </p>
          </div>
          <div className={styles.formProfile}>
            <div className={styles.avatarProfile}>
              <img src={form?.avatar} alt="" />
            </div>
            <input
              accept="image/jpg,image/jpeg,image/png"
              onChange={(ev) => handleAvatarUpdate(ev.target.files[0])}
              type="file"
              id="myFileInput"
            />
            <label className={styles.labelAvatar} htmlFor="myFileInput">
              Edit display image
            </label>
            <div className={styles.inputsContainer}>
              <div className={styles.inputName}>
                <label htmlFor="Username">Username</label>
                <input
                  onChange={(ev) =>
                    setForm({ ...form, username: ev.target.value })
                  }
                  value={form?.username}
                  disabled={isDisabled}
                  type="text"
                  name=""
                  id="Username"
                />
                {form?.username && !isUsernameValid(form.username) && (
                  <span className={styles.error}>
                    Username must be at least 5 characters long
                  </span>
                )}
                {form?.username === '' && (
                  <span className={styles.error}>Username is required</span>
                )}
              </div>
              <div className={styles.inputEmail}>
                <label htmlFor="Email">Email</label>
                <input
                  onChange={(ev) =>
                    setForm({ ...form, email: ev.target.value })
                  }
                  value={form?.email}
                  disabled={isDisabled}
                  type="email"
                  name=""
                  id="Email"
                />
                {form?.email && !isEmailValid(form.email) && (
                  <span className={styles.error}>Invalid email address</span>
                )}
              </div>
              <label>Token</label>
              <br />
              <span
                style={{
                  wordBreak: 'break-all',
                  fontSize: '15px',
                  fontWeight: '500',
                }}
                ref={textoRef}
              >
                {form.token ?? "Don't have token"}
              </span>
              {'   '}
              <br />
              <span
                style={{ cursor: 'pointer' }}
                className="copy_button"
                data-clipboard-text="Copiado!"
              >
                Copy token
              </span>
            </div>
          </div>
          {isVisible && (
            <div className={styles.buttonsEdit}>
              <button
                onClick={() => setIsVisible(false)}
                className={styles.cancel}
              >
                Cancel
              </button>
              <button
                disabled={
                  !isUsernameValid(form.username) || !isEmailValid(form.email)
                }
                onClick={() =>
                  updateUser({
                    email: form.email,
                    username: form.username,
                    address: addressMetamask,
                  })
                }
                className={styles.saveChanges}
              >
                Save changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
