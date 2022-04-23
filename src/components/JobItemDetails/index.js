import Cookies from 'js-cookie'
import {Component} from 'react'
import {BsBriefcase} from 'react-icons/bs'
import {GoLocation} from 'react-icons/go'
import {AiFillStar} from 'react-icons/ai'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {companyDetails: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
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
      console.log(fetchedData)
      const updatedData = {
        jobDetails: {
          companyLogoUrl: fetchedData.job_details.company_logo_url,
          companyWebsiteUrl: fetchedData.job_details.company_website_url,
          employmentType: fetchedData.job_details.employment_type,
          id: fetchedData.job_details.id,
          jobDescription: fetchedData.job_details.job_description,
          lifeAtCompany: {
            description: fetchedData.job_details.life_at_company.description,
            imageUrl: fetchedData.job_details.life_at_company.image_url,
          },
          location: fetchedData.job_details.location,
          packagePerAnnum: fetchedData.job_details.package_per_annum,
          rating: fetchedData.job_details.rating,
          title: fetchedData.job_details.title,
          skills: fetchedData.job_details.skills.map(eachSkill => ({
            skillName: eachSkill.name,
            skillImageUrl: eachSkill.image_url,
          })),
        },
        similarJobs: fetchedData.similar_jobs.map(eachJob => ({
          id: eachJob.id,
          similarTitle: eachJob.title,
          similarCompanyLogoUrl: eachJob.company_logo_url,
          similarEmploymentType: eachJob.employment_type,
          similarJobDescription: eachJob.job_description,
          similarLocation: eachJob.location,
          similarRating: eachJob.rating,
        })),
      }
      this.setState({companyDetails: updatedData})
    }
  }

  renderCompanyDetails = () => {
    const {companyDetails} = this.state
    console.log(companyDetails)
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      title,
      rating,
      location,
      packagePerAnnum,
      skills,
    } = companyDetails.jobDetails

    return (
      <div className="job-item-details-container">
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
        <h1 className="description-heading">Skills</h1>
        {skills.map(eachSkill => (
          <div className="skill-container">
            <img
              src={eachSkill.skillImageUrl}
              className="skill-image"
              alt="skill"
            />
            <p className="description">{eachSkill.skillName}</p>
          </div>
        ))}
      </div>
    )
  }

  render() {
    return <div>{this.renderCompanyDetails()}</div>
  }
}
export default JobItemDetails
