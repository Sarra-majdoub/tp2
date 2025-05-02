import { Injectable } from '@nestjs/common';
import { Context } from '../context';
import { DbCv } from '../db';
import { CreateCvInput } from './dto/create-cv.input';
import { UpdateCvInput } from './dto/update-cv.input';
import { pubSub, CvEvents } from './cv.pubsub';

@Injectable()
export class CvService {
  getCvs(context: Context) {
    return context.db.cvs;
  }

  getCvById(id: string, context: Context) {
    return context.db.cvs.find((cv) => cv.id === id);
  }

  getUserForCv(cv: DbCv, context: Context) {
    return context.db.users.find((user) => user.id === cv.userId);
  }

  getSkillsForCv(cv: DbCv, context: Context) {
    return context.db.skills.filter((skill) => cv.skillIds.includes(skill.id));
  }

  createCv(createCvInput: CreateCvInput, context: Context) {
    const userExists = context.db.users.some(
      (user) => user.id === createCvInput.userId,
    );
    if (!userExists) {
      throw new Error(`User with ID ${createCvInput.userId} does not exist`);
    }

    const skillIdsExist = createCvInput.skillIds.every((skillId) =>
      context.db.skills.some((skill) => skill.id === skillId),
    );

    if (!skillIdsExist) {
      throw new Error(`One or more skills do not exist`);
    }

    const newCv = {
      id: String(context.db.cvs.length + 1),
      ...createCvInput,
    };
    context.db.cvs.push(newCv);

    // Publish the CV creation event
    pubSub.publish(CvEvents.CV_ADDED, { cvCreated: newCv });
    return newCv;
  }

  updateCv(updateCvInput: UpdateCvInput, context: Context) {
    const cvIndex = context.db.cvs.findIndex(
      (cv) => cv.id === updateCvInput.id,
    );

    if (cvIndex === -1) {
      throw new Error(`CV with ID ${updateCvInput.id} does not exist`);
    }

    if (updateCvInput.userId) {
      const userExists = context.db.users.some(
        (user) => user.id === updateCvInput.userId,
      );
      if (!userExists) {
        throw new Error(`User with ID ${updateCvInput.userId} not found`);
      }
    }

    if (updateCvInput.skillIds) {
      const allSkillsExist = updateCvInput.skillIds.every((skillId) =>
        context.db.skills.some((skill) => skill.id === skillId),
      );
      if (!allSkillsExist) {
        throw new Error('One or more skills do not exist');
      }
    }

    const updatedCv = {
      ...context.db.cvs[cvIndex],
      ...updateCvInput,
    };
    context.db.cvs[cvIndex] = updatedCv;

    // Publish the CV update event
    pubSub.publish(CvEvents.CV_UPDATED, { cvUpdated: updatedCv });
    return updatedCv;
  }

  deleteCv(id: string, context: Context) {
    const cvIndex = context.db.cvs.findIndex((cv) => cv.id === id);
    if (cvIndex === -1) {
      throw new Error(`CV with ID ${id} not found`);
    }

    const deletedCv = context.db.cvs[cvIndex];
    context.db.cvs.splice(cvIndex, 1);

    // Publish the CV deletion event
    pubSub.publish(CvEvents.CV_DELETED, { cvDeleted: deletedCv });
    return deletedCv;
  }
}
