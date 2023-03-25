import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NavbarComponent from "../layouts/navbar/NavbarComponent";


import CreateItem from "../views/createItem/CreateItem";
import Index from "../views/index/index/Index";
import MyAssets from "../views/myAssets/MyAssets";
import Profile from "../views/profile/Profile";
import NftInfo from "../views/nftInfo/NftInfo";

export default function App() {
  useEffect(() => {
  }, []);
  const isAutorized = true
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
        <Route path="nftdetail/:id" element={<NftInfo></NftInfo>} />
        <Route path="profile" element={<Profile></Profile>} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
