const express = require('express') 
const logger = require('./loggerMidlware.js')
const cl = require('./credentialLoader.js')
const mongoose = require('mongoose')
const cors = require('cors')
const Joi = require('joi')
const app = express()
const port = 3000


app.use(cors())
app.use(express.json())
app.use(logger.logger)
app.use(express.static('public'))

const todoValidate = Joi.object({
    todoText: Joi.string().min(5).required()
})

const todoSchema = new mongoose.Schema({
    todoText: {
        type: String,
        required: true,
        minlength: 5 
    }
})

const todoModel = mongoose.model('todo',todoSchema,'todos')


async function main(){
    try{
        const mongoDB = await cl.loadCredentialsFromCfg()

        mongoose.connect(mongoDB)
        const db = mongoose.connection

        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', function() {
            console.log("Database test connected")
            app.listen(port, () => {
                console.log('Example app listening on port 3000')
            })
        })

        app.get('/todos', async (req,res) =>{
            try{
                res.json(await todoModel.find({}))
            }catch(e){
                console.log(e.message)
                return res.status(500).json({message: 'Internal server error'})
            }
            
        })

        app.post('/todos', async (req, res) =>{
            try{
                const { todoText } = req.body
                const {error} = todoValidate.validate({todoText})

                if(error){
                    return res.status(400).json({
                        message: 'Bad request: Invalid input todo data'
                    })
                }

                const todo = new todoModel({
                    todoText: todoText
                })

                const savedTodo = await todo.save()

                res.json(savedTodo)
            }catch(e){
                console.log(e.message)
                return res.status(500).json({message: 'Internal server error'})
            }
            
        })

        app.delete('/todos/:id', async (req,res)=>{
            let todo
            try{
                if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                    return res.status(400).json({ message: 'Invalid ObjectId' });
                }
                todo = await todoModel.findById(req.params.id)
                if(todo){
                    await todo.deleteOne()
                    res.json(todo)
                }else{
                    res.status(404).end()
                }
            }catch(e){
                console.log(e.message)
                return res.status(500).json({message: 'Internal server error'})
            }
            
            
        })

        app.put('/todos/:id', async (req,res)=>{
            const { todoText } = req.body

            const {error} = todoValidate.validate({todoText})

            if(error){
                return res.status(400).json({message: 'Bad request: Invalid input todo data'})
            }
            
            let todoToUpd
            try{
                if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                    return res.status(400).json({ message: 'Invalid ObjectId' });
                }
                todoToUpd = await todoModel.findById(req.params.id)
                if(todoToUpd){
                    await todoToUpd.updateOne({todoText: todoText})
                    return res.json({message: 'todo updated successfully'})
                }else{
                    return res.status(404).json({message: 'Not found'})
                }
            }catch(e){
                console.log(e.message)
                return res.status(500).json({message: 'Internal server error'})
            }
        })
        
    }catch(e){
        throw e
    }

}

main()