// /* eslint-disable @typescript-eslint/no-unsafe-call */
// // import type { Response } from 'express';
// import type { Response } from 'express';

// export const setRefreshCookie = async (res: Response, refreshToken: string) => {
//   const isProd = process.env.NODE_ENV === 'production';
//   const maxAge = this.parseExpiryToMs(
//     process.env.JWT_REFRESH_EXPIRES_IN || '7d',
//   );

//   res.cookie('refresh_token', refreshToken, {
//     httpOnly: true,
//     secure: isProd,
//     sameSite: 'strict',
//     path: '/',
//     maxAge,
//   });
// };
