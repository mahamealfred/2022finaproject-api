import Models from '../database/models';
const {users} =Models;

class IsVerifiedAccount{
    static async isVerified(req,res,err, next){
     const user=await users.findOne({isActive:true});
     if(err){
        return res.status(500).send({msg: err.message});
    }
    // user is not found in database i.e. user is not registered yet.
    else if (!user){
        return res.status(401).send({ msg:'The email address ' + req.body.email + ' is not associated with any account. please check and try again!'});
    }
    else if (!user.isVerified){
        return res.status(401).send({msg:'Your Email has not been verified. Please click on resend'});
    } 
    // user successfully logged in
    else{
        next()
        return res.status(200).send('User successfully logged in.');
    }

}
}

export default IsVerifiedAccount;