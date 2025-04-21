import styles from './Home.module.css'

function Home() {
  return (
    <div className={styles.content}>
      <h1>Welcome to TalkNYU</h1>
      <p>Somehow you've stumbled onto this site.
        This project was made for me to practice React, CSS, and Ruby on Rails before my job.<br />
        Hopefully all the features work as expected</p>
    </div>
  )
}

export default Home