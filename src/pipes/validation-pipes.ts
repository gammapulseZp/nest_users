import { IsMongoId} from 'class-validator';

export class ParamsId {
  @IsMongoId()
  id: string;
}

