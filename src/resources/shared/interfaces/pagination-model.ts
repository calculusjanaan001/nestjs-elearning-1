import { Model, PaginateResult, PaginateOptions, Document } from 'mongoose';

export interface PaginationModel<T extends Document> extends Model<T> {
  paginate(
    query?: Record<string, any>,
    options?: PaginateOptions,
  ): Promise<PaginateResult<T>>;
}
