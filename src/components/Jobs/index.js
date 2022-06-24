import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiOutlineSearch, AiFillStar} from 'react-icons/ai'
import {BsBriefcase} from 'react-icons/bs'
import {GoLocation} from 'react-icons/go'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    searchInput: '',
    activeEmploymentType: [],
    packagePerAnnum: '',
    apiStatus: apiStatusConstants.initial,
    profileDetails: {},
  }

  componentDidMount() {
    this.getJobsData()
    this.getProfileDetails()
  }

  getJobsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {activeEmploymentType, packagePerAnnum, searchInput} = this.state

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmploymentType}&minimum_package=${packagePerAnnum}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        location: eachJob.location,
        jobDescription: eachJob.job_description,
        packagePerAnnum: eachJob.package_per_annum,
        title: eachJob.title,
        rating: eachJob.rating,
      }))

      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderNoJobView = () => (
    <div className="no-job-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        className="no-job-image"
        alt="no jobs"
      />
      <h1 className="no-job-heading">No Jobs Found</h1>
      <p className="no-job-description">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  renderJobDetailsCard = () => {
    const {jobsList} = this.state
    return jobsList.length === 0 ? (
      this.renderNoJobView()
    ) : (
      <div className="jobs-details-container">
        <ul className="jobs-list-container">
          {jobsList.map(eachJob => {
            const {
              id,
              companyLogoUrl,
              title,
              rating,
              jobDescription,
              location,
              packagePerAnnum,
              employmentType,
            } = eachJob
            return (
              <li className="job-details-card" key={eachJob.id}>
                <Link to={`/jobs/${id}`} className="link-item">
                  <div className="company-logo-title">
                    <img
                      src={companyLogoUrl}
                      className="company-logo"
                      alt="job details company logo"
                    />
                    <div>
                      <h1 className="title">{title}</h1>
                      <div className="rating-container">
                        <AiFillStar className="star-icon" />
                        <p className="rating">{rating}</p>
                      </div>
                    </div>
                  </div>
                  <div className="location-employment-type">
                    <div className="location-employment">
                      <div className="location-container">
                        <GoLocation className="icons" />
                        <p className="description-text">{location}</p>
                      </div>
                      <div className="employment-type-container">
                        <BsBriefcase className="icons" />
                        <p className="description-text">{employmentType}</p>
                      </div>
                    </div>
                    <p className="package-per-annum">{packagePerAnnum}</p>
                  </div>
                  <hr className="hr-line" />
                  <h1 className="description-heading">Description</h1>
                  <p className="description">{jobDescription}</p>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  renderJobDetailsBasedOnApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsCard()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickRetryButton = () => {
    this.getJobsData()
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        onClick={this.onClickRetryButton}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const profileApi = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(profileApi, options)
    const fetchedData = await response.json()
    const updatedDetails = {
      name: fetchedData.profile_details.name,
      profileImageUrl: fetchedData.profile_details.profile_image_url,
      shortBio: fetchedData.profile_details.short_bio,
    }
    this.setState({profileDetails: updatedDetails})
  }

  renderProfileContainer = () => {
    const {profileDetails} = this.state

    const {profileImageUrl, name, shortBio} = profileDetails
    return (
      <div className="profile-container">
        <img src={profileImageUrl} className="profile-image" alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="designation">{shortBio}</p>
      </div>
    )
  }

  onClickSearchInput = searchInput => {
    this.setState({searchInput})
  }

  onClickSearchIcon = () => {
    const {searchInput} = this.state
    this.setState({searchInput}, this.getJobsData)
  }

  onChangeEmploymentType = employmentTypeId => {
    const {activeEmploymentType} = this.state
    const updatedTypeId = [...activeEmploymentType, employmentTypeId]
    this.setState({activeEmploymentType: updatedTypeId}, this.getJobsData)
  }

  onChangeSalaryRange = salaryRangeId => {
    this.setState({packagePerAnnum: salaryRangeId}, this.getJobsData)
  }

  renderTypeOfEmploymentCard = () => {
    const {employmentTypesList} = this.props

    return (
      <div className="type-of-employment-container">
        <h1 className="main-heading">Type of Employment</h1>
        <ul className="employment-types-list">
          {employmentTypesList.map(eachType => {
            const {label} = eachType
            const onClickEmploymentType = () =>
              this.onChangeEmploymentType(eachType.employmentTypeId)
            return (
              <li key={eachType.employmentTypeId}>
                <input
                  type="checkbox"
                  id="checkbox"
                  value={label}
                  onClick={onClickEmploymentType}
                />
                <label htmlFor="checkbox" key={label} className="list-item">
                  {label}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  renderSalaryRangesCard = () => {
    const {salaryRangesList} = this.props

    return (
      <div className="type-of-employment-container">
        <h1 className="main-heading">Salary Range</h1>
        <ul className="employment-types-list">
          {salaryRangesList.map(eachType => {
            const {label} = eachType
            const onClickSalaryRange = () =>
              this.onChangeSalaryRange(eachType.salaryRangeId)
            return (
              <li key={eachType.salaryRangeId}>
                <input
                  type="radio"
                  id="radio"
                  value={label}
                  onClick={onClickSalaryRange}
                />
                <label htmlFor="radio" key={label} className="list-item">
                  {label}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  renderSearchContainer = () => {
    const {searchInput} = this.state
    const onChangeSearchInput = event =>
      this.onClickSearchInput(event.target.value)

    const onClickSearchButton = () => {
      this.onClickSearchIcon(searchInput)
    }

    return (
      <div className="search-container">
        <input
          type="search"
          placeholder="Search"
          value={searchInput}
          onChange={onChangeSearchInput}
          className="search-element"
        />
        <button
          type="button"
          testid="searchButton"
          onClick={onClickSearchButton}
          className="search-button"
        >
          <AiOutlineSearch className="search-icon" size={24} />
        </button>
      </div>
    )
  }

  render() {
    return (
      <div className="jobs-container">
        <Header />
        <div className="responsive-container">
          <div className="filtering-container">
            {this.renderProfileContainer()}
            <hr className="hr-line" />
            {this.renderTypeOfEmploymentCard()}
            <hr className="hr-line" />
            {this.renderSalaryRangesCard()}
          </div>
          <div className="jobs-display-container">
            {this.renderSearchContainer()}
            {this.renderJobDetailsBasedOnApiStatus()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
