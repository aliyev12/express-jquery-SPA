const db = require('../models');

// const entityMap = {
//     '&': '&amp;',
//     '<': '&lt;',
//     '>': '&gt;',
//     '"': '&quot;',
//     "'": '&#39;',
//     '/': '&#x2F;',
//     '`': '&#x60;',
//     '=': '&#x3D;'
//   };

const entityMap = {
    '&': '',
    '<': '',
    '>': '',
    '"': '',
    "'": '',
    '/': '',
    '`': '',
    '=': '',
    '{': '',
    '}': ''
};

const escapeHtml = string => {
    return String(string).replace(/[&<>"'`=\/{}]/g, s => entityMap[s]);
}

/*=== GET INDEX ROUTE - list all todos '/api/todos' ===*/
exports.getTodos = (req, res) => {
    // Find all todos using mongoose and Todo model stored in db variable
    db.Todo.find()
        .then(todos => res.json(todos)) // send all todos in json format to the requestor
        .catch(err => res.send(err));
}

/*=== POST CREATE ROUTE - create new todo '/api/todos' ===*/
exports.createTodo = (req, res) => {
    req.body.name = req.sanitize(req.body.name);
    req.body.name = escapeHtml(req.body.name);
    if (req.body.name.length > 0 && typeof req.body.name === 'string') {
        if (req.body.completed || req.body.created_date || req.body._id) {
            return res.status(500).json({
                message: 'Something went wrong.'
            });
        }
        db.Todo.create(req.body)
            .then(newTodo => {
                res.status(201).json(newTodo);
            })
            .catch(err => {
                res.status(500).json({
                    message: 'Something went wrong.'
                });
            });
    } else {
        res.status(500).json({
            message: 'Something went wrong.'
        });
    }
}
// <script>alert('boo')</script>
/*=== GET SHOW ROUTE - retrieve a single todo '/api/todos/:todo_id' ===*/
exports.getTodo = (req, res) => {
    db.Todo.findById(req.params.todo_id)
        .then(foundTodo => res.json(foundTodo))
        .catch(err => {
            res.send(err);
        });
}

/*=== PUT UPDATE ONE TODO ROUTE - update a single todo '/api/todos/:todo_id' ===*/
exports.updateTodo = (req, res) => {
    req.body.name = req.sanitize(req.body.name);
    req.body.name = escapeHtml(req.body.name);
    if (req.body.name.length > 0 && typeof req.body.name === 'string') {
        if (req.body.created_date || req.body._id) {
            return res.status(500).json({
                message: 'Something went wrong.'
            });
        }

        db.Todo.findOneAndUpdate({
                _id: req.params.todo_id
            }, req.body, {
                new: true
            })
            .then(todo => res.json(todo))
            .catch(err => res.status(500).json({
                message: 'Something went wrong.'
            }));

    } else {
        res.status(500).json({
            message: 'Something went wrong.'
        });
    }
}

/*=== DELETE DESTROY ROUTE - delete a single todo '/api/todos/:todo_id' ===*/
exports.deleteTodo = (req, res) => {
    db.Todo.remove({
            _id: req.params.todo_id
        })
        .then(() => res.json({
            message: 'Todo has been deleted'
        }))
        .catch(err => res.send(err));
}

module.exports = exports;