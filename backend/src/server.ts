import app from './index'
import connectDatabase from './database/mongooseDatabase'

connectDatabase()

if (app !== undefined) {
    app.listen(4000, () => {
        console.log('Localhost:4000 starting')
    })

}