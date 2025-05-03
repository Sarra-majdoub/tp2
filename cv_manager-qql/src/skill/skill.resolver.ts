// src/skill/skill.resolver.ts
import { Resolver, Query, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { SkillService } from './skill.service';
import { Skill } from './models/skill.model';
import { Cv } from '../cv/models/cv.model';

@Resolver(() => Skill)
export class SkillResolver {
  constructor(private skillService: SkillService) {}

  @Query(() => [Skill])
  async skills(): Promise<Skill[]> {
    return this.skillService.getSkills();
  }

  @Query(() => Skill, { nullable: true })
  async skill(@Args('id', { type: () => ID }) id: string): Promise<Skill | null> {
    return this.skillService.getSkillById(id);
  }

  @ResolveField(() => [Cv])
  async cvs(@Parent() skill: Skill): Promise<Cv[]> {
    return this.skillService.getCvsForSkill(skill.id);
  }
}