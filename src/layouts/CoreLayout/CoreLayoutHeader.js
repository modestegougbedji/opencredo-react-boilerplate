/* @flow */
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {Navbar, Nav} from 'react-bootstrap';
import {connect} from 'react-redux';
import debug from 'debug';
import {autobind} from 'core-decorators';
import config from 'app-config';
import styles from './CoreLayout.scss';
import Login from 'components/Login/Login';
import UserDropdownMenu from 'components/UserDropdownMenu/UserDropdownMenu';
import {
  loginSuccess,
  loginFailure,
  logoutRequest,
} from 'redux/modules/auth/auth-actions';

const log = debug('app:core-layout-header');

log('styles:', styles);

function showLogin() {
  const lock = new Auth0Lock(config.auth0_client_id, config.auth0_domain);

  return dispatch => {
    log('dispatch =>', dispatch);
    lock.show((err, profile, token) => {
      log(err, profile, token);
      if (err) {
        dispatch(loginFailure(err));
        return;
      }
      localStorage.setItem('profile', JSON.stringify(profile));
      localStorage.setItem('id_token', token);
      dispatch(loginSuccess(profile, token));
    });
  };
}

class CoreLayoutHeader extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    isAuthenticated: PropTypes.bool,
  };

  componentWillUpdate() {
    log('core-layout-header will update');
  }

  @autobind
  onLogin() {
    this.props.dispatch(showLogin());
  }

  @autobind
  onLogout() {
    this.props.dispatch(logoutRequest());
  }

  willReceiveProps(props) {
    log('core-layout-header will receive props', props);
  }


  render() {
    return (
      <Navbar staticTop fluid className={styles.header}>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/" className={styles.brand}>{config.name}</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <li role="presentation">
              <Link activeClassName="active" to="about">About Us</Link>
            </li>
            {this.props.isAuthenticated ?

              <UserDropdownMenu user={this.props.user} logout={this.onLogout} />
              :
              <Login onClick={this.onLogin}/>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
  };
};

export default connect(mapStateToProps)(CoreLayoutHeader);
