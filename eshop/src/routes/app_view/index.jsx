import { useOutletContext } from "react-router-dom";

export function Index() {
  const [appMeta] = useOutletContext();
  return <div>Welcome to your Store {`${appMeta.name}`}</div>;
}
