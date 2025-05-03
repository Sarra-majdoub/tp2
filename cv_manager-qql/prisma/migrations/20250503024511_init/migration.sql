/*
  Warnings:

  - You are about to drop the `Cv` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CvSkill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Cv";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CvSkill";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CV" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "job" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "CV_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CV_Skill" (
    "cvId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    PRIMARY KEY ("cvId", "skillId"),
    CONSTRAINT "CV_Skill_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "CV" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CV_Skill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
