var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display users page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM users ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            res.render('users',{data:''});   
        } else {
            // render to views/users/index.ejs
            res.render('users',{data:rows});
        }
    });
});

// display add book page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('users/add', {
        name: '',
        number: '',
        phone_number: ''
    })
})

// add a new book
router.post('/add', function(req, res, next) {    

    let name = req.body.name;
    let number = req.body.number;
    let phone_number = req.body.phone_number;
    let errors = false;

    if(name.length === 0 || number.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and number");
        // render to add.ejs with flash message
        res.render('users/add', {
            name: name,
            number: number,
            phone_number: phone_number
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            name: name,
            number: number,
            phone_number: phone_number
        }
        
        // insert query
        dbConn.query('INSERT INTO users SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('users/add', {
                    name: form_data.name,
                    number: form_data.number,
                    phone_number: phone_number
                })
            } else {                
                req.flash('success', 'Book successfully added');
                res.redirect('/users');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM users WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Book not found with id = ' + id)
            res.redirect('/users')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('users/edit', {
                title: 'Edit Book', 
                id: rows[0].id,
                name: rows[0].name,
                number: rows[0].number,
                phone_number: rows[0].phone_number
            })
        }
    })
})

// update book data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let name = req.body.name;
    let number = req.body.number;
    let phone_number = req.body.phone_number;
    let errors = false;

    if(name.length === 0 || number.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter name and number");
        // render to add.ejs with flash message
        res.render('users/edit', {
            id: req.params.id,
            name: name,
            number: number,
            phone_number: phone_number,
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            name: name,
            number: number,
            phone_number: phone_number,
        }
        // update query
        dbConn.query('UPDATE users SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('users/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    number: form_data.number,
                    phone_number: phone_number
                })
            } else {
                req.flash('success', 'Book successfully updated');
                res.redirect('/users');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM users WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to users page
            res.redirect('/users')
        } else {
            // set flash message
            req.flash('success', 'Book successfully deleted! ID = ' + id)
            // redirect to users page
            res.redirect('/users')
        }
    })
})

module.exports = router;