import {Forum} from '../models/Forum';

/**
 * Returns true if all it's arguments are equivalent forum objects, otherwise false.
 *
 * Since forum objects only contain primitive values in their properties
 * they are considered equal if they are either all the same object, all null,
 * all undefined or all have the same values for their id, name and description
 * properties.
 *
 * @param forums rest parameter containing all the forums to be checked for equality.
 */
export function forumEquals(...forums: Forum[]): boolean {
  if (forums.length < 2) {
    return true;
  }
  const firstForum = forums[0];
  for (const forum of forums.slice(1)) {
    if (firstForum === forum) {
      continue;
    }
    if (firstForum === null || forum === null) {
      return false;
    }
    if (firstForum === undefined || forum === undefined) {
      return false;
    }

    if (firstForum.id !== forum.id ||
      firstForum.name !== forum.name ||
      firstForum.description !== forum.description ||
      firstForum.creator !== forum.creator) {
      return false;
    }
  }
  return true;
}

/**
 * Returns true if two arrays of Forum's are 'functionally equal'.
 *
 * Arrays are considered functionally equal if they are the same length
 * and an element at index i in one is equal to an element at index i
 * in the other according to {@link forumEquals}
 *
 * @param fa1 the first array of forums
 * @param fa2 the second array of forums to check against the first
 */
export function forumArrayEquals(fa1: Forum[], fa2: Forum[]): boolean {
  if (fa1 === fa2) {
    return true;
  }
  if (fa1 === null || fa2 === null) {
    return false;
  }
  if (fa1 === undefined || fa2 === undefined) {
    return false;
  }
  if (fa1.length !== fa2.length) {
    return false;
  }

  for (let i = 0; i < fa1.length; i++) {
    if (!forumEquals(fa1[i], fa2[i])) {
      return false;
    }
  }

  return true;
}
