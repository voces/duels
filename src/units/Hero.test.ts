import { experienceToLevel, levelToExperience } from "./Hero";

describe("levelToExperience", () => {
  it("level 1", () => expect(levelToExperience(1)).toEqual(0));
  it("level 2", () => expect(levelToExperience(2)).toEqual(100));
  it("level 3", () => expect(levelToExperience(3)).toEqual(300));
  it("level 4", () => expect(levelToExperience(4)).toEqual(600));
  it("level 5", () => expect(levelToExperience(5)).toEqual(1000));
});

describe("experienceToLevel", () => {
  it("0 expierence", () => expect(experienceToLevel(0)).toEqual(1));
  it("1 expierence", () => expect(experienceToLevel(1)).toEqual(1));
  it("99 expierence", () => expect(experienceToLevel(99)).toEqual(1));
  it("100 expierence", () => expect(experienceToLevel(100)).toEqual(2));
  it("101 expierence", () => expect(experienceToLevel(101)).toEqual(2));
  it("299 expierence", () => expect(experienceToLevel(299)).toEqual(2));
  it("300 expierence", () => expect(experienceToLevel(300)).toEqual(3));
  it("599 expierence", () => expect(experienceToLevel(599)).toEqual(3));
  it("600 expierence", () => expect(experienceToLevel(600)).toEqual(4));
  it("999 expierence", () => expect(experienceToLevel(999)).toEqual(4));
  it("1000 expierence", () => expect(experienceToLevel(1000)).toEqual(5));
});
