import { Resolver, Query, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { Skill } from './models/skill.model';
import { SkillService } from './skill.service';
import { Context } from '../context';
import { Cv } from '../cv/models/cv.model';
import { DbCv } from '../db';
import { Inject, Res } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';

@Resolver(() => Skill) 
export class SkillResolver {
  constructor(
    private skillService: SkillService,
    @Inject(CONTEXT) private context: Context,
  ) {}

  @Query(() => [Skill])
  skills(): Skill[] {
    return this.skillService.getSkills(this.context) as unknown as Skill[];
  }

  @Query(() => Skill, { nullable: true })
  skill(@Args('id', { type: () => ID }) id: string): Skill | undefined {
    return this.skillService.getSkillById(id, this.context) as unknown as Skill;
  }

  @ResolveField(() => [Cv])
  cvs(@Parent() skill: DbCv): Cv[] {
    return this.skillService.getCvsForSkill(skill, this.context) as unknown as Cv[];
  }
}
