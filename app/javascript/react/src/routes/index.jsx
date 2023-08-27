import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import NavbarComponent from '../layouts/navbar/NavbarComponent';
import CreateItem from '../views/createItem/CreateItem';
import Welcome from '../views/Welcome/Welcome';
import MyAssets from '../views/myAssets/MyAssets';
import Profile from '../views/profile/Profile';
import NftInfo from '../views/nftInfo/NftInfo';
import Footer from '../layouts/Footer/Footer';
import { useMetamask } from '../useContext/MetamaskContext';
import { LoaderBlock } from '../components/LoaderBlock';
import { useLoadingContext } from '../useContext/LoaderContext';

export default function App() {
  useEffect(() => {}, []);

  const { isAllowed } = useMetamask();
  const { transactionIsLoading } = useLoadingContext();

  return (
    <div>
      {transactionIsLoading ? <LoaderBlock /> : ''}

      <BrowserRouter>
        <NavbarComponent />

        <Routes>
          <Route path="/" element={<Welcome></Welcome>} />
          <Route index element={<Welcome></Welcome>} />
          {isAllowed ? (
            <Route path="createitem" element={<CreateItem></CreateItem>} />
          ) : null}
          <Route path="myassets" element={<MyAssets></MyAssets>} />
          <Route path="nftdetail/:id" element={<NftInfo></NftInfo>} />
          <Route path="profile" element={<Profile></Profile>} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
