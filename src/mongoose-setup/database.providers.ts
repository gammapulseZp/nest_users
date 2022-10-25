import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
     mongoose.connect('mongodb+srv://gammapulse:Nest1234@cluster0.05xox.mongodb.net/nest_users'), //mongo/compass connection string
     // mongoose.connect(`${process.env.DATABASE}`)
    },
];