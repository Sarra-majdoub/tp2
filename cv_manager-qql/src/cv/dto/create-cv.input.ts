import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCvInput {
    
  @Field()
  name: string;

  @Field()
  age: number;

  @Field()
  job: string;

  @Field(() => ID)
  userId: string;

  @Field(() => [ID])
    skillIds: string[];
    
}