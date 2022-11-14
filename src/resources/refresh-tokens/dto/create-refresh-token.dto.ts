export class CreateRefreshTokenDto  {
  readonly user: string;
  readonly token: string;
  readonly revoked: number;
  readonly revokedByIp: string;
}
