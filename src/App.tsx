import React from 'react';

/* router */
import { BrowserRouter, Route, Switch } from "react-router-dom";

/* screens */
import Template from './screens/TemplateScreen';
import HomeScreen  from './screens/HomeScreen';
import PostScreen from './screens/PostScreen';
import SpotDetailScreen from './screens/SpotDetailScreen';
import './App.css';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Template/>
        <Switch>
          <Route exact path="/civ" component={() => <HomeScreen />} />
          <Route exact path="/civ/post" component={() => <PostScreen />} />
          <Route exact path="/civ/detail" component={() => <SpotDetailScreen />} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
