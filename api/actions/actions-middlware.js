// add middlewares here related to actions

const Action = require('./actions-model')

function logger (req, res, next) {
    const timeStamp = new Date().toLocaleString();
    const method = req.method;
    const url = req.originalUrl
    console.log(`[${timeStamp}] ${method} to ${url}`)
    next()
}

async function validateActionId (req, res, next) {
    try {
        const action = await Action.get(req.params.id)
            if (!action) {
                res.status(404).json({
                    message: "action not found"
                })
            } else {
                req.action = action; 
                next()
            }
    } catch (err) {
        res.status(500).json({
            message: "problem finding action"
        })
    }
}


function validateAction (req, res, next) {
    const { project_id, description, notes } = req.body
        if (!project_id || !description || !notes) {
            res.status(400).json({
                message: "missing required text field"
            })
        } else {
            req.project_id = project_id
            req.description = description.trim()
            req.notes = notes.trim()
            next()
        }
}

function validateActionCompleted (req, res, next) {
    const { project_id, description, notes, completed } = req.body
        if (!project_id || !description || !notes || completed === undefined) {
            res.status(400).json({
                message: "missing required text field"
            })
        } else {
            req.project_id = project_id
            req.description = description.trim()
            req.notes = notes.trim()
            req.completed = completed
            next()
        }
}


module.exports = {
    validateActionId, 
    validateAction, 
    validateActionCompleted
}