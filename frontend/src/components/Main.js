import React, {Component} from 'react';
import {Route} from 'react-router-dom';
// import Navbar from './LandingPage/Navbar';
import LandingPage from './LandingPage/LandingPage';
import Login from './Login/Login';
// import Signup from './Signup/Signup';
// import Dashboard from './Dashboard/Dashboard';
// import Profile from './Profile/Profile';
// import CreateGroup from './Groups/CreateGroup';
// import MyGroups from './Groups/MyGroups';
// import GroupPage from './Groups/GroupPage';
// import RecentActivity from './RecentActivity/RecentActivity';
//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route exact path="/" component={LandingPage}/>
                <Route path="/login" component={Login}/>
                {/* <Route path="/signup" component={Signup}/>
                <Route path="/dashboard" component={Dashboard}/>
                <Route path="/profile" component={Profile} />
                <Route path="/creategroup" component={CreateGroup} />
                <Route exact path="/mygroups" component={MyGroups} />
                <Route exact path="/grouppage/:groupid" component={GroupPage}/>
                <Route path="/recentactivity" component={RecentActivity} /> */}
            </div>
        )
    }
}
//Export The Main Component
export default Main;