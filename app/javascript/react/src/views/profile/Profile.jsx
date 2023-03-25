import React, { useEffect, useState } from "react";
import { Loading } from "../../components";
import { Title } from "../../components/elements/Elements";
import { Wave } from "../../components/wave/Wave";
import { getUser } from "../../services/users";
import { AvatarProfile } from "./AvatarProfile";
import { FormProfile } from "./FormProfile";
import imgAvatar from "../../img/nftBanner.png";
import "./styles.css";
import PencelIcon from "../../img/pencelIcon.svg";
export default function Profile() {
  // console.log("ADDREESS",address);
  const [data, setData] = useState(null);
  const [initialForm, setInitialForm] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setisDisabled] = useState(true);
  const fetchUser = async () => {
    const user = await getUser({
      addressMetamask: "0x66ee7a3985d5342baae1b7d0ff1bc9fa7ee9182e",
    });
    setInitialForm({
      username: user.username,
      email: user.email,
    });
    setData(user);
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const edit = () => {
    setisDisabled(false);
    setIsVisible(true);
  };
  return data ? (
    <div>
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
                  disabled={isDisabled}
                  type="text"
                  name=""
                  id="Username"
                />
              </div>
              <div className="inputEmail">
                <label htmlFor="Email">Email</label>
                <input disabled={isDisabled} type="email" name="" id="Email" />
              </div>
            </div>
          </div>
          <button>Cancelar</button>
          <button>Save changes</button>
        </div>
      </div>
    </div>
  ) : (
    <Loading></Loading>
  );
}
