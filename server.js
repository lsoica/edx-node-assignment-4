const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const errorhandler = require('errorhandler')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/edx-course-db')

const Account = mongoose.model('Account', 
  { 
    name: String,
    balance: Number
  }
)

let app = express()

app.use(morgan('dev'))
app.use(errorhandler())
app.use(bodyParser.json())

app.get('/accounts', (req, res) => {
    Account.find({}, function(err, accounts) {
        res.send(accounts.toJSON);  
    });
})

app.post('/accounts', (req, res) => {
    var account = new Account(req.body)
      
    account.save(function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log('The account is saved: ', account.toJSON())
        }
        res.status(201).send(account.toJSON())
    })
})

app.put('/accounts/:id', (req, res) => {
    var account = new Account(req.body)
    account._id = req.params.id
    Account.findOne({ _id: req.params.id }, (err, doc) => {
        if (err) {
          console.log(err)
        } else {
            doc.name = req.body.name
            doc.balance = req.body.balance
            doc.save()
            console.log('The account is saved: ', account.toJSON())
        }
        res.status(200).send(account.toJSON())
    })
})

app.delete('/accounts/:id', (req, res) => {
    Account.find({ _id:req.params.id }).remove( function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log('The account with ${req.params.id} was removed')
        }
        res.status(204).send()
    })
})

app.listen(3000)