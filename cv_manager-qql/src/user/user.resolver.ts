// src/user/user.resolver.ts
import { Resolver, Query, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './models/user.model';
import { Cv } from '../cv/models/cv.model';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Query(() => User, { nullable: true })
  async user(@Args('id', { type: () => ID }) id: string): Promise<User | null> {
    return this.userService.getUserById(id);
  }

  @ResolveField(() => [Cv])
  async cvs(@Parent() user: User): Promise<Cv[]> {
    return this.userService.getCvsForUser(user.id);
  }
}