const express = require('express');
const projectsDB = require('../data/helpers/projectModel')
const actionsDB = require('../data/helpers/actionModel')

const router = express.Router();

// Posting for a new action requires a project_id that needs to be checked against exsisting project ids
//, description, notes, and a completed boolean not required
router.post('/', (req, res) => {
    const action = req.body
    console.log('Line 11 in actionsRoute:', action.project_id)

    if (!action.notes || !action.description) {
        return res.status(400).json({ errorMessage: 'A name and description is required.' })
    }

    projectsDB.get(action.project_id)
        .then(userID => {
            console.log('Line 19 in actionsRoute:', userID)
            actionsDB.insert(action)
                .then(({ id }) => {
                    actionsDB.get(id)
                        .then(actions => {
                            res.status(201).json(actions)
                        })
                        .catch(err => {
                            console.log('Line 27 in actionsRoute', err)
                            res.status(500).json({ error: 'There was an error while saving the action to the database' })
                        })
                })
                .catch(err => {
                    console.log('Line 32 in actionsRoute', err)
                    res.status(500).json({ error: "There was an error while saving the action" })
                })
        })
        .catch(err => {
            res.status(404).json({ error: "The project_id must match a current project id" })
        })




});

//Grab all the actions
router.get('/', (req, res) => {
    actionsDB.get()
        .then(users => res.status(200).json(users))
        .catch(err => {
            console.log('Error inside of get Actions')
            res.status(500).json({ error: "The Actions info could not be retrieved." })
        })
});

router.get('/:id', (req, res) => {
    const { id } = req.params
    console.log(id)
    actionsDB.get(id)
        .then(actions => {
            console.log(actions)
            if (actions) {
                return res.status(200).json(actions)
            } else {
                res.status(404).json({ error: "The Action with that ID doesn't exsist" })
            }
        })
        .catch(err => {
            res.status(404).json({ error: "The Action with that ID doesn't exsist" })
        })
});

router.delete('/:id', (req, res) => {
    const { id } = req.params
    actionsDB.remove(id)
        .then(removed => {
            if (removed) {
                res.status(204).end()
            } else (
                res.status(404).json({ message: "The Action with the specified ID does not exist." })
            )
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The Action could not be removed." })
        })
});

router.put('/:id', (req, res) => {
    const { id } = req.params
    const action = req.body

    actionsDB.update(id, action)
        .then(updated => {
            console.log('Line 101', updated)
            actionsDB.get(id)
                .then(changes => {
                    console.log('Line 104', changes)
                    if (changes) {
                        res.status(201).json(changes)
                    } else {
                        res.status(404).json({ error: "The Action with the specified ID does not exist." })
                    }
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({ error: "There was an error while saving the Action to the database" })
                })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "There was an error while saving the Action to the database." })
        })
});


module.exports = router;
