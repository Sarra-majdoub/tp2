import {
  Resolver,
  Query,
  Args,
  ID,
  ResolveField,
  Parent,
  Mutation,
  Subscription,
  Context as GqlContext,
} from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { Cv } from './models/cv.model';
import { CvService } from './cv.service';
import { User } from '../user/models/user.model';
import { Skill } from '../skill/models/skill.model';
import { DbCv } from '../db';
import { CreateCvInput } from './dto/create-cv.input';
import { UpdateCvInput } from './dto/update-cv.input';
import { CvEvents } from './cv.pubsub';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from './pubsub.provider';
import { Context } from '../context';

@Resolver(() => Cv)
export class CvResolver {
  constructor(
    private cvService: CvService,
    @Inject(PUB_SUB) private pubSub: PubSub,
  ) {}

  @Query(() => [Cv])
  cvs(@GqlContext() context: Context): Cv[] {
    return this.cvService.getCvs(context) as unknown as Cv[];
  }

  @Query(() => Cv, { nullable: true })
  cv(
    @Args('id', { type: () => ID }) id: string,
    @GqlContext() context: Context,
  ): Cv | undefined {
    return this.cvService.getCvById(id, context) as unknown as Cv;
  }

  @ResolveField(() => User)
  user(@Parent() cv: DbCv, @GqlContext() context: Context): User {
    return this.cvService.getUserForCv(cv, context) as unknown as User;
  }

  @ResolveField(() => [Skill])
  skills(@Parent() cv: DbCv, @GqlContext() context: Context): Skill[] {
    return this.cvService.getSkillsForCv(cv, context) as unknown as Skill[];
  }

  @Mutation(() => Cv)
  createCv(
    @Args('createCvInput') createCvInput: CreateCvInput,
    @GqlContext() context: Context,
  ): Cv {
    return this.cvService.createCv(createCvInput, context) as unknown as Cv;
  }

  @Mutation(() => Cv)
  updateCv(
    @Args('updateCvInput') updateCvInput: UpdateCvInput,
    @GqlContext() context: Context,
  ): Cv {
    return this.cvService.updateCv(updateCvInput, context) as unknown as Cv;
  }

  @Mutation(() => Cv)
  deleteCv(
    @Args('id', { type: () => ID }) id: string,
    @GqlContext() context: Context,
  ): Cv {
    return this.cvService.deleteCv(id, context) as unknown as Cv;
  }

  @Subscription(() => Cv, {
    name: CvEvents.CV_ADDED,
  })
  cvCreated() {
    return this.pubSub.asyncIterableIterator(CvEvents.CV_ADDED);
  }

  @Subscription(() => Cv, {
    name: CvEvents.CV_UPDATED,
  })
  cvUpdated() {
    return this.pubSub.asyncIterableIterator(CvEvents.CV_UPDATED);
  }

  @Subscription(() => Cv, {
    name: CvEvents.CV_DELETED,
  })
  cvDeleted() {
    return this.pubSub.asyncIterableIterator(CvEvents.CV_DELETED);
  }
}
