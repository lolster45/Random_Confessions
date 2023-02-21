//Components...
import NoteCard from "@todo/components/note/noteCard"

//Next.js...
import Link from "next/link"

//FIrebase...
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "config/firebase-config"

//React-icons...
import {IoAddCircleOutline} from "react-icons/io5"

const Category = ({data, handleDelete, handleUpdate, setForm, setShow, updateRef}) => {
    const [user] = useAuthState(auth)

    return (
        <div className="selected-cat-home">
            <a href="/">{data.title} Forum</a>
                <div className="notes-container">
                    {user && <article className="single-note" onClick={() => setShow({showElement: true, type: "POST"})}>
                        <div className="addNote-icon">
                            <IoAddCircleOutline/>
                            <span className="instruction">
                                Add new note
                            </span>
                        </div>
                    </article>}
                    {!user && 
                        <Link href="/login" className="single-note">
                            <div className="addNote-icon">
                                <IoAddCircleOutline/>
                                <span className="instruction">
                                    Please Login to Add
                                </span>
                            </div>
                        </Link>
                    }
                    {data.notes.length &&
                        data.notes.map((note, i) => (
                            <NoteCard
                                key={note.postId}
                                userId={note.userId}
                                parentId={note.parentId}
                                postId={note.postId} 
                                title={note.title} 
                                content={note.content} 
                                time={note.time} 
                                setForm={setForm}
                                setShow={setShow}
                                handleDelete={handleDelete}
                                handleUpdate={handleUpdate}
                                updateRef={updateRef}
                            />
                        ))
                    }
                </div>
            {!data.notes.length && 
                <span className="no-notes">Much empty....</span>
            }
        </div>
    )
}

export default Category