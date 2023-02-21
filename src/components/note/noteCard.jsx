//Components...
import { useState } from "react"

//Firebase...
import { auth } from "config/firebase-config"
import { useAuthState } from "react-firebase-hooks/auth"

//React-icons...
import {BsThreeDotsVertical} from "react-icons/bs"


const NoteCard = ({parentId, postId, title, content, time, handleDelete, setForm, setShow, updateRef, userId}) => {
    const [user] = useAuthState(auth)
    const [showVertical, setShowVertical] = useState(false);

    return (
        <article className="single-note">
            <div className="note-content">
                <h2>{title}</h2>
                <p>{content}</p>
            </div>
            <div className="note-info">
                <span>{time}</span>
                {showVertical &&
                    <div className="vertical-menu">
                        <button 
                            onClick={handleDelete} 
                            data-postid={postId} 
                            data-parentid={parentId}
                        >
                            X
                        </button>
                        <button 
                            onClick={() => {
                                setForm(prev => ({...prev, title: title, content: content}))
                                setShow({showElement: true, type: "PUT", parentId: parentId, postId: postId})
                            }}
                            ref={updateRef}
                            data-postid={postId} 
                            data-parentid={parentId}
                        >
                            UPDATE
                        </button>
                    </div>
                }
                {!showVertical && user.uid === userId && 
                <BsThreeDotsVertical 
                    onClick={() => setShowVertical(true)}
                />}
                {showVertical && user.uid === userId && 
                <BsThreeDotsVertical 
                    onClick={() => setShowVertical(false)}
                />}
            </div>
        </article>
    )
}

export default NoteCard