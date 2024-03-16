import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimilarJobItems = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetails
  return (
    <li className="similar-job-list-item">
      <div className="similar-job-company-details">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="similar-job-company-logo"
        />
        <div className="similar-job-item-details">
          <h1 className="similar-job-item-title">{title}</h1>
          <div className="similar-job-rating-container">
            <FaStar className="similar-job-star-icon" />
            <p className="similar-job-rating">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="similar-item-title">Description</h1>
      <p className="similar-job-item-description">{jobDescription}</p>
      <div className="similar-job-location-employment-details">
        <div className="similar-job-location-container">
          <MdLocationOn className="similar-job-location-icon" />
          <p className="similar-job-location">{location}</p>
        </div>
        <div className="similar-job-item-employment-container">
          <BsBriefcaseFill className="similar-item-job-icon" />
          <p className="similar-job-item-employment-type">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}
export default SimilarJobItems
