import {
  Resolver,
  Query,
  Args,
  ID,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { Cv } from './models/cv.model';
import { CvService } from './cv.service';
import { Context } from '../context';
import { User } from '../user/models/user.model';
import { Skill } from '../skill/models/skill.model';
import { DbCv } from '../db';
import { Inject } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { CreateCvInput } from './dto/create-cv.input';
import { UpdateCvInput } from './dto/update-cv.input';
import { Subscription } from '@nestjs/graphql';
import { CvEvents } from './cv.pubsub';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => Cv)
export class CvResolver {
  // Injecting the CvService and Context into the resolver
  constructor(
    private cvService: CvService,
    @Inject(CONTEXT) private context: Context,
  ) { }

  @Query(() => [Cv])
  cvs(): Cv[] {
    return this.cvService.getCvs(this.context) as unknown as Cv[];
  }

  @Query(() => Cv, { nullable: true })
  cv(@Args('id', { type: () => ID }) id: string): Cv | undefined {
    return this.cvService.getCvById(id, this.context) as unknown as Cv;
  }

  @ResolveField(() => User)
  user(@Parent() cv: DbCv): User {
    return this.cvService.getUserForCv(cv, this.context) as unknown as User;
  }

  @ResolveField(() => [Skill])
  skills(@Parent() cv: DbCv): Skill[] {
    return this.cvService.getSkillsForCv(
      cv,
      this.context,
    ) as unknown as Skill[];
  }

  @Mutation(() => Cv)
  createCv(@Args('createCvInput') createCvInput: CreateCvInput): Cv {
    return this.cvService.createCv(
      createCvInput,
      this.context,
    ) as unknown as Cv;
  }

  @Mutation(() => Cv)
  updateCv(@Args('updateCvInput') updateCvInput: UpdateCvInput): Cv {
    return this.cvService.updateCv(
      updateCvInput,
      this.context,
    ) as unknown as Cv;
  }

  @Mutation(() => Cv)
  deleteCv(@Args('id', { type: () => ID }) id: string): Cv {
    return this.cvService.deleteCv(id, this.context) as unknown as Cv;
  }

  
  @Subscription(() => Cv, {
    name: CvEvents.CV_ADDED,
  })

  cvCreated() {
    return pubSub.asyncIterableIterator(CvEvents.CV_ADDED);
  }
  
  @Subscription(() => Cv, {
    name: CvEvents.CV_UPDATED,
  })
  cvUpdated() {
    return pubSub.asyncIterableIterator(CvEvents.CV_UPDATED);
  }

  @Subscription(() => Cv, {
    name: CvEvents.CV_DELETED,
  })
  cvDeleted() {
    return pubSub.asyncIterableIterator(CvEvents.CV_DELETED);
  }

}


