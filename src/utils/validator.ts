import * as mongoose from 'mongoose';

function isObjectIdValid(toCheck: string) {
  return mongoose.Types.ObjectId.isValid(toCheck);
}

export { isObjectIdValid };
