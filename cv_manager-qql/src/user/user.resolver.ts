import { Resolver, Query, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { User } from './models/user.model';
import { UserService } from './user.service';
import { Context } from '../context';
import { Cv } from '../cv/models/cv.model';
import { DbCv } from '../db';
import { Inject, Res } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';


@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    @Inject(CONTEXT) private context: Context,
  ) {}

  @Query(() => [User])
  users(): User[] {
    return this.userService.getUsers(this.context) as unknown as User[];
  }

  @Query(() => User, { nullable: true })
  user(@Args('id', { type: () => ID }) id: string): User | undefined {
    return this.userService.getUserById(id, this.context) as unknown as User;
  }

  @ResolveField(() => [Cv])
  cvs(@Parent() user: DbCv): Cv[] {
    return this.userService.getCvsForUser(user, this.context) as unknown as Cv[];
  }
}
