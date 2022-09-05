import React from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Index from "./pages/index/index.jsx";
import Myassets from "./pages/myassets/my-assets.jsx";
import CreateItem from "./pages/create-item/create-item.jsx";
import CreatorDash from "./pages/creator-dashboard/creator-dashboard.jsx";
import { Profile } from "./pages/profile/Profile.jsx";
import NavbarComponent from "./components/navbar.jsx";

function App() {
  return (
    <BrowserRouter>
      <NavbarComponent/>
      <Routes>
        <Route path="/" element={<Index></Index>} />
        <Route index element={<Index></Index>} />
        <Route path="createitem" element={<CreateItem></CreateItem>} />
        <Route path="myassets" element={<Myassets></Myassets>} />
        <Route path="profile" element={<Profile></Profile>} />
        <Route path="creatordashboard" element={<CreatorDash></CreatorDash>} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
