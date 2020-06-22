import {forumArrayEquals, forumEquals} from './utils';
import {Forum} from '../models/Forum';

describe('forumEquals', () => {

  const testForum = {
    id: 1,
    name: 'a name',
    description: 'a description',
    creator: 'a creator'
  };

  it('should return true if only a single argument is given', () => {
    expect(forumEquals(null)).toBeTrue();
    expect(forumEquals(undefined)).toBeTrue();
    expect(forumEquals(testForum)).toBeTrue();
  });

  it('should find nulls are all equal and undefined are all equal', () => {
    expect(forumEquals(null, null, null)).toBeTrue();
    expect(forumEquals(undefined, undefined, undefined)).toBeTrue();
  });

  it('should find that nulls is equal to nothing else', () => {
    expect(forumEquals(null, undefined)).toBeFalse();
    expect(forumEquals(null, testForum));
  });

  it('should find that undefined is equal to nothing else', () => {
    expect(forumEquals(undefined, null)).toBeFalse();
    expect(forumEquals(undefined, testForum));
  });

  it('should find that two references to the same forum object are equal', () => {
    expect(forumEquals(testForum, testForum)).toBeTrue();
  });

  it('should find that two forums with equal properties are equal', () => {
    const identicalForum = {id: 1, name: 'a name', description: 'a description', creator: 'a creator'};
    expect(forumEquals(testForum, identicalForum)).toBeTrue();
  });

  it('should find that two forums with even 1 non-equal property are not equal', () => {
    // different id
    const almostIdenticalForum = {id: 2, name: 'a name', description: 'a description', creator: 'a creator'};
    expect(forumEquals(testForum, almostIdenticalForum)).toBeFalse();
    // a different name
    almostIdenticalForum.id = 1;
    almostIdenticalForum.name = 'a different name';
    expect(forumEquals(testForum, almostIdenticalForum)).toBeFalse();
    // a different description
    almostIdenticalForum.name = 'a name';
    almostIdenticalForum.description = 'a different description';
    expect(forumEquals(testForum, almostIdenticalForum)).toBeFalse();
    // a different creator
    almostIdenticalForum.description = 'a description';
    almostIdenticalForum.creator = 'someone else';
    expect(forumEquals(testForum, almostIdenticalForum)).toBeFalse();
  });

  it('should find that a single non-equal argument means that the arguments are not equal', () => {
    const identicalArgument = Object.assign({}, testForum);
    const almostIdenticalArgument = Object.assign({}, testForum);
    almostIdenticalArgument.name = almostIdenticalArgument.name + 'x';
    const anotherIdenticalArgument = Object.assign({}, testForum);
    expect(forumEquals(testForum, identicalArgument, anotherIdenticalArgument)).toBeTrue();
    expect(forumEquals(
      testForum,
      identicalArgument,
      almostIdenticalArgument,
      anotherIdenticalArgument
    )).toBeFalse();
  });
});

describe('forumArrayEquals', () => {

  const testForumArray = [
    {
      id: 1,
      name: 'a name',
      description: 'a description',
      creator: 'a creator'
    },
    {
      id: 2,
      name: 'another name',
      description: 'another description',
      creator: 'a creator'
    }
  ];

  const testForumArrayCopy: Forum[] = [
    {
      id: 1,
      name: 'a name',
      description: 'a description',
      creator: 'a creator'
    },
    {
      id: 2,
      name: 'another name',
      description: 'another description',
      creator: 'a creator'
    }
  ];

  it('should find nulls are all equal and undefined are all equal', () => {
    expect(forumArrayEquals(null, null)).toBeTrue();
    expect(forumArrayEquals(undefined, undefined)).toBeTrue();
  });

  it('should find that nulls is equal to nothing else', () => {
    expect(forumArrayEquals(null, undefined)).toBeFalse();
    expect(forumArrayEquals(null, testForumArray));
  });

  it('should find that undefined is equal to nothing else', () => {
    expect(forumArrayEquals(undefined, null)).toBeFalse();
    expect(forumArrayEquals(undefined, testForumArray));
  });

  it('should find that arrays of different lengths are not equal', () => {
    const longerArray = testForumArray.slice();
    longerArray.push({id: 3, name: 'yet another name', description: 'yet another description', creator: 'yet another creator'});
    expect(forumArrayEquals(testForumArray, longerArray)).toBeFalse();
  });

  it('should find that two references to the same array are equal', () => {
    expect(forumArrayEquals(testForumArray, testForumArray)).toBeTrue();
  });

  it('should find that two arrays with equal forums at equal positions are equal', () => {
    expect(forumArrayEquals(testForumArray, testForumArrayCopy)).toBeTrue();
  });

  it('should find that two arrays with equal forums at different positions are not equal', () => {
    const flippedArray = testForumArray.slice().reverse();
    expect(forumArrayEquals(testForumArray, flippedArray)).toBeFalse();
  });
});
