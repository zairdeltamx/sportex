import React from "react";
import { Title } from "../../components/elements/Elements";
import { Banner } from "../../layouts/banner/banner";
import { ControlNfts } from "./ControlNfts";
export default function Index() {
  return (
    <div>
      <Banner />
      <Title style={{ textAlign: "center" }}>NFTS MARKETPLACE</Title>
      <ControlNfts/>
    </div>
  );
}
