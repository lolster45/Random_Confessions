//NextJs...
import {createRef, useState } from "react" 
import Category from "@todo/components/categories/category"
//NextJS router...
import { useRouter } from "next/router"
//Firebase...
import { database } from "config/firebase-config";
import { doc, collection, getDocs, where, query, updateDoc } from "firebase/firestore";

const SelectedCatHome = ({data}) => {
    const router = useRouter()
    const updateRef = createRef()

    //States...
        //Holds single category data for category user clicked on...
        const [stateData, setStateData] = useState(data[0])
        //Shows the backdrop and form for user-input...
        const [show, setShow] = useState({
            showElement: false,
            type: ""
        })
        const [form, setForm] = useState({
            id: router.query?.category,
            title: "",
            content: ""
        })

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (form.title === "" || form.content === "") {
            alert("You must fill it in!")
            return;
        }

        if (show.type === "POST") {
            handleCreate()
            console.log(show)
        }

        if(show.type === "PUT") {
            console.log("updating...")
            handleUpdate(e)
        } 
    }

    //CRUID...
    const handleCreate = async () => {
        const date = new Date().toDateString()
        const noteId = Math.floor(Math.random() * 1300000);

        try {
            await fetch("/api/form-input", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    parentId: form.id,
                    postId: noteId,
                    title: form.title,
                    content: form.content,
                    time: date
                })
            })
            //Updates the UI...
            setStateData((prev) => ({
                ...prev,
                notes: [
                    {
                        parentId: router?.query.category,
                        postId: noteId,
                        title: form.title,
                        content: form.content,
                        time: date
                    },
                    ...prev.notes
                ]
            }))//NEED TO FIX WHEN SINCE WHEN ADDING TO CAT WITH LENGTH=0, CREATES ERROR SINCE ...PREV.NOTES IS NOT ITERABLE...

            //Resets the form for convenience...
            setForm(prev => ({
                ...prev,
                title: "",
                content: ""  
            }))
            } catch (error) { console.log("error") 
            }
    }
    const handleDelete = async (e) => {
        const parentId = e.currentTarget.dataset.parentid;
        const postId = parseInt(e.currentTarget.dataset.postid)

        try {
            await fetch("/api/form-input", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    parentId: parentId,
                    postId: postId
                })
            })

            //FRONT END UI...
            const newNotes = stateData.notes.filter(item => item.postId !== postId)
            setStateData((prev) => ({
                ...prev,
                notes: [
                    ...newNotes
                ]
            }))

        } catch (error) {
            console.log(`Welp... looks like an error has occured...`)
        }
    }
    const handleUpdate = async () => {
        const parentId = show?.parentId;
        const postId = show?.postId
        const docRef = doc(database, "categories", parentId);


        try {
            const res = await fetch("/api/form-input", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    parentId: parentId,
                    postId: postId,
                    titleUpdate: form.title,
                    contentUpdate: form.content
                })
            })

            const data = await res.json(); //RETURNS ARRAY...

            //console.log(data.doc);

            // const newData = stateData.notes.map(note => {
            //     if(note.postId === postId) {
            //         return {
            //             ...note,
            //             title: form.title,
            //             content: form.content
            //         }
            //     }
            //     return note;
            // })

            console.log(data)

            await updateDoc(docRef, {
                notes: data
            })
            
            setStateData((prev) => ({
                ...prev,
                notes: data
            }))

        } catch (error) {
            console.log(error)
        }

    }
    const handleChange = (event) => {
        setForm(prev => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    };

    return (
        <>
            <Category 
                data={stateData} 
                setForm={setForm}
                setShow={setShow}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
                updateRef={updateRef}
            />
            <div className={show.showElement ? "input-container-backdrop active" : "input-container-backdrop"}></div>
            <form 
                className={show.showElement ? "user-note-input active" : "user-note-input"} 
                onSubmit={handleSubmit}
            >
                <input 
                    type={"text"} 
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title..."
                    maxLength={32}
                    className="title-input"
                />
                <textarea 
                    type={"text"} 
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="Please write something..."
                    maxLength={215}
                    className="content-input"
                />
                <div className="user-input-btns">
                    <button 
                        className="submit-user-input"
                        onClick={() => setShow(prev => ({
                            ...prev,
                            showElement: false,
                        }))}
                    >
                        Submit
                    </button>
                    <button 
                        type="button" className="submit-user-input dlt" 
                        onClick={() =>{ 
                            setShow({ showElement: false, type: ""})
                            setForm(prev => ({...prev, title: "", content: ""}))
                        }}

                    >
                        Cancel
                    </button>

                </div>
            </form>
        </>
    )
}

export default SelectedCatHome


//I am using the data.json file since I dont want to have alot of firebase fetch requests...
export async function getStaticPaths () {
    const {categories} = await import("/data/data.json")
    const allPaths = categories.map(ev => {
        return {
            params: {
                category: ev.id.toString()
            }
        }
    })
    return {
        paths: allPaths,
        fallback: false
    }
}


export async function getStaticProps (context) {
    //Firebase...
    const categoryId = context?.params.category
    const collectionRef = collection(database, "categories");
    const q = query(collectionRef, where("id", "==", categoryId))
    const res = await getDocs(q)
    const data = res.docs.map(doc => doc.data());
    
    return {
        props: {
            data: data
        }
    } 
}

