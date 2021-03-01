const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();
const port = 3000;
const index = require(__dirname + '/index.js');

let items = [];
let workItems = [];

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use('/public', express.static(__dirname + '/public'))



/*** Home Page ***/
app.get('/', (req, res) => {
    let day = index.getDate();
    let currentTime = index.getTime();

    // Display content
    res.render('list', {
        listTitle: day,
        timeOfDay: currentTime,
        newListItems: items
    })
})

app.post('/', (req, res) => {
    // Tap into request, search and retrieve for the value in the body
    let newItem = req.body.newTask;

    if (req.body.list === 'Work') {
        workItems.push(newItem);
        res.redirect('/work')
    } else {
        items.push(newItem);
        res.redirect('/')
    }
})



/*** Work Page ***/
app.get('/work', (req, res) => {
    let currentTime = index.getTime();

    res.render('list', {
        listTitle: 'Work List',
        timeOfDay: currentTime,
        newListItems: workItems
    })
})



/*** About Page ***/
app.get('/about', (req, res) => {
    res.render('about');
})



/*** Port Setup ***/
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});