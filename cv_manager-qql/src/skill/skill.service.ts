import { Injectable } from '@nestjs/common';
import { Context } from '../context';
import { DbCv } from '../db';

@Injectable()
export class SkillService {
  getSkills(context: Context) {
    return context.db.skills;
  }

  getSkillById(id: string, context: Context) {
    return context.db.skills.find(skill => skill.id === id);
  }

  getCvsForSkill(skill: DbCv, context: Context) {
    return context.db.cvs.filter(cv => cv.skillIds.includes(skill.id));
  }
}