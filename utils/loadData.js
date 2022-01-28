import Folder from "../templates/Folder";
import File from "../templates/File";
import React from 'react'

export default async function loadData(db, id) {
    let folders = await db.table('folder').where({project: id}).toArray()
    let files = await db.table('file').where({project: id}).toArray()

    let parsedFolders = folders.map(f => {
            return new Folder(f.name, f.parentId, f.id, new Date(f.creationDate))
        }),
        parsedFiles = files.map(f => {
            return new File(f.name, f.mimetype + '/' + f.type, f.size, f.id, f.parentId, new Date(f.creationDate))
        })

    return [...parsedFolders, ...parsedFiles]
}
