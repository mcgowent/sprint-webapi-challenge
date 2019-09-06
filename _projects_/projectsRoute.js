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
            console.log('Error inside of get users')
            res.status(500).json({ error: "The users info could not be retrieved." })
        })
});

// router.get('/:id', (req, res) => {
//     const { id } = req.params
//     projectsDB.get(id)
//         .then(users => {
//             console.log(users.name)
//             if (users.name) {
//                 return res.status(200).json(users)
//             }
//         })
//         .catch(err => {
//             res.status(404).json({ error: "The User with that ID doesn't exsist" })
//         })
// });

// router.get('/:id/posts', validatePost, validateUserId, (req, res) => {
//     const { id } = req.params
//     postDB.getById(id)
//         .then(post => {
//             console.log(post.user_id)
//             res.status(200).json(post)
//         })
//         .catch(err => {
//             res.status(404).json({ error: "The User with that ID doesn't exsist" })
//         })
// });

// router.delete('/:id', validateUserId, (req, res) => {
//     const { id } = req.params
//     db.remove(id)
//         .then(removed => {
//             if (removed) {
//                 res.status(204).end()
//             } else (
//                 res.status(404).json({ message: "The User with the specified ID does not exist." })
//             )
//         })
//         .catch(err => {
//             console.log(err)
//             res.status(500).json({ error: "The User could not be removed." })
//         })
// });

// router.put('/:id', validateUserId, validateUser, (req, res) => {
//     const { id } = req.params
//     const { name } = req.body

//     db.update(id, { name })
//         .then(updated => {
//             console.log('Line 101', updated)
//             db.getById(id)
//                 .then(nameReturned => {
//                     console.log('Line 104', nameReturned)
//                     if (nameReturned) {
//                         res.status(201).json(nameReturned)
//                     } else {
//                         res.status(404).json({ error: "The name with the specified ID does not exist." })
//                     }
//                 })
//                 .catch(err => {
//                     console.log(err)
//                     res.status(500).json({ error: "There was an error while saving the name to the database" })
//                 })
//         })
//         .catch(err => {
//             console.log(err)
//             res.status(500).json({ error: "There was an error while saving the name to the database." })
//         })
// });

// //custom middleware

// function validateUserId(req, res, next) {
//     db.getById(req.params.id)
//         .then(results => {
//             if (results) {
//                 req.user = results
//                 console.log(req.user)
//                 next()
//             } else {
//                 res.status(404).json({ message: "User ID is invalid" })
//             }
//         })
// };

// function validateUser(req, res, next) {
//     const user = req.body;
//     if (!user) {
//         res.status(400).json({ message: 'Missing user data' })
//     } else if (!user.name) {
//         res.status(400).json({ message: 'Missing required name field' })
//     } else {
//         next();
//     }
// };

// function validatePost(req, res, next) {
//     const post = req.body
//     post.user_id = req.params.id
//     if (!post.text) {
//         res.status(400).json({ message: "missing required text field" })

//     } else {
//         next()
//     }
// };

module.exports = router;
