/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import NavigationBar from './components/NavBar/NavBar';
import Login from './components/Login/Login';
import Landing from './components/Landing';
import SignUp from './components/SignUp/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBarLoggedIn from './components/NavBarLoggedIn/NavBarLoggedIn';
import YourAccount from './components/YourAccount/YourAccount';
import GroupPage from './components/GroupPage/GroupPage';
import AddGroups from './components/AddGroups/AddGroups';
import RecentActivity from './components/RecentActivity/RecentActivity';
import GroupDetails from './components/GroupDetails/GroupDetails';
import endPointObj from './endPointUrl';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    Axios.get(endPointObj.url + 'login')
      .then((response) => {
        // eslint-disable-next-line no-console
        setLoggedIn(true);
      })
      .catch((e) => {
        console.log(e);
      });

    // getAccountInfo(response.email)
  }, [location]);

  const SignUpContainer = () => (
    // eslint-disable-next-line react/jsx-filename-extension
    <div className="Container">
      <Route path="/signUp" component={SignUp} />
    </div>
  );

  const GroupRoute = () => (
    <div className="Container">
      <NavBarLoggedIn />
      <Route path="/groupPage" component={GroupPage} />
    </div>
  );

  const AddGroupRoute = () => (
    <div className="Container">
      <NavBarLoggedIn />
      <Route path="/addGroups" component={AddGroups} />
    </div>
  );

  const DashboardRoute = () => (
    <div className="Container">
      <NavBarLoggedIn />
      <Route path="/dashboard" component={Dashboard} />
    </div>
  );

  const AccountRoute = () => (
    <div className="Container">
      <NavBarLoggedIn />
      <Route path="/account" component={YourAccount} />
    </div>
  );

  const RecentAct = () => (
    <div className="Container">
      <NavBarLoggedIn />
      <Route path="/recent" component={RecentActivity} />
    </div>
  );

  const GroupDetailsContainer = () => (
    <div className="Container">
      <NavBarLoggedIn />
      <Route path="/gpDetails" component={GroupDetails} />
    </div>
  );

  const DefaultContainer = () => (
    <div>
      <div>
        <NavigationBar />

        <Route path="/" exact component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/signUp" component={SignUp} />
      </div>
    </div>
  );

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <Router>
      <div className="App">
        <Switch>
          <Route path="/groupPage" component={GroupRoute} />
          <Route path="/addGroups" component={AddGroupRoute} />
          <Route path="/dashboard" component={DashboardRoute} />
          <Route path="/Account" component={AccountRoute} />
          <Route path="/recent" component={RecentAct} />
          <Route path="/gpDetails" component={GroupDetailsContainer} />
          <Route exact path="/signUp" component={SignUpContainer} />

          <Route component={DefaultContainer} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
