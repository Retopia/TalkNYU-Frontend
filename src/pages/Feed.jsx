import { useState, useEffect } from "react"
import { useSearchParams } from "react-router"
import { Search, ThumbsUp, Share, MessageSquareMore } from "lucide-react"
import styles from "./Feed.module.css"

const apiUrl = import.meta.env.VITE_API_URL

function calculateData(created_at) {
  const date = new Date(created_at);
  const now = new Date();
  const difference = Math.floor((now - date) / 1000);

  const days = Math.floor(difference / 86400);
  const hours = Math.floor(difference / 3600);
  const minutes = Math.floor(difference / 60);
  const seconds = difference;

  let res = "";

  if (days >= 1) {
    res = `${days} day${days > 1 ? "s" : ""}`;
  } else if (hours >= 1) {
    res = `${hours} hour${hours > 1 ? "s" : ""}`;
  } else if (minutes >= 1) {
    res = `${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else {
    res = `${seconds} second${seconds > 1 ? "s" : ""}`;
  }

  return res;
}

function SearchBar({ searchData, setSearchParams }) {
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    setInputValue(searchData)
  }, [searchData])

  const handleSearch = (e) => {
    e.preventDefault()
    if (inputValue.trim() === "") {
      setSearchParams({})
    } else {
      setSearchParams({ search: inputValue })
    }
  }

  return (
    <form onSubmit={handleSearch} className={styles['search-container']}>
      <input
        type="text"
        name="search"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        className={styles['search-bar']}
        placeholder="Search for posts, topics, etc...">
      </input>
      <button type="submit" className={styles['search-button']}>
        <Search className={styles['search-icon']} />
      </button>

    </form>
  )
}

function Post({ owner, title, body, created_at }) {
  return (
    <div className={styles['post']}>
      <div className={styles['post-header']}>
        <div className={styles['post-metadata']}>
          <div className={styles['avatar']}>{owner[0].toUpperCase()}</div>
          <div className={styles['post-descriptor']}>
            <p className={styles['post-author']}>{owner}</p>
            <p className={styles['post-time']}>{calculateData(created_at)} ago</p>
          </div>
        </div>
      </div>
      <div className={styles['post-content']}>
        <p className={styles['post-title']}>{title}</p>
        <p>{body}</p>
      </div>
      <div className={styles['post-footer']}>
        <button className={styles['action-button']}>
          <ThumbsUp className={styles['action-button-icon']} />
          Like
        </button>
        <button className={styles['action-button']}>
          <MessageSquareMore className={styles['action-button-icon']} />
          Comment
        </button>
        <button className={styles['action-button']}>
          <Share className={styles['action-button-icon']} />
          Share
        </button>
      </div>
    </div>
  )
}

// Note that currently the feed for every user is the same, it's more like a forum than twitter
function Feed() {
  const [feedData, setFeedData] = useState([])
  const [searchParams, setSearchParams] = useSearchParams();

  const searchData = searchParams.get("search") || "";

  useEffect(() => {
    const getFeed = async () => {
      try {
        const url = searchData
          ? `${apiUrl}/posts?search=${encodeURIComponent(searchData)}`
          : `${apiUrl}/posts`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Fetching posts failed");
        }

        const data = await response.json();
        setFeedData(data);
      } catch (err) {
        console.log(err);
      }
    };

    getFeed();
  }, [searchData]);


  useEffect(() => {
    const getFeed = async () => {
      try {
        const response = await fetch(apiUrl + '/posts', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        })

        if (!response.ok) {
          throw new Error("Fetching posts failed")
        }

        const data = await response.json()
        console.log(data)
        setFeedData(data)
      } catch (err) {
        console.log(err)
      }
    }

    getFeed()
  }, [])

  return (
    <div className={styles.container}>
      <SearchBar searchData={searchData} setSearchParams={setSearchParams} />
      <div className={styles['feed-container']}>
        {feedData.map((post) => (
          <Post
            key={post.id}
            owner={post.owner}
            title={post.title}
            body={post.body}
            created_at={post.created_at}
          />
        ))}
      </div>
    </div>
  )
}

export default Feed