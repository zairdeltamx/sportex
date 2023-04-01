import React, { useEffect, useState } from "react";
import { Wave } from "../../components/Wave";
import { getUser } from "../../services/users";
import imgAvatar from "../../img/nftBanner.png";
import PencelIcon from "../../img/pencelIcon.svg";
import { updateUser } from "../../services/users";
export default function Profile() {
  // console.log("ADDREESS",address);
  const [form, setForm] = useState(null)
  useState
  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setisDisabled] = useState(true);
  const fetchUser = async () => {
    const user = await getUser({
      addressMetamask: "0x66ee7a3985d5342baae1b7d0ff1bc9fa7ee9182e",
    });
    setForm({
      username: user.username,
      email: user.email !== null ? user.email : 'No tienes email'
    });
    console.log(form, "FORM");
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const edit = () => {
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
            <p className="optionEdit" onClick={edit}>
              Editar <PencelIcon />
            </p>
          </div>
          <div className="formProfile">
            <div className="avatarProfile">
              <img src={imgAvatar} alt="" />
            </div>
            <input type="file" id="myFileInput" />
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
              </div>
              <div className="inputEmail">
                <label htmlFor="Email">Email</label>
                <input onChange={(ev) => setForm({ ...form, email: ev.target.value })}
                  value={form?.email} disabled={isDisabled} type="email" name="" id="Email" />
              </div>
            </div>
          </div>
          {isVisible && (
            <div className="buttonsEdit">
              <button className="cancel">Cancel</button>
              <button onClick={() => updateUser({ email: form.email, username: form.username, address: '0x66ee7a3985d5342baae1b7d0ff1bc9fa7ee9182e' })} className="saveChanges">Save changes</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
