import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export function EditProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminAddr, appMeta, productInfo } = location.state;

  return (
    <>
      <h2> Configure {`${productInfo.name}`} </h2>

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
