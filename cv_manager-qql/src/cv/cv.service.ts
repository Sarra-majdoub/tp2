// src/cv/cv.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCvInput } from './dto/create-cv.input';
import { UpdateCvInput } from './dto/update-cv.input';
import { pubSub, CvEvents } from './cv.pubsub';

@Injectable()
export class CvService {
  constructor(private prisma: PrismaService) {}

  async getCvs() {
    return this.prisma.cv.findMany();
  }

  async getCvById(id: string) {
    return this.prisma.cv.findUnique({
      where: { id },
    });
  }

  async getUserForCv(cvId: string) {
    const cv = await this.prisma.cv.findUnique({
      where: { id: cvId },
      include: { user: true },
    });
    return cv?.user;
  }

  async getSkillsForCv(cvId: string) {
    const cvSkills = await this.prisma.cvSkill.findMany({
      where: { cvId },
      include: { skill: true },
    });
    return cvSkills.map(cvSkill => cvSkill.skill);
  }

  async createCv(createCvInput: CreateCvInput) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: createCvInput.userId },
    });
    
    if (!user) {
      throw new Error(`User with ID ${createCvInput.userId} not found`);
    }

    // Verify all skills exist
    const skills = await this.prisma.skill.findMany({
      where: {
        id: { in: createCvInput.skillIds },
      },
    });

    if (skills.length !== createCvInput.skillIds.length) {
      throw new Error('One or more skills do not exist');
    }

    // Create the CV using a transaction
    const newCv = await this.prisma.$transaction(async (prisma) => {
      // Create the CV
      const cv = await prisma.cv.create({
        data: {
          name: createCvInput.name,
          age: createCvInput.age,
          job: createCvInput.job,
          userId: createCvInput.userId,
        },
      });
      

      // Create the CV-Skill relationships
      for (const skillId of createCvInput.skillIds) {
        await prisma.cvSkill.create({
          data: {
            cvId: cv.id,
            skillId,
          },
        });
      }

      return cv;
    });

    // Publish the event for subscriptions
    pubSub.publish(CvEvents.CV_ADDED, { cvAdded: newCv });
    
    return newCv;
  }

  async updateCv(updateCvInput: UpdateCvInput) {
    // Verify CV exists
    const cv = await this.prisma.cv.findUnique({
      where: { id: updateCvInput.id },
    });

    if (!cv) {
      throw new Error(`CV with ID ${updateCvInput.id} not found`);
    }

    // Verify user if provided
    if (updateCvInput.userId) {
      const userExists = await this.prisma.user.findUnique({
        where: { id: updateCvInput.userId },
      });
      
      if (!userExists) {
        throw new Error(`User with ID ${updateCvInput.userId} not found`);
      }
    }

    // Update the CV using a transaction
    const updatedCv = await this.prisma.$transaction(async (prisma) => {
      // Update the CV
      const updatedCv = await prisma.cv.update({
        where: { id: updateCvInput.id },
        data: {
          name: updateCvInput.name !== undefined ? updateCvInput.name : undefined,
          age: updateCvInput.age !== undefined ? updateCvInput.age : undefined,
          job: updateCvInput.job !== undefined ? updateCvInput.job : undefined,
          userId: updateCvInput.userId !== undefined ? updateCvInput.userId : undefined,
        },
      });

      // Update skills if provided
      if (updateCvInput.skillIds) {
        // Verify all skills exist
        const skills = await prisma.skill.findMany({
          where: {
            id: { in: updateCvInput.skillIds },
          },
        });

        if (skills.length !== updateCvInput.skillIds.length) {
          throw new Error('One or more skills do not exist');
        }

        // Delete existing CV-Skill relationships
        await prisma.cvSkill.deleteMany({
          where: { cvId: updateCvInput.id },
        });

        // Create new CV-Skill relationships
        for (const skillId of updateCvInput.skillIds) {
          await prisma.cvSkill.create({
            data: {
              cvId: updateCvInput.id,
              skillId,
            },
          });
        }
      }

      return updatedCv;
    });

    // Publish the event for subscriptions
    pubSub.publish(CvEvents.CV_UPDATED, { cvUpdated: updatedCv });
    
    return updatedCv;
  }

  async deleteCv(id: string) {
    // Verify CV exists
    const cv = await this.prisma.cv.findUnique({
      where: { id },
    });

    if (!cv) {
      throw new Error(`CV with ID ${id} not found`);
    }

    // Delete the CV using a transaction
    const deletedCv = await this.prisma.$transaction(async (prisma) => {
      // Delete CV-Skill relationships
      await prisma.cvSkill.deleteMany({
        where: { cvId: id },
      });

      // Delete the CV
      return await prisma.cv.delete({
        where: { id },
      });
    });

    // Publish the event for subscriptions
    pubSub.publish(CvEvents.CV_DELETED, { cvDeleted: deletedCv });
    
    return deletedCv;
  }
}