import {Link, withRouter} from 'react-router-dom'
import {AiOutlineHome} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'
import {BsBriefcase} from 'react-icons/bs'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
    console.log('LoggedOut')
  }
  return (
    <nav className="nav-container">
      <div className="header-container">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            className="website-logo"
            alt="website logo"
          />
        </Link>
        <ul className="desktop-nav-items-container">
          <Link to="/" className="nav-link">
            <li className="nav-item">Home</li>
          </Link>
          <Link to="/jobs" className="nav-link">
            <li className="nav-item">Jobs</li>
          </Link>
        </ul>
        <ul className="mobile-nav-items-container">
          <Link to="/" className="nav-link">
            <button type="button" className="button-icon">
              <AiOutlineHome size="30" />
            </button>
          </Link>
          <Link to="/jobs" className="nav-link">
            <button type="button" className="button-icon">
              <BsBriefcase size="30" />
            </button>
          </Link>
        </ul>
        <div>
          <button
            type="button"
            onClick={onClickLogout}
            className="desktop-logout-button"
          >
            Logout
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={onClickLogout}
            className="mobile-logout-button"
          >
            <FiLogOut size={24} className="logout-icon" />
          </button>
        </div>
      </div>
    </nav>
  )
}
export default withRouter(Header)
