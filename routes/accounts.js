var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display accounts page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM accounts ORDER BY id desc',function(err,rows)     {
        if(err) {
            req.flash('error', err);
            // render to views/accounts/index.ejs
            res.render('accounts',{data:''});   
        } else {
            // render to views/accounts/index.ejs
            res.render('accounts',{data:rows});
        }
    });
});

// display add user page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('accounts/add', {
        email: '',
        password: '',
    })
})

// add a new user
router.post('/add', function(req, res, next) {    

    let email = req.body.email;
    let password = req.body.password;
    let errors = false;

    if(email.length === 0 || password.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter email and password");
        // render to add.ejs with flash message
        res.render('accounts/add', {
            email: email,
            password: password,
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            email: email,
            password: password,
        }
        
        // insert query
        dbConn.query('INSERT INTO accounts SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('accounts/add', {
                    email: form_data.email,
                    password: form_data.password,
                })
            } else {                
                req.flash('success', 'Account successfully added');
                res.redirect('/accounts');
            }
        })
    }
})

// display edit user page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM accounts WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Account not found with id = ' + id)
            res.redirect('/accounts')
        }
        // if user found
        else {
            // render to edit.ejs
            res.render('accounts/edit', {
                title: 'Edit Account', 
                id: rows[0].id,
                email: rows[0].email,
                password: rows[0].password,
            })
        }
    })
})

// update user data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let email = req.body.email;
    let password = req.body.password;
    let errors = false;

    if(email.length === 0 || password.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter email and password");
        // render to add.ejs with flash message
        res.render('accounts/edit', {
            id: req.params.id,
            email: email,
            password: password,
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            email: email,
            password: password,
        }
        // update query
        dbConn.query('UPDATE accounts SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('accounts/edit', {
                    id: req.params.id,
                    email: form_data.email,
                    password: form_data.password,
                })
            } else {
                req.flash('success', 'Account successfully updated');
                res.redirect('/accounts');
            }
        })
    }
})
   
// delete user
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM accounts WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to accounts page
            res.redirect('/accounts')
        } else {
            // set flash message
            req.flash('success', 'Account successfully deleted! ID = ' + id)
            // redirect to accounts page
            res.redirect('/accounts')
        }
    })
})

module.exports = router;