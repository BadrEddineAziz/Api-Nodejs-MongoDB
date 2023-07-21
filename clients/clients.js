const express= require('express');
const Joi=require('joi');
const req = require('express/lib/request');
const res = require('express/lib/response');
const router = express.Router();
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({

    nom: {type : String , required: true,trim:true},

    prenom:{type : String , required: true,trim:true},

    age:{ type:Number , min : [ 18 , "your age is less than 18 !!" ]},

    nationalite:{ type : Array , validate:{
      validator:function (params) {
        return params.length >0
      },
      message: "you should add a country"
    }},

    methodPayment:{ type: String , enum : ['cash on delivre','credit card','paypal'] ,required: true },

    date:{ type:Date , default:Date.now },

    fidele: Boolean,

    gift: { type : String,
    required:function () {
      return this.fidele
    } }
  })


  const Client= mongoose.model("Client",clientSchema);


router.get('/',async (req,res)=>{
    
    const clients= await Client.find()

    res.send(clients);
});

router.get('/:id',async (req,res)=>{

    const client= await Client.find( {_id : req.params.id} )

    res.send(client);
});


router.post('/',async(req,res)=>{

    const schema =Joi.object({
       
        nom:Joi.string().min(2).max(50).required(),
        prenom:Joi.string().min(2).max(50).required(),
        age: Joi.number().integer().required(),
        nationalite:Joi.array(),
        date:Joi.date(),
        methodPayment:Joi.string(),
        fidele:Joi.boolean(),
        gift:Joi.string()

    }) ;

    const joiError=schema.validate(req.body);

    if (joiError.error) {
        return res.send(joiError.error);
    }

     const client=  new Client({
        
        nom:req.body.nom,
        prenom:req.body.prenom,
        age:req.body.age,
        nationalite:req.body.nationalite,
        methodPayment:req.body.methodPayment,
        fidele:req.body.fidele,
        gift:req.body.gift

    } )
    try {
        const result = await client.save();
          res.send(result);
     } 
     catch (error) {
      console.error(error.message);
      // console.error("toute les champs sont obligatoire");
     }
    
    
})

router.put('/:id',async (req,res)=>{

    const schema=Joi.object({
        // id: Joi.number().integer().required(),
         prenom:Joi.string().min(2).max(50).required(),
        // age:Joi.number().integer().required(),
        });
 
        const joiError=schema.validate(req.body);
 
        if (joiError.error) {
         
              return res.send(joiError.error);
 
        }

       const findcli= await Client.findByIdAndUpdate( req.params.id,{
        $set:{
            prenom : req.body.prenom,
        }
       },{new:true});

       if (!findcli) {
        return res.send('not found');
       }
   
       res.send(findcli); 

});

router.delete('/:id',async(req,res)=>{

    const findcli = await Client.findByIdAndDelete(req.params.id);
    if (!findcli) {
        return res.send('not found');
       }
       res.send(findcli+"delete succsfully");
})



module.exports = router;