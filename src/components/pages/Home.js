import styles from './Home.module.css'
import cofrinho from '../../img/cofrinho.png'

import LinkButton from '../layout/LinkButton'

function Home() {
    return (
        <section className={styles.home_container}>
            <h1>welcome to <span>Costs</span></h1>
            <p>Manage your projects with ease!</p>
            <LinkButton to="/newproject" text="Create your project" />
            <img src={cofrinho} alt="Pig" />
        </section>
    )
}

export default Home