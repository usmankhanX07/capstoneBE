const express = require('express');
const router = express.Router();
const supabase = require('../subabase.js');

router.post("/signup", async (req,res) =>{
    try{
        const {email, password} = req.body;

        if(email==null || password==null){
            res.status(400).json({message:"Invalid email/password format"});
        }
        else {
            const {data, error} = await supabase.auth.signUp({
                email,
                password
            });
            if(error){
                return res.status(400).json({message:error.message});
            }
            res.status(201).json({message:"User created successfully",user:data.user});
        }
    }catch(err){
        console.log(err);
    }
});

router.post("/login", async (req,res) => {
    try{
        const {email,password} = req.body;
        if(email == null || password == null){
            res.status(400).json({message:"Invalid email/passwordword format"});
        }
        else {
            const{data,error} = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if(error){
                return res.status(400).json({message:error.message});
            }
            else {
                return res.status(200).json({
                    message:"Log in successful",
                    access_token: data.session.access_token,
                    user:{
                        id: data.user.id,
                        email: data.user.email
                    }
                });
            }
        }
    }catch(err){
        console.log(err);
    }    
});

router.post("/logout", async (req,res) => { 
    const{error} = await supabase.auth.signOut();
    if(error){
        return res.status(400).json({message:error.message});
    }
    return res.status(200).json({message:"Successfully signed out"});
});

module.exports = router;