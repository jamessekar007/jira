import { NextFunction, Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { createHash, randomBytes } from 'crypto';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
dotenv.config();
import { ParsedQs } from 'qs';
class AdminController {
  
    // Define the function to get all project
  public getProjects = async (req: Request, res: Response): Promise<void> => {
    let projectData = []
    
    if(req.params.id!=undefined){
      const projectId: number = parseInt(req.params.id, 10);

       projectData = await prisma.project.findMany(
        {
          where: {
            id:projectId
        }
        }
       );
    }
    else{
       projectData = await prisma.project.findMany();
    }

    res.status(200).json({ data:projectData });
  }

  // Define the function to create a new user
  public createProjects = async (req: Request, res: Response): Promise<void> => {

    const { name } = req.body;
    const project = await prisma.project.create({
      data: {
        name: name
      },
    });
    res.status(201).json({ data:project });
  }

      // Define the function to create a new user
  public createTasks = async (req: Request, res: Response): Promise<void> => {

    const { name,projectId,userId,startDate,endDate,estimatedTime,status } = req.body;

    let startDateVale = new Date(startDate).toISOString();
    let endDateVale = new Date(endDate).toISOString();
    
    const task = await prisma.task.create({
      data: {
        name: name,
        projectId:projectId,
        userId:userId,
        startDate:startDateVale,
        endDate:endDateVale,
        estimatedTime:estimatedTime,
        status:status
      },
    });

    res.status(201).json({ message: 'Task created successfully', data:task });
}
public parseQueryParam(param: string | ParsedQs | string[] | ParsedQs[] | undefined): number | null {
  if (typeof param === "string") {
      return parseInt(param, 10);
  }
  return null; // Return null or handle the case when it's not a string
}
    // Define the function to get all project
    public getTasks = async (req: Request, res: Response): Promise<void> => {
      let taskData = []
      const whereClause: any = {};
     
      const { user,  status } = req.query;
      let projectId = '';
    
      const filters = {} as { projectId: number,userId: number, status:number };



    if (req.query.projectId) {
      let projectId = req.query.projectId as unknown as number | 0;
      
      if(typeof(projectId)=='string'){
        projectId = parseInt(projectId);
      }

      filters.projectId = projectId // Exact match
    }

    if (req.query.userId) {
      let userId = req.query.userId as unknown as number | 0;
      
      if(typeof(userId)=='string'){
        userId = parseInt(userId);
      }

      filters.userId = userId // Exact match
    }

    if (req.query.status) {
      let status = req.query.status as unknown as number | 0;
      
      if(typeof(status)=='string'){
        status = parseInt(status);
      }

      filters.status = status // Exact match
    }

      taskData = await prisma.task.findMany({
        //
        include: {
            project: true, 
            user: true,
        },
        where: filters,
    });

  
      res.status(200).json({ data:taskData });
    }
    public processUserId(userId: string | ParsedQs | string[] | ParsedQs[]): number | null {
      // Check if userId is a string
      if (typeof userId === 'string') {
          return parseInt(userId, 10); // Parse userId to integer
      } 
      // Check if userId is an array
      else if (Array.isArray(userId)) {
          // You may want to handle multiple user IDs; here, we just return the first valid one
          for (const id of userId) {
              if (typeof id === 'string') {
                  return parseInt(id, 10);
              }
          }
      }
      // Handle the ParsedQs case if needed
      else if (typeof userId === 'object' && userId !== null) {
          // For example, if userId is an object, you might want to access a specific key
          // Example key: 'id' (adjust as needed)
          if ('id' in userId && typeof userId['id'] === 'string') {
              return parseInt(userId['id'], 10);
          }
      }
      // If we couldn't find a valid userId, return null
      return null;
  }

  
public async deleteTasks(req: Request, res: Response, next: NextFunction){

  let id = req.params.id as unknown as number | 0;
      
  if(typeof(id)=='string'){
    id = parseInt(id);
  }

  const updatedTask = await prisma.task.delete({
    where: {
      id: id,  // unique identifier from the found task
    }
  });
  res.status(200).json({ message: 'Tasks Deleted successfully'});
 
}
public async getTasksByProject(req: Request, res: Response, next: NextFunction){

  let projectId = req.params.id as unknown as number | 0;

  if(typeof(projectId)=='string'){
    projectId = parseInt(projectId);
  }
  let taskData = await prisma.task.findMany({
   //
   include: {
       project: true,
       user: true
   },
   where: {
    projectId:projectId
   },
 });
 
 res.status(200).json({ data:taskData });
 
}

}
export default AdminController;