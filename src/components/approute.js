import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  Link
} from 'react-router-dom';
import { connect } from 'react-redux'
import routers from '../routers/index'
import Cookies from 'js-cookie';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    let token = this.props.token
    console.log(this.props)
    return (
      <Router>
        <div>
          <Switch>
            {routers.map((item, index) => {
              return <Route key={index} path={item.path} exact render={props =>
              (!item.check_login ? (<item.component {...props} />) : (token ? <item.component {...props} /> :

                <item.component {...props} render={
                  () =>
                    <Redirect to='/login' push />
                } />
                // <Route exact path="/" render={() => <Redirect to="/home/page1" push />} />
              )
              )} />
            })}
          </Switch>
        </div></Router>
    )
  }
}

// redux拿到token并挂载到App的props上面
const mapStateToProps = () => {

  return { token: Cookies.get('token') }
}

export default connect(mapStateToProps)(App)