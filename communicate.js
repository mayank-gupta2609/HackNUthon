const express = require('express'); 
const router = express.Router(); 
const Chat = require('../Models/Chat'); 
var { jsonToxml } = require('../config'); 

router.post('/addMessageXML', async (req, res) => {
    try { 
        const x = await Chat.findOne({ sender: req.body.root.sender[0], receiver: req.body.root.receiver[0] })
        res.header('Content-Type', 'application/xml')
        if (!x) {
            await Chat.create({ sender: req.body.root.sender[0], receiver: req.body.root.receiver[0], chat: [req.body.root.msg[0]] }) 
        } 

        await Chat.findOneAndUpdate({ sender: req.body.root.sender[0], receiver: req.body.root.receiver[0] }, { $push: { chat: req.body.root.msg[0] } }) 
        res.json("added")
    } catch (err) {
        res.status(500).send("Something Went Wrong")
        console.log(err.message)
    }
})

router.post('/getMessagesXML', async (req, res) => {
    try { 
        const x = await Chat.findOne({ sender: req.body.root.sender[0], receiver: req.body.root.receiver[0] }) 
        let ans = jsonToxml(x) 
        res.header('Content-Type', 'application/xml')
        res.status(200).send(ans)
    } catch (err) {

    }
})


router.post('/getMessagesJSON', async function (req, res) {
    try {
        const x = await Chat.findOne({ sender: req.body.sender, receiver: req.body.receiver })
        res.header('Content-Type', 'application/json')
        res.status(200).send(x)
    } catch (err) {
        res.send(err)
    }

});


router.post('/addMessagesJSON', async function (req, res) {
    try {
        const x = await Chat.findOne({ sender: req.body.sender, receiver: req.body.receiver })
        if (!x) {
            await Chat.create({ sender: req.body.sender, receiver: req.body.receiver, chat: req.body.msg }) 
        }
        console.log("object")
        await Chat.findOneAndUpdate({ sender: req.body.sender, receiver: req.body.receiver },
            {
                $push: { chat: req.body.msg }
            })
        res.json("added")
    } catch (err) {
        res.send(err)
    }

});

module.exports = router