import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { uploadJsonToIpfs } from "./editProduct";
import { addProduct } from "../../utils/reafactored_util/contract_access_object/eStore/writerCao";

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  console.log("Form data recieved: ", updates);

  //const tokenUrl = await uploadJsonToIpfs(updates);
  //await setTokenUrl(0, tokenUrl);

  //redirect(`..`);
}

export function AddProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminAddr, appMeta, proxyAddr } = location.state;

  const [name, setName] = useState("product name");
  const [description, setDescription] = useState("Product description");
  const [supply, setSupply] = useState("Product supply");
  const [imgUrl, setImgUrl] = useState("http://exampleImage.com");

  console.log("appMeta: ", appMeta);
  console.log("proxyAddr: ", proxyAddr);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(
      `Creating product with name: ${name}, description: ${description}, supply: ${supply}, imgUrl: ${imgUrl} `
    );
    const formObj = {
      name: name,
      description: description,
      img: imgUrl,
    };

    const tokenUrl = await uploadJsonToIpfs(formObj);
    console.log("Token URL: ", tokenUrl);
    console.log(`Add product: ${supply}, ${tokenUrl}, ${proxyAddr}`);
    await addProduct(supply, tokenUrl, proxyAddr);

    navigate(-1);
  };

  return (
    <>
      <h1>Adding a product!</h1>

      <form onSubmit={handleSubmit}>
        <p>
          <span>Name</span>
          <input
            placeholder="Product Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </p>
        <label>
          <span>Description</span>
          <input
            type="text"
            placeholder="Product Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          <span>Supply</span>
          <input
            type="text"
            placeholder="Product Supply"
            value={supply}
            onChange={(e) => setSupply(e.target.value)}
          />
        </label>
        <label>
          <span>Image</span>
          <input
            placeholder="Img URL"
            aria-label="Avatar URL"
            type="text"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
          />
        </label>
        <p>
          <button type="submit">Save</button>
        </p>
      </form>

      <Button
        id={"cancle-op-button"}
        onClick={() => {
          navigate(-1);
        }}
      >
        Cancle
      </Button>
    </>
  );
}
