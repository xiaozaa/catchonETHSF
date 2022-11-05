import OperateModal, { modalRef } from "./components/operateModal";

function App(props) {

  return (
    <div>
      <OperateModal ref={modalRef} />
    </div>
  );
}

export default App;
