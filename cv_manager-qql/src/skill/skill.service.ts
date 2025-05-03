// src/skill/skill.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SkillService {
  constructor(private prisma: PrismaService) {}

  async getSkills() {
    return this.prisma.skill.findMany();
  }

  async getSkillById(id: string) {
    return this.prisma.skill.findUnique({
      where: { id },
    });
  }

  async getCvsForSkill(skillId: string) {
    const cvSkills = await this.prisma.cvSkill.findMany({
      where: { skillId },
      include: { cv: true },
    });
    return cvSkills.map(cvSkill => cvSkill.cv);
  }
}