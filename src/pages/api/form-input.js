import { database } from "config/firebase-config";
import { doc, getDoc, arrayUnion, arrayRemove, updateDoc } from "firebase/firestore";


export default async function handler (req, res) {
    const {method} = req  
   
    if (method === "POST") {
        const {parentId, postId, title, content, time} = req.body
        const docRef = doc(database, "categories", parentId);

        if(!docRef) {
            return res.status(404).json({
                message: "Category Data Not Found..."
            });
        }

        await updateDoc(docRef, {
            notes: arrayUnion({
                parentId: parentId,
                postId: postId,
                title: title,
                content: content,
                time: time
            })
        });

        res.status(200).json({
            message: `successfully posted form`
        })
    }
    else if(method === "DELETE") {
        const {parentId, postId} = req.body
        const docRef = doc(database, "categories", parentId);
        const docData = await getDoc(docRef);
        //Stops it from going any further if the the data we want is not there
        if(!docData.exists()) {
            return res.status(404).json({
                message: "Events Data Not Found..."
            });
        }
        const docsArray = docData.data().notes.map(note => note);
        const deleteTarget = docsArray.filter(note => note.postId === postId)

        
        await updateDoc(docRef, {
            notes: arrayRemove(deleteTarget[0])
        })

        res.status(200).json({
            message: "yayyyy!!! it works"
        })
    }
    else if( method === "PUT") {
        const {parentId, postId, titleUpdate, contentUpdate} = req.body;
        //Firebase...
        const docRef = doc(database, "categories", parentId);
        const docData = await getDoc(docRef);
        //Stops it from going any further if the the data we want is not there
        if(!docData.exists()) {
            return res.status(404).json({
                message: "Events Data Not Found..."
            });
        }
        const docsArray = docData.data().notes.map(note => note)

        //Creates new array holding updated note/object...
        const newArray = docsArray.map(note => {
            if(note.postId === postId){
               return {
                   ...note,
                   title: titleUpdate,
                   content: contentUpdate
               }
            }
            return note;
        })

        //Updates firebase database...
        await updateDoc(docRef, {
            notes: newArray
        })

        res.status(200).json({
           data: "congrats, you have updated your note"
        })
    }
    else {
        res.status(405).json({
            message: "Method is not supported by server"
        })
    }
}