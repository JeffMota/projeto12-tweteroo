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

//Login
server.post('/sign-up', (req, res) => {
    let user = req.body

    //Validação
    if(!user.username || !user.avatar || !isNaN(user.username) || !isNaN(user.avatar)){
        res.status(400).send('Todos os campos são obrigatórios!')
    }

    user.id = tweeteroo.usuarios.length+1
    tweeteroo.usuarios.push(user)

    res.status(201).send('OK')
})

//Envio de tweets
server.post('/tweets', (req, res) => {
    let body = req.body
    const username = req.params.username

    //Validação
    if(!username || !body.tweet || !isNaN(body.tweet)){
        res.status(400).send('Todos os campos são obrigatórios!')
    }

    if(tweeteroo.usuarios.find(elm => elm.username === body.username)){
        body.id = tweeteroo.tweets.length +1
        tweeteroo.tweets.push(body)
        res.status(201).send('OK')
    }
    else{
        res.sendStatus(401)
    }
})

//Buscar ultimos 10 tweets
server.get('/tweets', (req, res) =>{
    let tweets = []
    const lengthT = tweeteroo.tweets.length

    //Query Strings
    let page = parseInt(req.query.page)
    if(page === undefined){
        page = 1
    }
    if(page < 1){
        res.status(400).send('Informe uma página válida!')
    }

    if(lengthT == 0){
        res.send(tweets)
    }

    if(lengthT >= 10){
        if(Math.floor(lengthT / 10) >= page){
            for(let i = lengthT-((page-1)*10)-1; i > lengthT-1-((page-1)*10)-10; i--){
                let user = tweeteroo.usuarios.find(elm => elm.username === tweeteroo.tweets[i].username)
                let aux = tweeteroo.tweets[i]
                aux.avatar = user.avatar
                tweets.push(aux)
            }
        }
        else{
            for(let i = lengthT-((page-1)*10)-1; i > lengthT-1-((page-1)*10) - lengthT % 10; i--){
                let user = tweeteroo.usuarios.find(elm => elm.username === tweeteroo.tweets[i].username)
                let aux = tweeteroo.tweets[i]
                aux.avatar = user.avatar
                tweets.push(aux)
            }
        }
    }
    else{
        for(let i = lengthT-1; i >= 0; i--){
            let user = tweeteroo.usuarios.find(elm => elm.username === tweeteroo.tweets[i].username)
            let aux = tweeteroo.tweets[i]
            aux.avatar = user.avatar
            tweets.push(aux)
        }
    }
    res.send(tweets)
})

//Buscar tweets por usuarios
server.get('/tweets/:username', (req, res) => {
    const username = req.params.username
    let tweets = []
    let user = tweeteroo.usuarios.find(elm => elm.username === username)

    if(!user){
        res.status(404).send('Usuário não encontrado')
    }

    let avatar = user.avatar

    tweeteroo.tweets.forEach(tweet => {
        if(tweet.username === username){
            let aux = tweet
            aux.avatar = avatar
            tweets.push(aux)
        }
    })

    res.send(tweets)

})

server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))