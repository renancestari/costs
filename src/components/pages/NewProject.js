import { useNavigate } from 'react-router-dom'

import ProjectForm from '../project/ProjectForm'

import styles from './NewProject.module.css'

function NewProject() {

    const navigate = useNavigate()

    function createPost(project) {
        project.costs = 0
        project.services = []

        fetch("http://localhost:5000/projects", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project)
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data)
            navigate('/projects', { state: {message: 'Successfully created project!'}})
        })
        .catch(err => console.log(err))
    }

    return (
        <div className={styles.newproject_container}>
            <h1>Create Project</h1>
            <p>Create your project to manage costs</p>
            <ProjectForm handleSubmit={createPost} btnText="Create project"/>
        </div>
    )
}

export default NewProject