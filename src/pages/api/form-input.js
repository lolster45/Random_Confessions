import path  from "path"
import fs from "fs"

function buildPath () {
    return path.join(process.cwd(), "data", "data.json")
}

function extractData (filePath) {
    const jsonData = fs.readFileSync(filePath)
    const data = JSON.parse(jsonData)
    return data
}

export default function handler (req, res) {
    const {method} = req  
    const filePath = buildPath();
    const {categories} = extractData(filePath)

    if(!categories) {
        return res.status(404).json({
            message: "Events Data Not Found..."
        });
    }

    if (method === "POST") {
        const {parentId, postId, title, content, time} = req.body
        const categoriesNew = categories.map(post => {
            if (post.id === parentId) {
                return {
                    ...post, 
                    notes:[
                        ...post.notes, {
                        parentId: parentId,
                        postId: postId,
                        title: title,
                        content: content,
                        time: time
                    }]
                }
            }
            return post;
        });

        fs.writeFileSync(filePath, 
            JSON.stringify({ 
                categories: categoriesNew
            })
        )

        res.status(200).json({
            message: `successfully posted form`
        })
    }

    if(method === "DELETE") {
        const {parentId, postId} = req.body
        const postCategorySearch = categories.filter(item => item.id === parentId)
        const postSearchDelete = postCategorySearch[0].notes.filter(item => item.postId !== postId)
        const newData = categories.map(category => {
            if(category.id === parentId) {
                return {
                    ...category,
                    notes: [
                        ...postSearchDelete
                    ]
                }
            }
            return category;
        })

        fs.writeFileSync(filePath, JSON.stringify({
            categories: newData
        }))

        res.status(200).json({
            message: newData
        })

    }

    if(method === "PUT") {
        const {parentId, postId, titleUpdate, contentUpdate} = req.body

        const postCategorySearch = categories.filter(item => item.id === parentId)

        //Creates a whoel new array which may cause performance issues if the array you are going to replace with is huge or doing it frequently...(though in this case its alrgith since its a small database)
        const createUpdateArray = postCategorySearch[0].notes.map((item) => {
            if(item.postId === postId) {
                return {...item, title: titleUpdate, content: contentUpdate}
            }
            return item
        })

        const newData = categories.map(category => {
            if (category.id === parentId) {
                return {
                    ...category,
                    notes: createUpdateArray
                }
            }
            return category;
        })

        fs.writeFileSync(filePath, JSON.stringify({
            categories: newData
        }))

        res.status(200).json({
            data: newData
        })
    }
}