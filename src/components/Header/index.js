import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill, BsBoxArrowRight} from 'react-icons/bs'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')

    history.replace('/login')
  }

  return (
    <nav className="nav-header">
      <Link to="/" className="link-item">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="header-website-logo"
        />
      </Link>
      <ul className="mobile-nav-menu">
        <li className="nav-item">
          <Link to="/" className="link-item">
            <AiFillHome className="icon" />
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/jobs" className="link-item">
            <BsBriefcaseFill className="icon" />
          </Link>
        </li>
        <li className="nav-item" onClick={onClickLogout}>
          <BsBoxArrowRight className="icon" />
        </li>
      </ul>

      <ul className="desktop-nav-menu">
        <li className="nav-item">
          <Link to="/" className="link-item">
            <p className="nav-text">Home</p>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/jobs" className="link-item">
            <p className="nav-text">Jobs</p>
          </Link>
        </li>
      </ul>
      <div className="desk-top-btn">
        <button type="button" className="logout-btn" onClick={onClickLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}
export default withRouter(Header)
