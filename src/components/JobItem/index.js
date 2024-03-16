import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const JobItem = props => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  const {jobDetails} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="job-item-link">
      <li className="job-item">
        <div className="company-details">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="job-details">
            <h1 className="job-title">{title}</h1>
            <div className="rating-container">
              <FaStar className="star-icon" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="job-item-details">
          <div className="location-employment-details">
            <div className="location-container">
              <MdLocationOn className="location-icon" />
              <p className="location">{location}</p>
            </div>
            <div className="job-item-employment-container">
              <BsBriefcaseFill className="job-icon" />
              <p className="job-item-employment-type">{employmentType}</p>
            </div>
          </div>
          <p className="package">{packagePerAnnum}</p>
        </div>
        <hr className="hr-line" />
        <h1 className="description-title">Description</h1>
        <p className="job-description">{jobDescription}</p>
      </li>
    </Link>
  )
}
export default JobItem
