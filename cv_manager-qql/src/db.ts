export interface DbCv {
    id: string;
    name: string;
    age: number;
    job: string;
    userId: string;
    skillIds: string[];
  }
  
  export interface DbUser {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  }
  
  export interface DbSkill {
    id: string;
    designation: string;
  }
  
  export interface Db {
    cvs: DbCv[];
    users: DbUser[];
    skills: DbSkill[];
  }
  
  export const db: Db = {
    users: [
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin' },
    ],
    skills: [
      { id: '1', designation: 'JavaScript' },
      { id: '2', designation: 'TypeScript' },
      { id: '3', designation: 'GraphQL' },
      { id: '4', designation: 'NestJS' },
    ],
    cvs: [
      { 
        id: '1', 
        name: 'John CV', 
        age: 28, 
        job: 'Developer', 
        userId: '1', 
        skillIds: ['1', '3'] 
      },
      { 
        id: '2', 
        name: 'Jane CV', 
        age: 32, 
        job: 'Tech Lead', 
        userId: '2', 
        skillIds: ['1', '2', '3', '4'] 
      },
    ],
  };