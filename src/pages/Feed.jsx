import { useState, useEffect } from "react"
import styles from "./Feed.module.css"

const apiUrl = import.meta.env.VITE_API_URL

function Post({ owner, title, body }) {
  return (
    <div className={styles.post}>
      <div className={styles.post_header}>
        <p className={styles.post_title}>{title}</p>
        <p >Post by {owner}</p>
      </div>
      <p>{body}</p>
    </div>
  )
}

// Note that currently the feed for every user is the same, it's more like a forum than twitter
function Feed() {
  const [feedData, setFeedData] = useState([])

  useEffect(() => {
    const getFeed = async () => {
      try {
        const response = await fetch(apiUrl + '/posts')

        if (!response.ok) {
          throw new Error("Fetching posts failed")
        }

        const data = await response.json()
        setFeedData(data)
      } catch (err) {
        console.log(err)
      }
    }

    getFeed()
  }, [])

  return (
    <div className={styles.container}>
      {feedData.map((post, index) => (
        <Post
          key={post.id}
          owner={post.owner}
          title={post.title}
          body={post.body} />
      ))}
    </div>
  )
}

export default Feed