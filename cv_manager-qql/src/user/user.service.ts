import { Injectable } from '@nestjs/common';
import { Context } from '../context';
import { DbCv } from '../db';

@Injectable()
export class UserService {
    
  getUsers(context: Context) {
    return context.db.users;
  }

  getUserById(id: string, context: Context) {
    return context.db.users.find(user => user.id === id);
  }

  getCvsForUser(user: DbCv, context: Context) {
    return context.db.cvs.filter(cv => cv.userId === user.id);
  }
}
