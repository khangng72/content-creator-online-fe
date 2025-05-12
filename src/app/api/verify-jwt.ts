import { jwtVerify } from 'jose';

export const verifyToken = async (request: Request) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.includes('Bearer')) {
    return false;
  }

  const token = authHeader.split(' ')[1];
  try {
    const secretKey = new Uint8Array(
      Buffer.from(process.env.JWT_SECRET || '', 'base64')
    );
    const { payload } = await jwtVerify(token, secretKey);
    console.log('Token is valid:', payload);
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }

  return true;
};
