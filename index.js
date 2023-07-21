const express= require('express');
const Joi=require('joi');
const req = require('express/lib/request');
const res = require('express/lib/response');
const login = require('./logger/login');
const clients= require("./clients/clients");
const app= express();
const mongoose = require('mongoose');
const helmet = require('helmet');


mongoose.connect('mongodb://127.0.0.1:27017/bdcommerce',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => console.log('Connected!'))
  .catch((error) => console.error('Not Connected',error));

app.use(express.json());

app.use(helmet());

app.use('/clients',clients)




app.get('/',(req,res)=>{

    res.send('Badreddine aziz');
});

app.get('/names',(req,res)=>{

    res.send(siblings );
});

app.get('/names/:id',(req,res)=>{

 const sibl= siblings.find(element=>element.sibId == req.params.id);

    res.send(sibl);
});

app.get('/names/:id/:name',(req,res)=>{

    res.send(req.query);
});

app.post('/name',(req,res)=>{

    const schema =Joi.object({
        id: Joi.number().integer().required(),
        name:Joi.string().min(2).max(50).required(),
        age: Joi.number().integer().required(),
    }) ;

    const joiError=schema.validate(req.body);

    if (joiError.error) {
        return res.send(joiError.error);
    }

     const sib={
        id: req.body.id,
        name:req.body.name,
        age:req.body.age,
    } 
    siblings.push(sib);
    res.send(sib);
    
})

app.put('/name/:id',(req,res)=>{

       const findSib=siblings.find(element => element.sibId == req.params.id);

       if (!findSib) {
        return res.send('not found');
       }

       const schema=Joi.object({
       // id: Joi.number().integer().required(),
        name:Joi.string().min(2).max(50).required(),
       // age:Joi.number().integer().required(),
       });

       const joiError=schema.validate(req.body);

       if (joiError.error) {
        
             return res.send(joiError.error);

       }

       findSib.name=req.body.name;
       res.send(findSib); 

});

app.delete('/name/:id',(req,res)=>{

    const findSib=siblings.find(element => element.sibId == req.params.id);
    if (!findSib) {
        return res.send('not found');
       }
      const siblId=siblings.indexOf(findSib);
      siblings.splice(siblId,1);
       res.send(siblings);
})

app.listen(3000);