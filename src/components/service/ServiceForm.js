import { useState } from 'react'

import Input from '../form/input'
import SubmitButton from '../form/SubmitButton'

import styles from '../project/ProjectForm.module.css'

function ServiceForm({ handleSubmit, btnText, projectData }) {

    const [service, setService] = useState([])

    function submit(e) {
        e.preventDefault()
        projectData.services.push(service)
        handleSubmit(projectData)
    }

    function handleChange(e) {
        setService({ ...service, [e.target.name]: e.target.value })
    }

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input
                type="text"
                text="Service name"
                name="name"
                placeholder="Insert name service"
                handleOnChange={handleChange}
            />
            <Input
                type="number"
                text="Service cost"
                name="costs"
                placeholder="Insert total cost"
                handleOnChange={handleChange}
            />
            <Input
                type="text"
                text="Description service"
                name="description"
                placeholder="Describe the service"
                handleOnChange={handleChange}
            />
            <SubmitButton text={btnText} />
        </form>
    )
}

export default ServiceForm