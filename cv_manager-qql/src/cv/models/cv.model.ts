import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/models/user.model';
import { Skill } from '../../skill/models/skill.model';

@ObjectType()
export class Cv {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  age: number;

  @Field()
  job: string;

  @Field(() => User)
  user?: User;
  @Field(() => [Skill])
  skills?: Skill[];

  userId?: string;
}