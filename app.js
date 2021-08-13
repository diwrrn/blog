

require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const multer = require('multer');
const encrypt = require('mongoose-encryption')
const nodeMailer = require('nodemailer')
var async = require('async');


const app = express();

//CONNETCT MONGOOSE TO MONGODB
mongoose.connect("mongodb://localhost:27017/diweenDB", {useNewUrlParser: true});
//SETTING EJS VIEW ENGINE
app.set('view engine', 'ejs');
//REQ.BODY.....
app.use(bodyParser.urlencoded({extended: false}))
//PUBLIC FILES
app.use(express.static("public"));

// sender nodemailer
const transporter = nodeMailer.createTransport({
    service: 'Hotmail',
    auth: {
        user: 'diween6666@outlook.com',
        pass: 'Diween2001@'
    }
});


// SCHEMA
const blogSchema = {
    title: String,
    description: String,
    img: String,
    date: String,
    param: String,
    author: String,
    readingTime: String,
    topic: String
}
const userSchema = new mongoose.Schema({
    mail: String, 
    password: String,
    auth: String
})

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']})

// MODEL
const Blogdata = mongoose.model('blogdata', blogSchema);
const Userdata = mongoose.model('userdata', userSchema);

// MULTER STORAGE INSERTION
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
})

// MULTER UPLOAD
var upload = multer({ 
    storage: storage, 
    limits:{
        fieldSize: 1024*1024*3
    } 
})

// HOME VIEW 


app.get('/', (req, res)=>{
    async.series([
        (callback)=>{
            return Blogdata.find({}).exec(callback)
        },

        (callback)=>{
           return Blogdata.find({topic: 'start'}).exec(callback)
        },
        (callback) =>{
            return Blogdata.find({topic: 'projects'}).exec(callback)
        },
        (callback)=>{
            return Blogdata.find({topic: 'blockchain'}).exec(callback)
        }], 
        (err, datafound)=>{
            if(err){
                console.log(err)
            }else{
                console.log('nnd')
                res.render('content', {
                    dataAll: datafound[0],
                    dataStart: datafound[1],
                    dataProjects: datafound[2],
                    dataBlockchain: datafound[3]
                })
            }
        }
    )
})

// ABOUT VIEW
app.get('/about', (req, res)=>{
    res.render('about')
})

// FORM VIEW
app.get('/form', (req, res)=>{
    res.render('form')
})

app.post('/form', (req, res)=>{
    const name = req.body.formName;
    const mail = req.body.formEmail;
    const msg = req.body.formMessage;

    const options = {
        from: 'diween6666@outlook.com',
        to: 'diween6666@outlook.com',
        subject:'Cryptokurdi Form Entry',
        text: 'Name: '+ name + '\nEmail: ' + mail + '\nMessage: ' + msg
    }

    transporter.sendMail(options, (err, info)=>{
        if(err){
            console.log(err)
        }else{
            console.log(info.response)
        }
    })
    res.redirect('/form')
})

// CREATE VIEW
// app.get('/create', (req, res)=>{
//     res.render('create')
// });

// LOGIN VIEW
app.get('/login', (req,res)=>{
    res.render('login')
});

// register VIEW
// app.get('/register', (req,res)=>{
//     res.render('register')
// });

// // REGISTER POST

// app.post('/register', (req, res)=>{
//     const mail = req.body.email.toLowerCase();
//     const pass = req.body.password; 
//     const name = req.body.auth;
    
//     console.log(pass)
//     const adminAdd = new Userdata({
//         mail: mail,
//         password: pass,
//         auth: name
//     });
//     adminAdd.save();
//     res.redirect('/login')
// })

// LOGIN

app.post('/login', (req, res)=>{
    const mail = req.body.email.toLowerCase();
    const pass = req.body.password;
    Userdata.findOne({mail: mail}, (err, foundData)=>{
        if(err){
            console.log(err)
            res.send('Wrong EMAIL')
        }else{
            if(foundData.password === pass){
                Blogdata.find({}, (err, foundItems)=>{     
                    Userdata.find({}, (err, foundItemUser)=>{
                        res.render('create', {data: foundItems, dataU: foundItemUser})
                        console.log(foundItemUser + ": what y")
                    })               
                    console.log('success')
                })
            }else{
                res.send("Wrong Password")
            }
        }
    })
})

// CREATE POST
const datee = new Date();
var dateM = datee.getMonth() + 1;
var dateD = datee.getDay() + 1;
var dateY = datee.getFullYear();

const dateF = dateD + "/" + dateM + "/" + dateY
console.log(dateF)

app.post('/create', upload.single("myFile") ,(req, res)=>{
    console.log(req.file)
    const userData =  new Blogdata({
        title: req.body.tit,
        description: req.body.des,
        img: req.file.filename,
        date: dateF,
        param: req.body.param,
        author: req.body.author,
        readingTime: req.body.time,
        topic: req.body.topic
    })
    userData.save();

    // userData.save();
    res.redirect('/')
})

// DELETE POST
app.post("/delete", (req, res)=>{
    const userDelete = req.body.dltBtn;
    console.log(userDelete)
    Blogdata.findByIdAndDelete({_id: userDelete}, (err)=>{
        if(err){
            console.log('failed deleting')
        }else{
            console.log('success deleted')
        }
    })
    res.redirect('/login')
})

// EDIT
app.post('/edit', (req,res)=>{
    const editId = req.body.editBtn;
    Blogdata.findOne({_id: editId}, (err, dataFound)=>{
        // res.render('edit', {data: dataFound})
        if(err){
            console.log(err)
        }else{
            res.render('edit', {data:dataFound})
        }
    })
})

app.post('/editdone', (req,res)=>{
    const newTitle = req.body.tit;
    const newDesc = req.body.des;
    const edit2Id = req.body.btnIdd;
    console.log(newTitle)
    Blogdata.findOneAndUpdate({_id: edit2Id}, {title: newTitle, description: newDesc}, (err, data)=>{
        if(err){
            console.log("failed to update")
        }else{
            console.log(data)
            console.log("Updated Successfully")
        }
    })
    res.render('login')
})

// Params Route
app.get('/p/:post', (req, res)=>{
    const params = req.params.post; 
    Blogdata.find({}, (err, dataFound)=>{
        dataFound.forEach((datas)=>{
            
            if(datas.param === params){
                res.render('viewpage', {data: datas, dataAll: dataFound})
            }
        })
    })
})

app.get('/projects', (req, res)=>{
    Blogdata.find({topic: 'projects'}, (err, foundItems)=>{
        if(err){
            console.log(err);
        }else{
            res.render('projects', {data:foundItems});
        }
    })
})

app.get('/blockchain', (req, res)=>{
    Blogdata.find({topic: 'blockchain'}, (err, foundItems)=>{
        if(err){
            console.log(err);
        }else{
            res.render('blockchain', {data:foundItems});
        }
    })
})

app.get('/start', (req, res)=>{
    Blogdata.find({topic: 'start'}, (err, foundItems)=>{
        if(err){
            console.log(err);
        }else{
            res.render('start', {data:foundItems});
        }
    })
})

app.get('/all', (req, res)=>{
    Blogdata.find({}, (err, foundItems)=>{
        if(err){
            console.log(err);
        }else{
            res.render('allposts', {data:foundItems});
        }
    })
})


//LISTEN PORT
app.listen(app.listen(process.env.PORT, '0.0.0.0', ()=>{
    console.log('Server is live!')
} ))

