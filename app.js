require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var _ = require('lodash');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));



/*** Mongoose Setup ***/
const mongodb_pass = process.env.MONGODB_PASS;

mongoose.connect(`mongodb+srv://admin-lance:${mongodb_pass}@cluster0.iyljx.mongodb.net/to-do-list?retryWrites=true&w=majority`, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

 // Home
const itemsSchema = { name: String };
const Item = mongoose.model('Item', itemsSchema);

// Custom List
const listSchema = {
    name: String,
    items: [itemsSchema]
}
const List = mongoose.model("List", listSchema);



/*** Home Page ***/
app.get('/', (req, res) => {
    Item.find((err, items) => {
        if (!err) {
            res.render('list', {
                listTitle: 'Home',
                newListItems: items
            });
        } else {
            console.log(err);
        }
    });
});

app.post('/', (req, res) => {
    const userInput = req.body.newTask;
    const listName = req.body.list;
    const newItem = new Item({ name: userInput });

    if (listName === 'Home') {
        newItem.save();
        res.redirect('/');
    } else {
        List.findOne({ name: listName }, (err, customList) => {
            console.log(listName);
            customList.items.push(newItem);
            customList.save();
            res.redirect('/' + listName);
        });
    }
});



/*** Custom Page ***/
app.get('/:customListName', (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName }, (err, customList) => {
        if (!err) {
            if (!customList) {
                const list = new List({ name: customListName });
                list.save(() => res.redirect('/' + customListName));
            } else {
                res.render('list', {
                    listTitle: customList.name,
                    newListItems: customList.items
                });
            }
        }
    });
});



/*** Delete Functionality ***/
app.post('/delete', (req, res) => {
    const deletedItemId = req.body.checkboxItem;
    const listName = req.body.listName;

    if (listName === 'Home') {
        Item.findByIdAndDelete(deletedItemId, (err) =>{
            if (!err) {
                res.redirect('/');
            } else {
                console.log(err);
            }
        });
    } else {
        List.findOneAndUpdate({ name: listName }, {$pull: { items: { _id: deletedItemId }}}, (err, foundList) => {
            if (!err) {
                res.redirect('/' + listName);
            }
        });
    }
});


/*** Port Setup ***/
app.listen(port, () => {
    console.log(`Server has started successfully.`);
});