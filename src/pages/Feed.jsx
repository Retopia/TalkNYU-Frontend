import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router"
import { Check, Plus, Search, ThumbsUp, Share, MessageSquareMore } from "lucide-react"
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

function Post({ id, owner, title, body, created_at, likes, comments, has_liked }) {
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(has_liked)
  const [likeCount, setLikeCount] = useState(likes)
  const [commentCount, setCommentCount] = useState(comments)
  const navigate = useNavigate()

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/view/post/${id}`)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  const handleLike = async () => {
    const url = `${apiUrl}/posts/${id}/like`
    const method = liked ? 'DELETE' : 'POST'
    setLiked(!liked)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error(`${liked ? 'Unliking' : 'Liking'} failed`);
      }

    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className={styles['post']}>
      <div onClick={() => navigate(`/view/post/${id}`)} className={styles['post-header']}>
        <div className={styles['post-metadata']}>
          <div className={styles['avatar']}>{owner[0].toUpperCase()}</div>
          <div className={styles['post-descriptor']}>
            <p className={styles['post-author']}>{owner}</p>
            <p className={styles['post-time']}>{calculateData(created_at)} ago</p>
          </div>
        </div>
      </div>
      <div onClick={() => navigate(`/view/post/${id}`)} className={styles['post-content']}>
        <p className={styles['post-title']}>{title}</p>
        <p className={styles['post-body']}>{body}</p>
      </div>
      <div className={styles['post-footer']}>
        <button onClick={handleLike} className={styles['action-button']}>
          <ThumbsUp fill={liked ? 'currentColor' : 'none'} className={liked ? styles['liked-button'] : styles['action-button-icon']} />
          {liked ? 'Liked' : 'Like'} {likeCount > 0 ? `(${likeCount})` : ''}
        </button>
        <button onClick={() => navigate(`/view/post/${id}`)} className={styles['action-button']}>
          <MessageSquareMore className={styles['action-button-icon']} />
          Comment {commentCount > 0 ? `(${commentCount})` : ''}
        </button>
        <button onClick={handleShare} className={styles['action-button']}>
          {copied ?
            <Check className={styles['action-button-icon']} />
            :
            <Share className={styles['action-button-icon']} />}
          {copied ? 'Link copied!' : 'Share'}
        </button>
      </div>
    </div>
  )
}

// Note that currently the feed for every user is the same, it's more like a forum than twitter
function Feed() {
  const [feedData, setFeedData] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const searchData = searchParams.get("search") || ""

  useEffect(() => {
    const getFeed = async () => {
      try {
        const url = searchData
          ? `${apiUrl}/posts?search=${encodeURIComponent(searchData)}`
          : `${apiUrl}/posts`

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (!response.ok) {
          throw new Error("Fetching posts failed");
        }

        const data = await response.json();
        setFeedData(data)
      } catch (err) {
        console.log(err)
      }
    }

    getFeed()
  }, [searchData])


  const postButtonAction = () => {
    navigate('/post')
  }

  return (
    <div className={styles.container}>
      <button onClick={postButtonAction} className={styles['plus-button']}>
        <Plus className={styles['plus-button-icon']} />
      </button>
      <SearchBar searchData={searchData} setSearchParams={setSearchParams} />
      <div className={styles['feed-container']}>
        {feedData.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            owner={post.owner}
            title={post.title}
            body={post.body}
            created_at={post.created_at}
            likes={post.likes}
            comments={post.comments}
            has_liked={post.has_liked}
          />
        ))}
      </div>
    </div>
  )
}

export default Feed