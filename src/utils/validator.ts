import { Types } from 'mongoose';

function isObjectIdValid(toCheck: string) {
  return Types.ObjectId.isValid(toCheck);
}

export { isObjectIdValid };
