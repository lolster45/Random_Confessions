import {IoAddCircleOutline} from "react-icons/io5"
import NoteCard from "@todo/components/note/noteCard"

const Category = ({data, handleDelete, handleUpdate, setForm, setShow, updateRef}) => {
    return (
        <div className="selected-cat-home">
            <a href="/">{data.title} Forum</a>
                <div className="notes-container">
                    <article className="single-note" onClick={() => setShow({showElement: true, type: "POST"})}>
                        <div className="addNote-icon">
                            <IoAddCircleOutline/>
                            <span className="instruction">
                                Add new note
                            </span>
                        </div>
                    </article>
                    {data.notes.length &&
                        data.notes.map((note, i) => (
                            <NoteCard
                                key={note.postId}
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