const express = require('express');
const projectsDB = require('../data/helpers/projectModel')
const actionsDB = require('../data/helpers/actionModel')

const router = express.Router();

// Posting for a new project requires a name, description, and a bool value called completed
router.post('/', (req, res) => {
    const project = req.body
    console.log(project)
    if (!project.name || !project.description) {
        return res.status(400).json({ errorMessage: 'A name and description is required.' })
    }

    projectsDB.insert(project)
        .then(({ id }) => {
            projectsDB.get(id)
                .then(projects => {
                    res.status(201).json(projects)
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({ error: 'There was an error while saving the project to the database' })
                })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "There was an error while saving the project" })
        })
});

//Grab all the projects
router.get('/', (req, res) => {
    projectsDB.get()
        .then(users => res.status(200).json(users))
        .catch(err => {
            console.log('Error inside of get Projects')
            res.status(500).json({ error: "The Project info could not be retrieved." })
        })
});

router.get('/:id', (req, res) => {
    const { id } = req.params
    console.log(id)
    projectsDB.get(id)
        .then(users => {
            console.log(users.name)
            if (users.name) {
                return res.status(200).json(users)
            }
        })
        .catch(err => {
            res.status(404).json({ error: "The Project with that ID doesn't exsist" })
        })
});

router.get('/:id/actions', (req, res) => {
    const { id } = req.params
    projectsDB.getProjectActions(id)
        .then(actions => {
            console.log(actions)
            res.status(200).json(actions)
        })
        .catch(err => {
            res.status(404).json({ error: "The User with that ID doesn't exsist" })
        })
});

router.delete('/:id', (req, res) => {
    const { id } = req.params
    projectsDB.remove(id)
        .then(removed => {
            if (removed) {
                res.status(204).end()
            } else (
                res.status(404).json({ message: "The Project with the specified ID does not exist." })
            )
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The Project could not be removed." })
        })
});

router.put('/:id', (req, res) => {
    const { id } = req.params
    const project = req.body

    projectsDB.update(id, project)
        .then(updated => {
            console.log('Line 101', updated)
            projectsDB.get(id)
                .then(changes => {
                    console.log('Line 104', changes)
                    if (changes) {
                        res.status(201).json(changes)
                    } else {
                        res.status(404).json({ error: "The project with the specified ID does not exist." })
                    }
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({ error: "There was an error while saving the project to the database" })
                })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "There was an error while saving the name to the database." })
        })
});


module.exports = router;
