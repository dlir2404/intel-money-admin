import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export interface UserType {
    id: string;
    email: string;
    name: string;
    picture: string;
    exp: number;
    iat: number;
}

export interface TokenType {
    accessToken: string;
    refreshToken: string;
}

export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REFRESH_TOKEN_COOKIE = 'refresh_token';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export async function getTokenFromCookie() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value || null;
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value || null;
    return { accessToken, refreshToken };
}

export function isTokenExpired(token: string) {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp ? decoded.exp < currentTime : true;
    } catch {
        return true;
    }
}


// Lấy thông tin người dùng từ token
export function getUserFromToken(token: string): UserType | null {
    try {
      const decoded = jwtDecode(token);
      return decoded as UserType;
    } catch {
      return null;
    }
  }


export function setAuthCookies(response: NextResponse, token: TokenType) {
    response.cookies.set({
        name: ACCESS_TOKEN_COOKIE,
        value: token.accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
    })

    response.cookies.set({
        name: REFRESH_TOKEN_COOKIE,
        value: token.refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return response;
}


export function clearAuthCookies(response: NextResponse) {
    response.cookies.set({
        name: ACCESS_TOKEN_COOKIE,
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0
      });
      
      response.cookies.set({
        name: REFRESH_TOKEN_COOKIE,
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0
      });
      
      return response;
}