import app from './app';
import connectDB from './config/db';
import { env } from './config/env';

const startServer = async () => {
  try {
    await connectDB();
    const port = env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
