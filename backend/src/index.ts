import express, { type Application } from 'express'
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('express-async-errors');

import cookieParser from 'cookie-parser'
import bodyparser from 'body-parser'
import userApiRouter from './api/userApi'
const app: Application = express()

app.use(express.json())
app.use(express.static('public'))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/', userApiRouter)


export default app