// Write your "actions" router here!
const express = require('express')

const router = express.Router()

const Action = require('./actions-model')

const {
    validateActionId, 
    validateAction, 
    validateActionCompleted
} = require('./actions-middlware')


router.get('/', (req, res, next) =>{
    Action.get()
    .then(actions => {
        res.json(actions)
    })
    .catch(next)
})

router.get('/:id' , validateActionId, (req, res) => {
    res.json(req.action)
})


router.post('/', validateAction, (req, res, next) => {
    Action.insert({project_id: req.project_id, description: req.description, notes: req.notes})
    .then(newAction => {
        res.status(201).json(newAction)
    })
    .catch(next)
})

router.put('/:id', validateActionId, validateActionCompleted, (req, res, next) =>{
    Action.update(req.params.id, {
        project_id: req.project_id, 
        description: req.description, 
        notes: req.notes, 
        completed: req.completed
    })
    .then(() => {
        return Action.get(req.params.id)
    })
    .then(updatedAction => {
        res.json(updatedAction)
    })
    .catch(next)
})

router.delete('/:id', validateActionId, (req, res, next) => {
    Action.remove(req.params.id)
    .then(deleted => {
        res.json(deleted)
    })
    .catch(next)
})

router.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: "error processing", 
        err: err.message, 
        stack: err.stack
    })
})



module.exports = router
