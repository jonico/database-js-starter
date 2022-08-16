import { connect } from '@planetscale/database'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()
const app = express()
app.use(express.json())

const config = {
  host: process.env.PS_HOST,
  username: process.env.PS_USERNAME,
  password: process.env.PS_PASSWORD,
}
const conn = await connect(config)

app.get('/', async (req, res) => {
  const results = await conn.execute("SELECT * FROM hotels")
  console.log(results)
  res.json(results.rows)
})

app.post('/', async (req, res) => {
  const query = "INSERT INTO hotels (`name`, `address`, `stars`) VALUES (:name, :address, :stars)"
  const params = {
    name: req.body.name,
    address: req.body.address,
    stars: req.body.stars
  }
  const results = await conn.execute(query, params)
  console.log(results)
  res.json({
    id: results.insertId,
    name: req.body.name,
    address: req.body.address,
    stars: req.body.stars
  })
})

app.put('/:id', async (req, res) => {
  const query = "UPDATE hotels set `name`=:name, `address`=:address, `stars`=:stars WHERE `id`=:id"
  const params = {
    id: req.params.id,
    name: req.body.name,
    address: req.body.address,
    stars: req.body.stars
  }
  const results = await conn.execute(query, params)
  console.log(results)
  res.status(200).send()
})

app.delete("/:id", async (req, res) => {
  const query = "DELETE FROM hotels WHERE `id`=:id"
  const params = {
    id: req.params.id,
    name: req.body.name,
    address: req.body.address,
    stars: req.body.stars
  }
  const results = await conn.execute(query, params)
  console.log(results)
  res.status(200).send()
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`)
})
