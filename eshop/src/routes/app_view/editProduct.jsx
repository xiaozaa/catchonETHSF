import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { create } from "ipfs-http-client";
import { setTokenUrl } from "../../utils/reafactored_util/contract_access_object/eStore/writerCao";

import { Form } from "react-router-dom";

export const uploadJsonToIpfs = async (jsonObj) => {
  const projectId = "2H7QnUXRy2bedggBQfmuJB9iYpG";
  const projectSecret = "54cbd88dc60539ed9be39ddd32fe092f";
  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
  const client = create({
    host: "ipfs.infura.io:5001",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });
  const added = await client.add(JSON.stringify(jsonObj));
  console.log("ipfs url: ", added.path);
  const tokenUrl = "https://ipfs.io/ipfs/" + added.path;
  return tokenUrl;
};

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  console.log("Form data recieved: ", updates);

  const tokenUrl = await uploadJsonToIpfs(updates);

  await setTokenUrl(0, tokenUrl);

  return;
}

export function EditProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminAddr, appMeta, productInfo } = location.state;

  console.log("appMeta: ", appMeta);
  console.log("productInfo: ", productInfo);

  return (
    <>
      <h2> Configure {`${productInfo.name}`} </h2>

      <Form method="post" id="submit-json-form">
        <p>
          <span>Name</span>
          <input placeholder="Product Name" type="text" name="name" />
        </p>
        <label>
          <span>Description</span>
          <input type="text" name="twitter" placeholder="Product Description" />
        </label>
        <label>
          <span>Image</span>
          <input
            placeholder="Img URL"
            aria-label="Avatar URL"
            type="text"
            name="img"
            defaultValue="http://example-image.com"
          />
        </label>
        <p>
          <button type="submit">Save</button>
        </p>
      </Form>

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
