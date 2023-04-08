import React, { useEffect, useState } from "react";
import { Wave } from "../components/Wave";
import { getUser, updateAvatar } from "../services/users";
import PencelIcon from "../img/pencelIcon.svg";
import { updateUser } from "../services/users";
import { useMetamask } from "../useContext/MetamaskContext";

export default function Profile() {

  const [form, setForm] = useState(null)

  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setisDisabled] = useState(true);
  const { addressMetamask } = useMetamask();

  const handleAvatarUpdate = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    updateAvatar({ id: form.id, avatar: formData })

  };
  const isUsernameValid = (username) => {
    return username && username.length >= 5;
  };

  const isEmailValid = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };

  const fetchUser = async () => {
    if (!addressMetamask) {
      return;
    }

    const user = await getUser({ addressMetamask });
    setForm({
      id: user.id,
      username: user.username,
      email: user.email !== null ? user.email : 'No tienes email',
      avatar: user.avatar_url
    });
  };

  useEffect(() => {
    if (addressMetamask) {
      fetchUser();
    }
  }, [addressMetamask]);


  const editButtons = () => {

    setisDisabled(false);
    setIsVisible(true);
  };

  if (!form) {
    return (<h1>LOADING..</h1>)
  }
  return (
    <div style={{ marginTop: '80px' }}>
      <Wave />
      <div className="containerProfile">
        <div className="profile">
          <h1>Profile</h1>
          <div className="profileInformation">
            <p>Profile information</p>
            <p className="optionEdit" onClick={editButtons}>
              Editar <PencelIcon />
            </p>
          </div>
          <div className="formProfile">
            <div className="avatarProfile">
              <img src={form?.avatar} alt="" />
            </div>
            <input accept="image/jpg,image/jpeg,image/png"
              onChange={(ev) => handleAvatarUpdate(ev.target.files[0])} type="file" id="myFileInput" />
            <label className="labelAvatar" htmlFor="myFileInput">
              Edit display image
            </label>
            <div className="inputsContainer">
              <div className="inputName">
                <label htmlFor="Username">Username</label>
                <input
                  onChange={(ev) => setForm({ ...form, username: ev.target.value })}
                  value={form?.username}
                  disabled={isDisabled}
                  type="text"
                  name=""
                  id="Username"
                />
                {form?.username && !isUsernameValid(form.username) && (
                  <span className="error">Username must be at least 5 characters long</span>
                )}
              </div>
              <div className="inputEmail">
                <label htmlFor="Email">Email</label>
                <input
                  onChange={(ev) => setForm({ ...form, email: ev.target.value })}
                  value={form?.email}
                  disabled={isDisabled}
                  type="email"
                  name=""
                  id="Email"
                />
                {form?.email && !isEmailValid(form.email) && (
                  <span className="error">Invalid email address</span>
                )}
              </div>
            </div>
          </div>
          {isVisible && (
            <div className="buttonsEdit">
              <button onClick={() => setIsVisible(false)} className="cancel">Cancel</button>
              <button disabled={!isUsernameValid(form.username) || !isEmailValid(form.email)} onClick={() => updateUser({ email: form.email, username: form.username, address: addressMetamask })} className="saveChanges">Save changes</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
