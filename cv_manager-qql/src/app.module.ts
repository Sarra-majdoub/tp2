import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { createContext } from './context';
import { CvModule } from './cv/cv.module';
import { UserModule } from './user/user.module';
import { SkillModule } from './skill/skill.module';
import { pubSubProvider } from './cv/pubsub.provider';
import { CvResolver } from './cv/cv.resolver';
import { CvService } from './cv/cv.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: createContext,
      playground: true,
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': true, // Using the newer graphql-ws protocol
        'subscriptions-transport-ws': true, // For compatibility with older clients
      },
    }),
    CvModule,
    UserModule,
    SkillModule,
  ],
  providers: [
    pubSubProvider,
    CvResolver,
    CvService,
  ],
})
export class AppModule {}
