import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { EllipsisVertical, ArrowLeft, Check, ThumbsUp, Share, MessageSquareMore } from "lucide-react"
import styles from "./ViewPost.module.css"

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
    res = `${seconds} second${seconds != 1 ? "s" : ""}`;
  }

  return res;
}

function Post({ id, owner, title, body, created_at, likes, comments, has_liked }) {
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(has_liked)
  const [likeCount, setLikeCount] = useState(likes)
  const navigate = useNavigate()
  const commentCount = comments.length

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
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
    <div className={styles['post-container']}>
      <button onClick={() => navigate('/feed')} className={styles['back-button']}>
        <ArrowLeft />
        <p>Back to Feed</p>
      </button>

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
          <button onClick={handleLike} className={styles['action-button']}>
            <ThumbsUp
              fill={liked ? 'currentColor' : 'none'}
              className={liked ? styles['liked-button'] : styles['action-button-icon']}
            />
            {liked ? 'Liked' : 'Like'} {likeCount > 0 ? `(${likeCount})` : ''}
          </button>
          <button className={styles['comment-count-display']}>
            <MessageSquareMore className={styles['action-button-icon']} />
            {commentCount === 0 ? 'No' : commentCount} Comment{commentCount != 1 ? 's' : ''}
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
    </div>
  )
}

function CommentForm({ commentFormData, setCommentFormData, onCommentSubmit }) {
  const maxCommentLength = 150

  const handleSubmit = (e) => {
    e.preventDefault()
    onCommentSubmit()
  }

  const handleKeyDown = (e) => {
    const lineCount = commentFormData.split('\n').length

    if (e.key === 'Enter' && lineCount >= 2) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const value = e.target.value
    const lineCount = value.split('\n').length

    if (lineCount <= 2) {
      setCommentFormData(value)
    }
  };

  const handlePaste = (e) => {
    const paste = (e.clipboardData || window.clipboardData).getData('text')
    const pasteLines = paste.split('\n')

    const currentLines = commentFormData.split('\n')
    const totalLines = currentLines.length + pasteLines.length - 1

    if (totalLines > 2) {
      e.preventDefault()
    }
  }


  return (
    <form onSubmit={handleSubmit} className={styles['comment-form-container']}>
      <p className={styles['comment-form-title']}>Join the conversation</p>
      <textarea
        rows="2"
        maxLength={maxCommentLength}
        value={commentFormData}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder="What are your thoughts?"
        required
      >
      </textarea>
      <div className={styles['comment-form-footer']}>
        <div className={styles['comment-form-action']}>
          <button type='submit' className={styles['comment-form-post']}>Post</button>
          <button type='button' onClick={() => setCommentFormData('')} className={styles['comment-form-clear']}>Clear</button>
        </div>
        <p className={styles['character-counter']}>{maxCommentLength - commentFormData.length} characters remaining</p>
      </div>
    </form>
  )
}

function Comment({ post_id, comment_id, author, created_at, body, setComments }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(body)
    setMenuOpen(false)
  }

  const handleDelete = async () => {
    setMenuOpen(false)

    try {
      const url = `${apiUrl}/posts/${post_id}/comment/${comment_id}`
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Deleting comment failed")
      }

      setComments(prev => prev.filter(comment => comment.comment_id !== comment_id));
    } catch (err) {
      console.log(err)
    }
  }

  const handleEdit = () => {
    setMenuOpen(false)
  }

  return (
    <div className={styles['comment-container']}>
      <div className={styles['comment-header']}>
        <div className={styles['comment-user-container']}>
          <div className={styles['comment-avatar']}>{author[0].toUpperCase()}</div>
          <p className={styles['comment-author']}>{author}</p>
        </div>
        <div className={styles['comment-time-menu-container']}>
          <p className={styles['comment-time']}>{calculateData(created_at)} ago</p>
          <EllipsisVertical onClick={() => setMenuOpen(prev => !prev)} className={styles['comment-menu']} />
          {menuOpen && (
            <div className={styles['comment-menu-popup']}>
              <button onClick={handleCopy}>Copy</button>
              <button onClick={handleEdit}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      </div>
      <p className={styles['comment-body']}>{body}</p>
    </div>
  )
}

function CommentList({ comments, setComments }) {
  return (
    <>
      {comments.length > 0 && <div className={styles['comment-list-container']}>
        {comments.map((comment, index) => {
          return (
            <Comment
              key={index}
              post_id={comment.post_id}
              comment_id={comment.comment_id}
              author={comment.author}
              created_at={comment.created_at}
              body={comment.body}
              setComments={setComments}
            />
          )
        })}
      </div>
      }
    </>
  )
}

function ViewPost() {
  const { id } = useParams()
  const [postData, setPostData] = useState({})
  const [commentFormData, setCommentFormData] = useState('')
  const [comments, setComments] = useState([])

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const url = `${apiUrl}/posts/${id}`
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (!response.ok) {
          throw new Error("Fetching individual post failed")
        }

        const data = await response.json()
        console.log(data)
        setPostData(data)
        setComments(data.comments)
      } catch (err) {
        console.log(err)
      }
    }

    fetchPost()
  }, [])

  const onCommentSubmit = async () => {
    try {
      const url = `${apiUrl}/posts/${id}/comment`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: {
            content: commentFormData
          }
        })
      });

      if (!response.ok) {
        throw new Error("Commenting failed");
      }

      setCommentFormData('');

      const data = await response.json()
      console.log(data)
      const { comment } = data

      setComments(prev => [...prev, comment]);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={postData && postData.owner ? styles['container'] : styles['centered-container']}>
      {postData && postData.owner ? (
        <>
          <Post
            owner={postData.owner}
            title={postData.title}
            body={postData.body}
            created_at={postData.created_at}
            likes={postData.likes}
            comments={comments}
            has_liked={postData.has_liked}
          />

          <CommentForm
            commentFormData={commentFormData}
            setCommentFormData={setCommentFormData}
            onCommentSubmit={onCommentSubmit}
          />

          <CommentList comments={comments} setComments={setComments} />
        </>
      ) : (
        <p className={styles['loading-text']}>Loading post...</p>
      )}
    </div>
  )
}

export default ViewPost