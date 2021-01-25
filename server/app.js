const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors');

const app = express()
const port = process.env.PORT || 5000

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// MySQL
const pool = mysql.createPool({
  connectLimit : 10,
  host         : 'localhost',
  user         :'crypto',
  password     : 'test123',
  database     : 'crypto_users'
})

app.get('/getUserData/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if(err) throw err;
    console.log(`connected as id ${connection.threadId}`)

    connection.query('SELECT * FROM users WHERE auth0_id= ? ', [req.params.id], (err, users) => {
      connection.release()

      if(!err) {
        res.send(users);
      }else {
        console.log(err)
      }
    })

  })
})

app.post('/addNewUser', (req, res) => {
  pool.getConnection((err, connection) => {
    if(err) throw err;
    console.log(`connected as id ${connection.threadId}`)

    const {id, auth0_id, coins} = req.body
    console.log(req.body)
    connection.query("INSERT INTO users (id, auth0_id, coins) VALUES (?, ?, ?);", [id, auth0_id, coins], (err, users) => {
      connection.release()
      
      if(!err) {
        res.send(`Added new user with ID: ${auth0_id}`)
      }else {
        console.log(err)
      }
    })

  })
})

app.post('/updateCoins', (req, res) => {
  pool.getConnection((err, connection) => {
    if(err) throw err;
    console.log(`connected as id ${connection.threadId}`)

    const {id, auth0_id, coins} = req.body
    console.log(req.body)
    connection.query("UPDATE users SET coins = trim(?) WHERE id=?;", [coins, id], (err, users) => {
      connection.release()
      
      if(!err) {
        res.send(`Updated user with ID: ${auth0_id}`)
      }else {
        console.log(err)
      }
    })

  })
})

// Listen on enviornment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`))