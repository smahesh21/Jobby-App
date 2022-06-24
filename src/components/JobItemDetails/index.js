import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {FiExternalLink} from 'react-icons/fi'
import Loader from 'react-loader-spinner'

import {Component} from 'react'
import {BsBriefcase} from 'react-icons/bs'
import {GoLocation} from 'react-icons/go'
import {AiFillStar} from 'react-icons/ai'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    companyDetails: {},
    similarJobs: [],
    jobSkills: [],
    lifeAtCompany: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getFormattedJobDetails = fetchedData => ({
    companyLogoUrl: fetchedData.company_logo_url,
    companyWebsiteUrl: fetchedData.company_website_url,
    employmentType: fetchedData.employment_type,
    id: fetchedData.id,
    jobDescription: fetchedData.job_description,
    lifeAtCompany: {
      description: fetchedData.life_at_company.description,
      imageUrl: fetchedData.life_at_company.image_url,
    },
    location: fetchedData.location,
    packagePerAnnum: fetchedData.package_per_annum,
    rating: fetchedData.rating,
    title: fetchedData.title,
    skills: fetchedData.skills.map(eachSkill => ({
      skillName: eachSkill.name,
      skillImageUrl: eachSkill.image_url,
    })),
  })

  getFormattedSimilarJobDetails = eachJob => ({
    id: eachJob.id,
    similarTitle: eachJob.title,
    similarCompanyLogoUrl: eachJob.company_logo_url,
    similarEmploymentType: eachJob.employment_type,
    similarJobDescription: eachJob.job_description,
    similarLocation: eachJob.location,
    similarRating: eachJob.rating,
  })

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()

      const jobDetails = this.getFormattedJobDetails(fetchedData.job_details)

      const similarJobsDetails = fetchedData.similar_jobs.map(eachJob =>
        this.getFormattedSimilarJobDetails(eachJob),
      )
      console.log(jobDetails)
      console.log(similarJobsDetails)
      this.setState({
        companyDetails: jobDetails,
        similarJobs: similarJobsDetails,
        jobSkills: jobDetails.skills,
        lifeAtCompany: jobDetails.lifeAtCompany,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSimilarJobs = () => {
    const {similarJobs} = this.state
    return (
      <ul className="similarjobs-container">
        {similarJobs.map(eachJob => (
          <li className="similar-jobs-container" key={eachJob.id}>
            <div className="company-logo-title">
              <img
                src={eachJob.similarCompanyLogoUrl}
                className="company-logo"
                alt="similar job company logo"
              />
              <div>
                <h1 className="title">{eachJob.similarTitle}</h1>
                <div className="rating-container">
                  <AiFillStar className="star-icon" />
                  <p className="rating">{eachJob.similarRating}</p>
                </div>
              </div>
            </div>

            <h1 className="main-heading">Description</h1>
            <p className="description">{eachJob.similarJobDescription}</p>
            <div className="location-employment-type">
              <div className="location-employment">
                <div className="location-container">
                  <GoLocation className="icons" />
                  <p className="description-text">{eachJob.similarLocation}</p>
                </div>
                <div className="employment-type-container">
                  <BsBriefcase className="icons" />
                  <p className="description-text">
                    {eachJob.similarEmploymentType}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  renderCompanyDetails = () => {
    const {companyDetails, jobSkills, lifeAtCompany} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = companyDetails
    const {description, imageUrl} = lifeAtCompany

    return (
      <div>
        <div className="job-details-card">
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
          <div className="website-url-section">
            <h1 className="main-heading">Description</h1>
            <div>
              <a href={companyWebsiteUrl} className="visit">
                Visit
              </a>
              <FiExternalLink size={20} className="nav-icon" />
            </div>
          </div>
          <p className="description">{jobDescription}</p>
          <h1 className="main-heading">Skills</h1>
          <ul className="skill-container">
            {jobSkills.map(eachSkill => (
              <li className="skill-image-name" key={eachSkill.skillName}>
                <img
                  src={eachSkill.skillImageUrl}
                  className="skill-image"
                  alt={eachSkill.skillName}
                />
                <p className="skill-name">{eachSkill.skillName}</p>
              </li>
            ))}
          </ul>
          <div className="life-at-office-container">
            <h1 className="main-heading">Life at Company</h1>
            <div className="life-at-office">
              <p className="description">{description}</p>
              <img
                src={imageUrl}
                className="life-at-office-image"
                alt="life at company"
              />
            </div>
          </div>
        </div>
        <h1 className="main-heading">Similar Jobs</h1>
        {this.renderSimilarJobs()}
      </div>
    )
  }

  renderLoader = () => (
    <div testid="loader" className="loader-container">
      <Loader type="ThreeDots" width={80} height={80} color="#ffffff" />
    </div>
  )

  onClickRetryButton = () => {
    this.getJobDetails()
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

  renderJobDetailsBasedOnApi = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderCompanyDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="job-item-details-container">
          {this.renderJobDetailsBasedOnApi()}
        </div>
      </div>
    )
  }
}

export default JobItemDetails
