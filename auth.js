const express = require('express');
const User = require('../Models/User'); 
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET = '8a8@7$6m3O2P123@#'; 
var { userLogin } = require('../config');
var { getUser } = require('../config')

router.post('/adduserJSON', 
[body('name', 'Enter a valid name').isLength({ min: 2 }),
body('email', 'Enter a valid email').isEmail(),
body('password', 'Enter valid password').isLength({ min: 8 })], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    try {
        let user = await User.findOne({ username: req.body.uname });
        if (user) return res.status(400).json({ error: "User exists" })
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
            username: req.body.username
        });

        const data = {
            user: {
                id: user.id
            }
        } 

        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken, user })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");

    }


})

router.post('/adduserXML' , async (req, res) => {
    const errors = validationResult(req);
    // console.log(req.body.root)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    try {
        let user = await User.findOne({ username: req.body.root.username[0] });
        if (user) return res.status(400).json({ error: "User exists" })
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.root.password[0], salt);

        user = await User.create({
            name: req.body.root.name[0],
            password: secPass,
            email: req.body.root.email[0],
            username: req.body.root.username[0]
        });

        const data = {
            user: {
                id: user.id
            }
        } 

        const authtoken = jwt.sign(data, JWT_SECRET);
        const x = {'authtoken':authtoken, 'user': user} 
        let ans = userLogin(x)
        res.header('Content-Type', 'application/xml')
        res.send(ans) 

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");

    }

})

router.post('/loginJSON', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
  ], async (req, res) => {
    let success = false; 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body)
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email:req.body.email });
      if (!user) {
        success = false
        return res.status(400).json({ error: "No User found" });
      }
  
      const passwordCompare = await bcrypt.compare(req.body.password, user.password);
      if (!passwordCompare) {
        success = false
        return res.status(400).json({ success, error: "No User found" });
      }
  
      const data = {
        user: {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      console.log(user);
      success = true;
      let uname = user.name;
      let umail = user.email;
      let uid = user._id;
     
    res.json({authtoken, uname, umail, uid,  uname})
  
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
    
});

router.post('/loginXML' , async (req, res) => {
    let success = false; 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body) 
    try {
      let user = await User.findOne({ email:req.body.root.email[0] });
      if (!user) {
        success = false
        return res.status(400).json({ error: "No User found" });
      }
  
      const passwordCompare = await bcrypt.compare(req.body.root.password[0], user.password);
      if (!passwordCompare) {
        success = false
        return res.status(400).json({ success, error: "No User found" });
      }
  
      const data = {
        user: {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      console.log(user);
      success = true;
      let uname = user.name;
      let umail = user.email;
      let uid = user._id;
      const x ={
        'authtoken':authtoken,
        'uname':uname,
        'umail':umail,
        'uid':uid
      }
      const response = getUser(x)
     res.send(response)
  
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
    
});

module.exports = router