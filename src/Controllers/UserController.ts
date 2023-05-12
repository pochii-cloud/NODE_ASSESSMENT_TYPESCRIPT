import {Response,Request, RequestHandler, NextFunction } from "express";
import { sqlConfig } from "../config";
import mssql from 'mssql'
import bcrypt from 'bcrypt';
import {v4 as uid} from 'uuid'
import jwt from 'jsonwebtoken'

// Define the JWT secret
const JWT_SECRET = 'my-secret-key';
import { registrationSchema } from "../Helpers/joiauth";
interface ExtendedRequest extends Request{
    body:{
        id:string,
        username:string,
        email:string,
        password:string
    }
}

interface User{
    // id?:string
    name:string
    email:string
    password:string
}

export const registerusercontroller= async(req:ExtendedRequest,res:Response)=>{
    try {

        //creates users id
        let id=uid()

        //gets users data from the body
        const {username,email,password} = req.body

         //validate first
         const {error}= registrationSchema.validate(req.body)
         if(error){
             return res.status(404).json(error.details[0].message)
         }
        //hashes password
        const hashedPassword = await bcrypt.hash(password,10)

        //connect to database
        let pool=await mssql.connect(sqlConfig)
        await pool.request()
        .input('id',mssql.VarChar,id)
        .input('username',mssql.VarChar,username)
        .input('email',mssql.VarChar,email)
        .input('password',mssql.VarChar,hashedPassword)
        .execute('insertUser')
        const token = jwt.sign(email,'ttttweywastring' as string)
        //  return res.json({mesage:"Login Successfull!!",token})
        return res.status(201).json({message:"user added",token})


    } catch (err:any) {
       return res.status(500).json(err.message)
    }
}


export const getAllUsersController:RequestHandler=async(req,res)=>{
    
    try {
        const pool =  await mssql.connect(sqlConfig)
        let users:User[] =(await (await pool.request()).execute('getusers')).recordset
        res.status(200).json(users)
    } catch (error:any) {
         //server side error
         return res.status(500).json(error.message)
    }
}

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, newPassword } = req.body;

  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool.query`EXEC ResetPassword @Email = ${email}, @NewPassword = ${newPassword}`;

    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({ message: 'Password reset successful' });
    }
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  } 
};




// Middleware to protect the route
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;

    // Check if the header exists
    if (!authHeader) {
      return res.status(401).json({ message: 'Missing authorization header' });
    }

    // Get the token from the header
    const token = authHeader.split(' ')[1];

    // Verify the token
    jwt.verify(token, JWT_SECRET);

    // Call the next middleware
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};










export const getUserByUsername = async (req: Request,  res: Response): Promise<void> => {
  const { username } = req.params;

  try {
    const pool= await mssql.connect(sqlConfig);
    const result = await pool.query`SELECT * FROM USERDB WHERE Username = ${username}`;

    if (result.recordset.length === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(result.recordset[0]);
    }
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};
