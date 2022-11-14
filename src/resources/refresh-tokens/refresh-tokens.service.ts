import { Inject, Injectable } from "@nestjs/common";
import { UpdateRefreshTokenDto } from "./dto/update-refresh-token.dto";
import { Model } from "mongoose";
import { RefreshToken } from "../../interfaces_mongoose";
import { catchError } from "../../utils/all-exseptions-custom-filter";

@Injectable()
export class RefreshTokensService {
  constructor (
    @Inject('REFRESH_TOKEN_MODEL')
    private refreshTokenModel: Model<RefreshToken>
  ){}

  async findTokenDocument(reqToken: string) {
    return await this.refreshTokenModel.findOne({ token: reqToken}).exec()
  }
  findAll() {
    return `This action returns all refreshTokens`;
  }

  findOne(id: number) {
    return `This action returns a #${id} refreshToken`;
  }

  async update(id: string, updateRefreshTokenDto: UpdateRefreshTokenDto) {
    try {
      await this.refreshTokenModel
        .findByIdAndUpdate(id, updateRefreshTokenDto)
        .exec();
    } catch (err) {
      catchError(err, 'refresh token');
    }

  }

  remove(id: string) {
    return `This action removes a #${id} refreshToken`;
  }
}
