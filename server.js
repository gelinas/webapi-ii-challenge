// imports
const express = require('express');
const postsRouter = require('./postsRouter.js')
const server = express();

// middleware
server.use(express.json());

server.get('/', (req, res) => {
    res.send("Blog API live!")
})

server.use('/api/posts', postsRouter);


// request and route handlers



// set server to listen
const port = 8000;

server.listen(port, () => {
  console.log(`*** Server Running on http://localhost:${port} ***`);
});
