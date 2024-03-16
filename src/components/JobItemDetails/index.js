import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill, BsBoxArrowUpRight} from 'react-icons/bs'

import Header from '../Header'
import SimilarJobItems from '../SimilarJobItems'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetails: {},
    similarJobsList: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  onClickRetry = () => {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.in_progress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      const jobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        skills: data.job_details.skills.map(eachItem => ({
          imageUrl: eachItem.image_url,
          name: eachItem.name,
        })),
        title: data.job_details.title,
        lifeAtCompany: (data.job_details.life_at_company = {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        }),
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
      }
      const similarJobs = data.similar_jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      this.setState({
        apiStatus: apiStatusConstants.success,
        jobDetails,
        similarJobsList: similarJobs,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobsDetails = () => {
    const {jobDetails, similarJobsList} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
      title,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
    } = jobDetails
    return (
      <>
        <div className="job-item-details-container">
          <div className="job-details-company-details">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-details-company-logo"
            />
            <div className="job-details-job-item">
              <h1 className="job-details-title">{title}</h1>
              <div className="job-details-rating-container">
                <FaStar className="job-details-star-icon" />
                <p className="job-details-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-item-card-details">
            <div className="job-item-location-employment-details">
              <div className="job-details-location-container">
                <MdLocationOn className="job-details-location-icon" />
                <p className="job-details-location">{location}</p>
              </div>
              <div className="job-details-item-employment-container">
                <BsBriefcaseFill className="job-details-job-icon" />
                <p className="job-item-details-employment-type">
                  {employmentType}
                </p>
              </div>
            </div>
            <p className="job-details-package">{packagePerAnnum}</p>
          </div>
          <hr className="hr-line" />
          <div className="description-link-container">
            <h1 className="job-item-details-title">Description</h1>
            <div className="company-website-container">
              <a
                href={companyWebsiteUrl}
                target="/blank"
                className="company-website"
              >
                Visit
              </a>
              <BsBoxArrowUpRight className="link-icon" />
            </div>
          </div>
          <p className="job-item-details-description">{jobDescription}</p>
          <h1 className="job-item-details-title">Skills</h1>
          <ul className="skills-list-container">
            {skills.map(eachItem => (
              <li className="skills-list-item" key={eachItem.name}>
                <img
                  src={eachItem.imageUrl}
                  alt={eachItem.name}
                  className="skills-img"
                />
                <p className="skills-name">{eachItem.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="job-item-details-title">Life at Company</h1>
          <div className="life-at-company-container">
            <p className="job-item-details-description">
              {lifeAtCompany.description}
            </p>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-at-company-img"
            />
          </div>
        </div>
        <h1 className="similar-jobs-title"> Similar Jobs </h1>
        <ul className="similar-jobs-list-container">
          {similarJobsList.map(eachItem => (
            <SimilarJobItems jobDetails={eachItem} key={eachItem.id} />
          ))}
        </ul>
      </>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="job-item-details-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        alt="failure view"
        className="job-item-details-failure-img"
      />
      <h1 className="job-item-details-failure-title">
        Oops! Something Went Wrong
      </h1>
      <p className="job-item-details-failure-text">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="job-item-details-retry-btn"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  renderAllJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.in_progress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-container">
          {this.renderAllJobDetails()}
        </div>
      </>
    )
  }
}
export default JobItemDetails
