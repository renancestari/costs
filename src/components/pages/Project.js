import { parse, v4 as uuidv4 } from 'uuid'

import styles from './Project.module.css'

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Loading from '../layout/Loading'
import Container from '../layout/Container'
import Message from '../layout/Message'
import ProjectForm from '../project/ProjectForm'
import ServiceForm from '../service/ServiceForm'
import ServiceCard from '../service/ServiceCard'

function Project() {

    let { id } = useParams()

    const [project, setProject] = useState([])
    const [services, setServices] = useState ([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState('')
    const [type, setType] = useState('success')

    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
                method: 'GET',
                header: {
                    'Content-Type': 'application/json',
                },
            })
            .then(resp => resp.json())
            .then((data) => {
                setProject(data)
                setServices(data.services)
            })
            .catch((err) => console.log)
        }, 300)
    }, [id])

    function editPost(project) {

        setMessage('')

        if(project.budget < project.costs) {
            setMessage('A budget cannot be less than the cost of the project!')
            setType('error')
            return false
        }

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project),
        })
        .then(resp => resp.json())
        .then((data) => {
            setProject(data)
            setShowProjectForm(!showProjectForm)
            setMessage('A project has been successfully updated!')
            setType('success')
        })
        .catch(err => console.log(err))
    }

    function createService(project) {

        setMessage('')

        const lastService = project.services[project.services.length - 1]
    
        lastService.id = uuidv4()
    
        const lastServiceCost = lastService.costs
    
        const newCost = parseFloat(project.costs) + parseFloat(lastServiceCost)
    
        if (newCost > parseFloat(project.budget)) {
          setMessage('Budget exceeded, please check the service cost!')
          setType('error')
          setTimeout(() => {setMessage('');}, 3000)
          project.services.pop()
          return false
        }

        project.costs = newCost

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
        .then((resp) => resp.json())
        .then((data) => {
            setServices(data.services)
            setShowServiceForm(!setShowServiceForm)
        })
        .catch((err) => console.log(err))
      }

    function removeService(id, cost) {

        const servicesUpdated = project.services.filter(
            (service) => service.id !== id
        )

        const projectUpdated = project

        projectUpdated.services = servicesUpdated
        projectUpdated.costs = parseFloat(projectUpdated.costs) - parseFloat(cost)

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectUpdated),
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(projectUpdated)
            setServices(servicesUpdated)
            setMessage('Service removed successfully!')
        .catch((err) => console.log(err))
        })

    }

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm)
    }

    return (
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    <Container customClass="column">
                        {message && <Message type={type} msg={message} />}
                        <div className={styles.details_container}>
                            <h1>Project: {project.name}</h1>
                            <button className={styles.btn} onClick={toggleProjectForm}>
                                {!showProjectForm ? 'Edit project' : 'Close project'}
                            </button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p>
                                        <span>Category:</span> {project.category.name}
                                    </p>
                                    <p>
                                        <span>Total budget:</span> US${project.budget}
                                    </p>
                                    <p>
                                        <span>Total used:</span> US${project.costs}
                                    </p>
                                </div>
                            ) : (
                                <div className={styles.project_info}>
                                    <ProjectForm
                                        handleSubmit={editPost}
                                        btnText="To conclude editing"
                                        projectData={project}
                                    />
                                </div>
                            )}
                        </div>

                        <div className={styles.service_form_container}>
                            <h2>Add a service:</h2>
                            <button className={styles.btn} onClick={toggleServiceForm}>
                                {!showServiceForm ? 'Add service' : 'Close'}
                            </button>
                            <div className={styles.project_info}>
                                {showServiceForm && (
                                <ServiceForm
                                    handleSubmit={createService}
                                    btnText="Add service"
                                    projectData={project}
                                />
                                )}
                            </div>
                        </div>
                        <h2>Services</h2>
                        <Container customClass="start">
                            {services.length > 0 && 
                                services.map((service) => (
                                    <ServiceCard
                                        id={service.id}
                                        name={service.name}
                                        cost={service.costs}
                                        description={service.description}
                                        key={service.id}
                                        handleRemove={removeService}
                                    />
                                ))
                            }
                            {services.length === 0 && <p>There are no registered services!</p>}
                        </Container>
                    </Container>
                </div>
            ) : (
                <Loading />)}
        </>
    )
}

export default Project