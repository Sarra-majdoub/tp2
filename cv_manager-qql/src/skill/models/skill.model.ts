import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Cv } from '../../cv/models/cv.model';

@ObjectType()
export class Skill {
  @Field(() => ID)
  id: string;

  @Field()
  designation: string;

  @Field(() => [Cv], { nullable: true })
  cvs?: Cv[];
}