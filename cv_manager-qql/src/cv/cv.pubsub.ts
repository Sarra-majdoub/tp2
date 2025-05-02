import { PubSub } from "graphql-subscriptions";

export const pubSub = new PubSub();

export enum CvEvents {

    CV_ADDED = "cvAdded",
    CV_UPDATED = "cvUpdated",
    CV_DELETED = "cvDeleted",
}