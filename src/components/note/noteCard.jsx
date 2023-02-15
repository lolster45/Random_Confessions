import { useState } from "react"
import Link from "next/link"
import {BsThreeDotsVertical} from "react-icons/bs"


const NoteCard = ({parentId, postId, title, content, time, handleDelete, handleUpdate, setForm, setShow, updateRef}) => {

    const [showVertical, setShowVertical] = useState(false)

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
                {!showVertical && 
                <BsThreeDotsVertical 
                    onClick={() => setShowVertical(true)}
                />}
                {showVertical && 
                <BsThreeDotsVertical 
                    onClick={() => setShowVertical(false)}
                />}
            </div>
        </article>
    )
}

export default NoteCard