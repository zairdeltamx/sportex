import { create as ipfsHttpClient } from "ipfs-http-client";
import React, { useState } from "react";
import Polaroid from "../../img/polaroid.svg";
import { Loader } from "../../components/Loader";
import { createItem } from "../../helpers/createNft";
import { useLoadingContext } from "../../useContext/LoaderContext";
import { notification } from "../../components/alerts/notifications";
const client = ipfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization:
      "Basic MkRnRGNzc0pHaGdxbEZKUUYzOHZ3U0RqRHBEOjQ0NGNhMWFjMTAwOWQxODljODU0ZGEyZmNhYmUwZGYy",
  },
});

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false)
  const { transactionIsLoading, setTransactionIsLoading } = useLoadingContext()
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
    teamName: "",
    meta: "",
  });
  const handleCreateItem = async () => {
    setTransactionIsLoading(true)
    createItem({
      description: formInput.description, price: formInput.price, fileUrl: fileUrl, meta: formInput.meta, name: formInput.name, teamName: formInput
        .teamName
    }).then(() => {
      notification.showSuccess({ title: 'Success', message: 'The item has been created successfully' })

    }).catch(() => {
      notification.showErrorWithButton({ title: 'Error', message: 'There was an error creating the item' })
    })
      .finally(() => {
        setTransactionIsLoading(false)
      })
  }


  async function onChange(e) {
    setLoadingImage(true)
    const file = e.target.files[0];
    try {
      //try uploading the file
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      //file saved in the url path below
      const url = `https://sportex-staging.infura-ipfs.io/ipfs/${added.path}`;
      setFileUrl(url);
      setLoadingImage(false)
    } catch (e) {
      console.log("Error uploading file: ", e);
    }
  }


  return (
    <div>
      <div className="container_createitem">
        <div className="container_form_createitem">
          <div>
            {
              !loadingImage ? (
                <div>
                  {
                    !fileUrl ?
                      <Polaroid /> : <img
                        src={fileUrl}
                        alt="Picture of the author"
                        className="rounded mt-4"
                        width={200}
                        height={200}
                      />
                  }
                </div>
              ) : (
                <Loader />
              )}
          </div>
          <div>
            <input
              id="myFileInput"
              required={true}
              type="file"
              name="Asset"
              onChange={onChange}
            />

            <label className="labelAvatar" htmlFor="myFileInput">
              Upload image
            </label>
          </div>
          <div className="input_wrapper">
            <label htmlFor="name">Name*</label>
            <input
              autoComplete="off"
              placeholder="Name...."
              id="name"
              type="text"
              onChange={(e) =>
                updateFormInput({ ...formInput, name: e.target.value })
              }
            />
          </div>
          <div className="input_wrapper">
            <label htmlFor="description">Description*</label>
            <input
              autoComplete="off"
              placeholder="Description...."
              id="description"
              type="text"
              onChange={(e) =>
                updateFormInput({ ...formInput, description: e.target.value })
              }
            />
          </div>
          <div className="input_wrapper">
            <label htmlFor="teamName">Team Name*</label>
            <input
              autoComplete="off"
              placeholder="Team name...."
              id="teamName"
              type="text"
              onChange={(e) =>
                updateFormInput({ ...formInput, teamName: e.target.value })
              }
            />
          </div>

          <div className="input_wrapper">
            <label htmlFor="price">Price*</label>
            <input
              autoComplete="off"
              placeholder="2...."
              id="price"
              type="number"
              onChange={(e) =>
                updateFormInput({ ...formInput, price: e.target.value })
              }
            />
          </div>
          <div className="input_wrapper">
            <label htmlFor="meta">Meta_json*</label>
            <textarea
              autoComplete="off"
              placeholder="{Meta_json....,Meta_json...}"
              id="meta"
              type="text"
              onChange={(e) =>
                updateFormInput({ ...formInput, meta: e.target.value })
              }
            />
          </div>
          <button onClick={async () => handleCreateItem()} className="">
            Create NFT
          </button>
        </div>
      </div>
    </div>
  );
}
