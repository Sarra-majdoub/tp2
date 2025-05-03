import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent, Subscription } from '@nestjs/graphql';
import { CvService } from './cv.service';
import { Cv } from './models/cv.model';
import { User } from '../user/models/user.model';
import { Skill } from '../skill/models/skill.model';
import { CreateCvInput } from './dto/create-cv.input';
import { UpdateCvInput } from './dto/update-cv.input';
import { pubSub, CvEvents } from './cv.pubsub';

@Resolver(() => Cv)
export class CvResolver {
  constructor(private cvService: CvService) {}

  @Query(() => [Cv])
  async cvs(): Promise<Cv[]> {
    return this.cvService.getCvs() as unknown as Cv[];
  }

  @Query(() => Cv, { nullable: true })
  async cv(@Args('id', { type: () => ID }) id: string): Promise<Cv | null> {
    return this.cvService.getCvById(id);
  }

  @ResolveField(() => User)
  async user(@Parent() cv: Cv): Promise<User> {
    const user = await this.cvService.getUserForCv(cv.id);
    if (!user) {
      throw new Error(`User not found for CV with ID ${cv.id}`);
    }
    return user;
  }

  @ResolveField(() => [Skill])
  async skills(@Parent() cv: Cv): Promise<Skill[]> {
    return this.cvService.getSkillsForCv(cv.id);
  }

  @Mutation(() => Cv)
  async createCv(@Args('createCvInput') createCvInput: CreateCvInput): Promise<Cv> {
    return this.cvService.createCv(createCvInput);
  }

  @Mutation(() => Cv)
  async updateCv(@Args('updateCvInput') updateCvInput: UpdateCvInput): Promise<Cv> {
    return this.cvService.updateCv(updateCvInput);
  }

  @Mutation(() => Cv)
  async deleteCv(@Args('id', { type: () => ID }) id: string): Promise<Cv> {
    return this.cvService.deleteCv(id);
  }

  @Subscription(() => Cv, {
    name: CvEvents.CV_ADDED
  })
  cvAdded() {
    return pubSub.asyncIterator(CvEvents.CV_ADDED);
  }

  @Subscription(() => Cv, {
    name: CvEvents.CV_UPDATED
  })
  cvUpdated() {
    return pubSub.asyncIterator(CvEvents.CV_UPDATED);
  }

  @Subscription(() => Cv, {
    name: CvEvents.CV_DELETED
  })
  cvDeleted() {
    return pubSub.asyncIterator(CvEvents.CV_DELETED);
  }
}