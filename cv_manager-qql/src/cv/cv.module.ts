import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvResolver } from './cv.resolver';
import { pubSubProvider } from './pubsub.provider'; 

@Module({
  providers: [CvService, CvResolver, pubSubProvider],
  exports: [CvService],
})
export class CvModule {}