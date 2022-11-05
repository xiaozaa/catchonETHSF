import MintModal, { modalRef } from "./components/mintModal";

function App(props) {

  return (
    <div>
      <MintModal ref={modalRef} />
    </div>
  );
}

export default App;
