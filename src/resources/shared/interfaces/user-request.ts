import { Request } from 'express';

import { User } from '../../+users/model/user.model';

export interface UserRequest extends Request {
  user: User;
}
