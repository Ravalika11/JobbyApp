import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
}

const apiJobsStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    apiJobsStatus: apiJobsStatusConstants.initial,
    profileDetails: {},
    employmentType: [],
    minimumPackage: '',
    jobsList: [],
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({apiStatus: apiStatusConstants.in_progress})

    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      const profileDetails = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        apiStatus: apiStatusConstants.success,
        profileDetails,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getJobsData = async () => {
    const {searchInput, minimumPackage, employmentType} = this.state
    const employmentTypes = employmentType.join(',')

    this.setState({apiJobsStatus: apiJobsStatusConstants.in_progress})

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypes}&minimum_package=${minimumPackage}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const jobsData = data.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      this.setState({
        apiJobsStatus: apiJobsStatusConstants.success,
        jobsList: jobsData,
      })
    } else {
      this.setState({apiJobsStatus: apiJobsStatusConstants.failure})
    }
  }

  onChangeSearchValue = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickRetryProfile = () => {
    this.getProfileData()
  }

  onClickRetryJobs = () => {
    this.getJobsData()
  }

  onClickSearch = () => {
    this.getJobsData()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  onSelectEmploymentType = event => {
    const {employmentType} = this.state
    const employmentNotInList = employmentType.filter(
      eachItem => eachItem === event.target.id,
    )
    if (employmentNotInList.length === 0) {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, event.target.id],
        }),
        this.getJobsData,
      )
    } else {
      const filteredData = employmentType.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState({employmentType: filteredData}, this.getJobsData)
    }
  }

  onChangeSalaryRange = event => {
    this.setState({minimumPackage: event.target.id}, this.getJobsData)
  }

  renderSearch = () => {
    const {searchInput} = this.state
    return (
      <>
        <input
          type="search"
          className="input-search-element"
          placeholder="Search"
          onChange={this.onChangeSearchValue}
          onKeyDown={this.onEnterSearchInput}
          value={searchInput}
        />
        <button
          type="button"
          data-testid="searchButton"
          className="search-button"
          onClick={this.onClickSearch}
        >
          <BsSearch className="search-icon" />.
        </button>
      </>
    )
  }

  renderProfileData = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="name">{name}</h1>
        <p className="short-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <div className="profile-failure-container">
      <button
        type="button"
        className="retry-btn"
        onClick={this.onClickRetryProfile}
      >
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onRenderProfile = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileData()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.in_progress:
        return this.renderLoader()
      default:
        return null
    }
  }

  renderEmploymentTypes = () => (
    <div>
      <h1 className="employment-title">Type of Employment</h1>
      <ul className="employment-list-container">
        {employmentTypesList.map(eachItem => (
          <li className="employment-list-item" key={eachItem.employmentTypeId}>
            <input
              type="checkbox"
              className="checkbox"
              id={eachItem.employmentTypeId}
              onChange={this.onSelectEmploymentType}
            />
            <label
              htmlFor={eachItem.employmentTypeId}
              className="employment-type"
            >
              {eachItem.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderSalaryRanges = () => (
    <div>
      <h1 className="salary-title">Salary Range</h1>
      <ul className="salary-list-container">
        {salaryRangesList.map(eachItem => (
          <li className="salary-list-item" key={eachItem.salaryRangeId}>
            <input
              type="radio"
              className="radio"
              id={eachItem.salaryRangeId}
              onChange={this.onChangeSalaryRange}
            />
            <label htmlFor={eachItem.salaryRangeId} className="salary-range">
              {eachItem.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderJobs = () => {
    const {jobsList} = this.state

    return jobsList.length !== 0 ? (
      <div className="jobs-list">
        <div className="desktop-search-container">{this.renderSearch()}</div>
        <ul className="jobs-list-container">
          {jobsList.map(eachJob => (
            <JobItem jobDetails={eachJob} key={eachJob.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-jobs-container">
        <div className="desktop-no-jobs-search-container">
          {this.renderSearch()}
        </div>
        <div className="no-job-details">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-img"
          />
          <h1 className="no-jobs-title">No Jobs Found</h1>
          <p className="no-jobs-text">
            We could not find any jobs. Try other filters.
          </p>
        </div>
      </div>
    )
  }

  renderJobsFailureView = () => (
    <div className="jobs-failure-container">
      <div className="desktop-failure-search-container">
        {this.renderSearch()}
      </div>
      <div className="failure-details">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
          alt="failure view"
          className="failure-img"
        />
        <h1 className="failure-title">Oops! Something Went Wrong</h1>
        <p className="failure-text">
          We cannot seem to find the page you are looking for.
        </p>
        <button
          type="button"
          className="retry-btn"
          onClick={this.onClickRetryJobs}
        >
          Retry
        </button>
      </div>
    </div>
  )

  onRenderJobData = () => {
    const {apiJobsStatus} = this.state

    switch (apiJobsStatus) {
      case apiJobsStatusConstants.success:
        return this.renderJobs()
      case apiJobsStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiJobsStatusConstants.in_progress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="app-container">
          <div className="mobile-search-container">{this.renderSearch()}</div>
          <div className="sidebar-container">
            <div className="container">
              {this.onRenderProfile()}
              <hr className="hr-line" />
              {this.renderEmploymentTypes()}
              <hr className="hr-line" />
              {this.renderSalaryRanges()}
            </div>
            <div className="jobs-container">{this.onRenderJobData()}</div>
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
