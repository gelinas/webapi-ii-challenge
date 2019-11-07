// imports
const router = require('express').Router();

const Posts = require('./data/db.js');

// routes

// | GET    | /api/posts              
// | Returns an array of all the post objects contained in the database.

router.get('/', (req, res) => {
    Posts.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            console.log('Posts.find in get to / error', err)
            res.status(500).json( { error: 'The posts information could not be retrieved' })
        })
})

// | POST   | /api/posts              
// | Creates a post using the information sent inside the `request body`.
// A Blog Post in the database has the following structure:
// {
//   title: "The post title", // String, required
//   contents: "The post contents", // String, required
//   created_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
//   updated_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
// }

router.post('/', (req, res) => {
    const postInformation = req.body;

    if(!postInformation.title || !postInformation.contents) {
        res.status(400).json({ error: 'Please provide title and contents for the post.'})
    }

    Posts.insert(postInformation)
        .then(newPostId => {
            res.status(201).json(newPostId);
        })
        .catch(err => {
            console.log('Posts.insert in post to / error', err);
            res.status(500).json({ error: 'There was an error while saving the post to the database.'})
        })

})

// | GET    | /api/posts/:id          
// | Returns the post object with the specified id.

router.get('/:id', (req, res) => {
    const { id } = req.params;

    Posts.findById(id)
        .then(post => {
            // if (!post) {
            if (post.length === 0) {
                res.status(404).json({ error: 'The post with the specified ID does not exist'})
            } else {    
                res.status(200).json(post);
            }
        })
        .catch(err => {
            console.log('Posts.findById in get to /:id error', err);
            res.status(500).json({ error: 'The post information could not be retrieved.'})
        })
    
})

// | DELETE | /api/posts/:id          
// | Removes the post with the specified id and returns the **deleted post object**. You may need to make additional calls to the database in order to satisfy this requirement.

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    Posts.findById(id)
        .then(post => {
            // if (!post) {
            if (post.length === 0) {
                res.status(404).json({ error: 'The post with the specified ID does not exist'})
            }
        })
        .catch(err => {
            console.log('Posts.findById in delete to /:id error', err);
            res.status(500).json({ error: 'The post information could not be retrieved.'})
        })

    Posts.remove(id)
        .then(post => {
            res.status(200).json({ message: `The post with ID ${id} has been deleted.`})
        })
        .catch(err => {
            console.log('Posts.remove in delete to /:id error', err);
            res.status(500).json({ error: 'The post could not be removed.'})
        })
    
})

// | PUT    | /api/posts/:id          
// | Updates the post with the specified `id` using data from the `request body`. Returns the modified document, **NOT the original**.                                           |

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const postInformation = req.body;

    Posts.findById(id)
        .then(post => {
            // if (!post) {
            if (post.length === 0) {
                res.status(404).json({ error: 'The post with the specified ID does not exist'})
            }
        })
        .catch(err => {
            console.log('Posts.findById in put to /:id error', err);
            res.status(500).json({ error: 'The post information could not be retrieved.'})
        })

    if(!postInformation.title || !postInformation.contents) {
        res.status(400).json({ error: 'Please provide title and contents for the post.'})
    }

    Posts.update(id, postInformation)
        .then(newPostCount => {
            res.status(200).json(newPostCount);
        })
        .catch(err => {
            console.log('Posts.insert in put to / error', err);
            res.status(500).json({ error: 'There was an error while updating the post in the database.'})
        })

})

// | GET    | /api/posts/:id/comments 
// | Returns an array of all the comment objects associated with the post with the specified id.

router.get('/:id/comments', (req, res) => {
    const { id } = req.params;

    Posts.findById(id)
        .then(post => {
            // if (!post) {
            if (post.length === 0) {
                res.status(404).json({ error: 'The post with the specified ID does not exist'})
            }
        })
        .catch(err => {
            console.log('Posts.findById in get to /:id/comments error', err);
            res.status(500).json({ error: 'The post information could not be retrieved.'})
        })

    Posts.findPostComments(id)
        .then(comments => { 
            res.status(200).json(comments);
        })
        .catch(err => {
            console.log('Posts.findPostComments in get to /:id/comments error', err);
            res.status(500).json({ error: 'The comments information could not be retrieved.'})
        })


    
})

// | POST   | /api/posts/:id/comments 
// | Creates a comment for the post with the specified id using information sent inside of the `request body`.
// A Comment in the database has the following structure:
// {
//   text: "The text of the comment", // String, required
//   post_id: "The id of the associated post", // Integer, required, must match the id of a post entry in the database
//   created_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
//   updated_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
// }


router.post('/:id/comments', (req, res) => {
    const commentInformation = req.body;
    const { id } = req.params;

    Posts.findById(id)
        .then(post => {
            // console.log(post);
            if (post.length === 0) {
                res.status(404).json({ error: 'The post with the specified ID does not exist'});
            }
        })
        .catch(err => {
            console.log('Posts.findById in post to /:id/comments error', err)
            res.status(500).json({ error: 'The post information could not be retrieved.'})
        })

    if(!commentInformation.text) {
        res.status(400).json({ error: 'Please provide text for the comment.'})
    }
    
    Posts.insertComment(commentInformation)
        .then(comment => {
            res.status(201).json(comment)
        })
        .catch(err => {
            console.log('Posts.update in post to /:id/comments error', err)
            res.status(500).json({ error: 'There was an error while saving the comment to the database.'})
        })
})


// exports

module.exports = router;