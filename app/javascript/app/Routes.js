import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NavbarComponent from "./components/navbar.jsx";
import { useAddress } from "./hooks/useAddress.js";
import CreateItem from "./pages/create-item/create-item.jsx";
import Index from "./pages/index/index.jsx";
import Myassets from "./pages/myassets/my-assets.jsx";
import { Profile } from "./pages/profile/Profile.jsx";

function App() {
  const { isAutorized } = useAddress();
  return (
    <BrowserRouter>
      <NavbarComponent />
      <Routes>
        <Route path="home" element={<Index></Index>} />
        <Route index element={<Index></Index>} />
        {isAutorized === true ? (
          <Route path="createitem" element={<CreateItem></CreateItem>} />
        ) : null}
        <Route path="myassets" element={<Myassets></Myassets>} />
        <Route path="profile" element={<Profile></Profile>} />
        <Route path="*" element={<Navigate replace to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
