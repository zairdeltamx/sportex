import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { create as ipfsHttpClient } from 'ipfs-http-client';

import NFT from '../../hardhat/artifacts/contracts/NFT.sol/NFT.json';
import Market from '../../hardhat/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';

import { nftaddress, nftmarketaddress } from '../config';
const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization:
      'Basic MkRnRGNzc0pHaGdxbEZKUUYzOHZ3U0RqRHBEOjQ0NGNhMWFjMTAwOWQxODljODU0ZGEyZmNhYmUwZGYy',
  },
});

// 1. Crear un ítem (imagen/video) y subirlo a IPFS
export async function createItem({
  name,
  description,
  price,
  fileUrl,
  meta,
  teamName,
}) {
  // Validación del formulario
  if (!name || !description || !price || !fileUrl || !meta || !teamName) {
    return;
  }

  const parseJson = JSON.parse(meta);
  parseJson.cardBasicInfo.price = price;
  parseJson.name = name;
  parseJson.description = description;
  parseJson.soccerPlayerInfo.teamName = teamName;
  parseJson.soccerPlayerInfo.image = fileUrl;
  parseJson.soccerPlayerInfo.playerName = name;
  parseJson.soccerPlayerInfo.playerStats.find((stat) =>
    stat.hasOwnProperty('image')
  ).image = fileUrl;

  const data = JSON.stringify({
    name,
    description,
    image: fileUrl,
    metaJson: parseJson,
  });

  const added = await client.add(data);
  const url = `https://sportex-staging.infura-ipfs.io/ipfs/${added.path}`;

  // Pasar la URL para guardarla en Polygon después de haber sido subida a IPFS
  await createSale(url, price, parseJson);
}

// 2. Listar el ítem para la venta
async function createSale(url, nftPrice, metaJson) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const stringJson = JSON.stringify(metaJson);

  // Firmar la transacción
  let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
  let transaction = await contract.createToken(url, stringJson);
  let tx = await transaction.wait();

  // Obtener el tokenId de la transacción
  // let event = tx.events[0];
  let value = event.args[2];
  let tokenId = value.toNumber();

  // Obtener el precio ingresado en el formulario
  const price = ethers.utils.parseUnits(nftPrice, 'ether');

  contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
  transaction = await contract.listMarketItem(nftaddress, tokenId, price);

  await transaction.wait();
  window.location.replace('/');
}
