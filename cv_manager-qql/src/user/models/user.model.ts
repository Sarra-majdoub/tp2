import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Cv } from '../../cv/models/cv.model';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  role: string;

  @Field(() => [Cv], { nullable: true })
  cvs?: Cv[];
}