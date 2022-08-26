import React from 'react';
import {Routes, Route} from 'react-router-dom'
import NotFound from './pages/NotFound';
import Index from './pages/index'
import Myassets from './pages/my-assets.jsx'
import CreateItem from './pages/create-item.jsx'
import CreatorDash from './pages/creator-dashboard.jsx'
import { Profile } from './pages/Profile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index></Index>}/>
      <Route path="home" element={<Index></Index>}/>
      <Route path="createitem" element={<CreateItem></CreateItem>}/>
      <Route path="myassets" element={<Myassets></Myassets>}/>
      <Route path="profile" element={<Profile></Profile>}/>

      <Route path="creatordashboard" element={<CreatorDash></CreatorDash>}/>
      <Route path="*" element={<NotFound></NotFound>}/>
    </Routes>
  );
}

export default App;
