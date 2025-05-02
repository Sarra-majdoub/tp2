import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateCvInput } from './create-cv.input';

@InputType()
export class UpdateCvInput extends PartialType(CreateCvInput) {
  @Field(() => ID)
  id: string;
}