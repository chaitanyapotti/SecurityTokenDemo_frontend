import React, { PureComponent } from "react";
import { Link, withRouter } from "react-router-dom";

class Navbar extends PureComponent {
  render() {
    return (
      <nav className="navbar navbar-expand-sm navbar-light bg-primary mb-4 fixed-top">
        <div className="container">
          <img src="/assets/TWO12BlkWht.png" alt="whitelist checked" width="120" height="35" />
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile-nav">
            <span className="navbar-toggler-icon" />
          </button>
          {localStorage.jwtToken ? (
            <div className="collapse navbar-collapse" id="mobile-nav">
              <ul className="nav nav-pills ml-auto">
                <li className="nav-item">
                  <Link className="nav-link active" to="/">
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <div />
          )}
        </div>
      </nav>
    );
  }
}

export default withRouter(Navbar);
