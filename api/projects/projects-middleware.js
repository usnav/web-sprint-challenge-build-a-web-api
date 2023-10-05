// add middlewares here related to projects

const Project = require('./projects-model')

function logger (req, res, next) {
    const timeStamp = new Date().toLocaleString();
    const method = req.method;
    const url = req.originalUrl
    console.log(`[${timeStamp}] ${method} to ${url}`)
    next()
}

async function validateProjectId (req, res, next) {
    try {
        const project = await Project.get(req.params.id)
            if (!project) {
                res.status(404).json({
                    message: "project not found"
                })
            } else {
                req.project = project; 
                next()
            }
    } catch (err) {
        res.status(500).json({
            message: "problem finding project"
        })
    }
}

function validateProject (req, res, next) {
    const { name, description, completed } = req.body
        if (!name || !description ) {
            res.status(400).json({
                message: "missing required text field"
            })
        } else {
            req.name = name.trim()
            req.description = description.trim()
            req.completed = completed
            next()
        }
}

function validateProjectCompleted (req, res, next) {
    const { name, description, completed } = req.body
        if (!name || !description || completed === undefined) {
            res.status(400).json({
                message: "missing required text field"
            })
        } else {
            req.name = name.trim()
            req.description = description.trim()
            req.completed = completed
            next()
        }
}

module.exports = {
    validateProjectId, 
    validateProject, 
    validateProjectCompleted
}