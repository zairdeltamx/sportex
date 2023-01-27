import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NavbarComponent from "../layouts/navbar/NavbarComponent";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { setInfoAddressUser } from "../redux/slices/addressSlice/addressSlice";
import CreateItem from "../views/createItem/CreateItem";
import Index from "../views/index/Index";
import MyAssets from "../views/myAssets/MyAssets";
import Profile from "../views/profile/Profile";

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("SI ENTRA");
    dispatch(setInfoAddressUser());
  }, []);
  const isAutorized = useSelector((state) => state.addressReducer.Authorized);

  return (
    <BrowserRouter>
      <NavbarComponent />

      <Routes>
        <Route path="/" element={<Index></Index>} />
        <Route index element={<Index></Index>} />
        {isAutorized ? (
          <Route path="createitem" element={<CreateItem></CreateItem>} />
        ) : null}
        <Route path="myassets" element={<MyAssets></MyAssets>} />
        <Route path="profile" element={<Profile address={23}></Profile>} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
