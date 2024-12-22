import connectDB from './utils/db';

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await (await import('mongoose')).connection.close();
});
