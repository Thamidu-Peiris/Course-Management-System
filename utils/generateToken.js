import jwt from 'jsonwebtoken'

export const generateAccessToken = (id,name,email)=>{
    return jwt.sign({id:id,name:name, email:email}, process.env.JWT_SECRET, {expiresIn: '1h'});

}

export const generateRefreshToken = (id)=>{
    return jwt.sign({id:id}, process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'});

}