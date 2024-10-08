import { NextFunction, Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { createHash, randomBytes } from 'crypto';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
dotenv.config();
class UserController {
    // Your methods here

    public getUsers(req: Request, res: Response, next: NextFunction){
        console.log('Get Users');
    }
     // Define the function to create a new user
  public createUser = async (req: Request, res: Response): Promise<void> => {
    console.log('Create Users');
    const { name, email,password } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email is required' });
    }

    const users = await prisma.user.findMany({
        where: {
          email: email,
        },
      });
      if(users.length>0){
        res.status(400).json({ message: 'Email already Exist' });
      }
      else{
        const salt = process.env.SALT || 'XYZABCD98765!@#$%EFGH1234IJKL%$#@!';
        const hash = createHash('sha512')
          .update(salt + password) // Combine salt with the data
          .digest('hex');
      
        const user = await prisma.user.create({
          data: {
            name: name,
            userTypeId: 2,
            email: email,
            password:hash
          },
        });

        res.status(201).json({ message: 'User created successfully', data:user });
      }
}

public loginUser = async (req: Request, res: Response): Promise<void> => {
    console.log('Login Users');
    const { email,password } = req.body;
    const salt = process.env.SALT || 'XYZABCD98765!@#$%EFGH1234IJKL%$#@!';
    const hash = createHash('sha512')
      .update(salt + password) // Combine salt with the data
      .digest('hex');

      const users = await prisma.user.findMany({
        where: {
          AND: [
            { email: email },
            { password: hash },  // name contains 'John'
          ],
        },
      });

      console.log(users);
      if(users.length>0){
        const jwt_secret_key = process.env.JWT_SECRET_KEY || "EFGH1234IJKL%$#@!XYZABCD98765!@#$%"

        const accessToken = jwt.sign({ users }, jwt_secret_key, { expiresIn: '1h' });
  
        const refreshToken = jwt.sign({ users }, jwt_secret_key, { expiresIn: '10d' });
  
        let response = {
           name:users[0].name,
           email:users[0].email,
           accessToken:accessToken,
           refreshToken:refreshToken
        }
  
        res.status(200).json({ message: 'User Logged In successfully', data:response });
      }
      else{
        res.status(400).json({ message: 'Invalid Credentials'});
      }


}

public profile = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ message: 'User Logged In successfully'});
}

public async getTasks(req: Request, res: Response, next: NextFunction){
 let userId = req.user.users[0].id

 let taskData = await prisma.task.findMany({
  //
  include: {
      project: true
  },
  where: {
    userId:userId
  },
});

res.status(200).json({ data:taskData });

}

public async updateTasks(req: Request, res: Response, next: NextFunction){
  const { status } = req.body;

  let userId = req.user.users[0].id as unknown as number | 0;
      
  if(typeof(userId)=='string'){
    userId = parseInt(userId);
  }

  let id = req.params.id as unknown as number | 0;
      
  if(typeof(id)=='string'){
    id = parseInt(id);
  }

  const task = await prisma.task.findFirst({
    where: {
      AND: [
        { id: id },
        { userId: userId },
      ],
    },
  });

  if (task) {
    const updatedTask = await prisma.task.update({
      where: {
        id: task.id,  // unique identifier from the found task
      },
      data: {
        // update fields here
        status:status
      },
    });
    res.status(200).json({ message: 'Tasks updated successfully'});
  }
  else{
    res.status(400).json({ message: 'Invalid Task'});
  }
 
}




}
export default UserController;