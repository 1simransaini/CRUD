const express=require('express');
const app=express();
// const database=require('./database')
// const connection=require('./database');
// const dbservice=require('./database')
const{connection,dbservice}=require('./database')

const cors=require('cors');
const dotenv=require('dotenv');
dotenv.config();

app.use(cors());                    //send data to backend
app.use(express.json());
app.use(express.urlencoded({extended : false}));    //this is used to fetch data from the form 


//creating out routes

//create
app.post('/insert', (req,res)=>{
    // console.log(req.body) jo type kara in add wale form mei vo print hua
    const {name}=req.body;
    const db=dbservice.getdbserviceInstance();
    const result=db.insertNewName(name);

    result
    .then(data=>res.json({data:data}))
    .catch(err=>console.log(err));
});

//read
app.get('/getAll',(req,res)=>{
    // res.send("Here at getAll")
    // console.log('test')
    const db=dbservice.getdbserviceInstance();
    const result=db.getAllData();

    result
    .then(data=>res.json({data:data}))
    .catch(err=>console.log(err));
});

//update
app.patch('/update', (req,res)=>{
    const {id , name}=req.body;
    const db=dbservice.getdbserviceInstance();

    const result=db.updateNameById(id,name);

    result
    .then(data=>res.json({success:data}))
    .catch(err=>console.log(err));
});

//delete
app.delete('/delete/:id', (req,res)=>{
    // console.log(req.params);
    const { id } = req.params;
    const db=dbservice.getdbserviceInstance();
    const result=db.deleteRowById(id);

    result
    .then(data=>res.json({success:data}))
    .catch(err=>console.log(err));
})

app.get('/search/:name', (req,res)=>{
    const { name }=req.params;
    const db=dbservice.getdbserviceInstance();
    const result=db.searchByName(name);

    result
    .then(data=>res.json({data:data}))
    .catch(err=>console.log(err));

})
app.listen(process.env.PORT, ()=>{
    console.log(`Listening to the port ${process.env.PORT}`)
    connection.connect(function(err){
        if(err) throw err;
        console.log("Database is Connected")
    });
});