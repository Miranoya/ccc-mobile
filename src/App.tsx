import React, { useEffect, useState } from 'react';

/* router */
import { BrowserRouter, Route, Switch } from "react-router-dom";

/* screens */
import Template from './screens/TemplateScreen';
import  HomeScreen  from './screens/HomeScreen';
import  PostScreen from './screens/PostScreen';
import './App.css';

/* components */
import Modal from 'react-modal';
import ConfirmModal from './components/ConfirmModal';


function App() {
  const [modalIsOpen, setIsOpen] = useState(true);
  const [existsData, setExistsData] = useState(false);

  const setModalIsOpen = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    if(localStorage.getItem("userInfo")) {
      setExistsData(true);
      console.log("データあり");
    } else {
      setExistsData(false);
      console.log("データなし");
    }
  });

  return (
    <div className="App">
      <BrowserRouter>
        <Template/>

        <div>
          {existsData
            ? <div></div> 
            : (() =>{
              return <div> でーたが入っていません
                        <Modal isOpen = {modalIsOpen}>
                          <ConfirmModal modalIsOpen={modalIsOpen}  setIsOpen={setIsOpen} />
                        </Modal>
                     </div>
            })()
          }
        </div>

        
        <Switch>
          <Route exact path="/" component={() => <HomeScreen />} />
          <Route exact path="/post" component={() => <PostScreen />} />
        </Switch>
      </BrowserRouter>
      {/*<button onClick={() => localStorage.clear()}>Storage clear</button>*/}
    </div>
  );
}

export default App;
