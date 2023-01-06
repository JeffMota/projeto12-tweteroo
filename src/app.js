import express from 'express'
import cors from 'cors'

let tweeteroo = {
    usuarios: [],
    tweets: []
}

const server = express()
server.use(cors())
server.use(express.json())

const PORT = 5000

server.post('/sign-up', (req, res) => {
    let user = req.body
    user.id = tweeteroo.usuarios.length+1
    tweeteroo.usuarios.push(user)

    res.send('OK')
})

server.post('/tweets', (req, res) => {
    let body = req.body
    if(tweeteroo.usuarios.find(elm => elm.username === body.username)){
        body.id = tweeteroo.tweets.length +1
        tweeteroo.tweets.push(body)
        res.send('OK')
    }
    else{
        res.send('UNAUTHORIZED')
    }
})

server.get('/tweets', (req, res) =>{
    let tweets = []
    if(tweeteroo.tweets.length == 0){
        res.send(tweets)
    }
    if(tweeteroo.tweets.length > 10){
        for(let i = tweeteroo.tweets.length-1; i >= tweeteroo.tweets.length-10; i--){
            let user = tweeteroo.usuarios.find(elm => elm.username === tweeteroo.tweets[i].username)
            let aux = tweeteroo.tweets[i]
            aux.avatar = user.avatar
            tweets.push(aux)
        }
    }
    else{
        for(let i = 0; i < tweeteroo.tweets.length; i++){
            let user = tweeteroo.usuarios.find(elm => elm.username === tweeteroo.tweets[i].username)
            let aux = tweeteroo.tweets[i]
            aux.avatar = user.avatar
            tweets.push(aux)
        }
    }
    res.send(tweets)
})

server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))