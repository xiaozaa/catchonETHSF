import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { uploadJsonToIpfs } from "./editProduct";
import { addProduct } from "../../utils/reafactored_util/contract_access_object/eStore/writerCao";
import { CreateProduct } from "./createProduct";

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

  const [name, setName] = useState("Product name");
  const [description, setDescription] = useState("Product description");
  const [supply, setSupply] = useState("Product supply");
  const [imgUrl, setImgUrl] = useState("http://exampleImage.com");
  const [price, setPrice] = useState(null);

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
    await addProduct(supply, price, tokenUrl, proxyAddr);

    navigate(-1);
  };

  return (
    <div className="black-border">
      <h1 id="create-product">Create product</h1>

      <form onSubmit={handleSubmit}>
        <label>
          <span>Product name</span>
          <br />
          <input
            placeholder=""
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
        </label>
        <label>
          <span>Total supply</span>
          <br />
          <input
            type="text"
            placeholder=""
            value={supply}
            onChange={(e) => setSupply(e.target.value)}
          />
          <br />
        </label>
        <label>
          <span>Price per item</span>
          <br />
          <input
            type="text"
            placeholder=""
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <br />
        </label>
        <label>
          <span>Image URL</span>
          <br />
          <input
            placeholder=""
            aria-label="Avatar URL"
            type="text"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
          />
          <br />
        </label>
        <label>
          <span>Description</span>
          <br />
          <input
            type="text"
            placeholder=""
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <br />
        </label>
        <p>
          <button
            type="submit"
            sx={{
              fontWeight: "bolder",
              backgroundColor: "white",
              color: "black",
              width: "100px",
              padding: "20px",
            }}
            outlined
          >
            CREATE
          </button>
        </p>
      </form>

      <Button
        id={"cancle-op-button"}
        sx={{
          fontWeight: "bold",
          backgroundColor: "black",
          color: "white",
          width: "100px",
          padding: "10px",
        }}
        onClick={() => {
          navigate(-1);
        }}
      >
        Back
      </Button>
    </div>
  );
}
