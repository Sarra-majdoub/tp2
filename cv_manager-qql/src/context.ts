import { Db, db } from './db';

export interface Context {
  db: Db;
}

export function createContext(): Context {
  return { db };
}