// Write your "projects" router here!
const express = require("express")

const router = express.Router()

const Project = require("./projects-model")

const {
    validateProjectId, 
    validateProject, 
    validateProjectCompleted
} = require('./projects-middleware')

router.get('/', (req, res, next) =>{
    Project.get()
    .then(projects => {
        res.json(projects)
    })
    .catch(next)
})

router.get('/:id', validateProjectId, (req, res, next) => {
    res.json(req.project)
})

router.post('/', validateProject, (req, res, next) => {
    Project.insert({name: req.name, description: req.description, completed: req.completed })
        .then(newProject => {
        res.status(201).json(newProject)
    })
    .catch(next)
})

router.put('/:id', validateProjectId, validateProjectCompleted, (req, res, next) =>{
        Project.update(req.params.id, {name: req.name, description: req.description, completed: req.completed})
        .then(() => {
            return Project.get(req.params.id)
        })
        .then(projectUpdated => {
            res.json(projectUpdated)
        })
        .catch(next)
})

router.delete('/:id', validateProjectId, (req, res, next) => {
    Project.remove(req.params.id)
    .then(projectDeleted => {
        res.json(projectDeleted)
    })
    .catch(next)
})

router.get('/:id/actions', validateProjectId, async (req, res, next) => {
    try {
      const result = await Project.getProjectActions(req.params.id)
      res.json(result)
    } catch (err) {
      next(err)
    }
  });


router.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: "error processing", 
        err: err.message, 
        stack: err.stack
    })
})

module.exports = router