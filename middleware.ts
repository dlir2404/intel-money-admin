import { NextResponse, NextRequest } from 'next/server';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, isTokenExpired } from './src/lib/auth';

// URL API của backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function middleware(request: NextRequest) {
    console.log("vao dayyy")
    const pathname = request.nextUrl.pathname;

    const protectedRoutes = ['/dashboard', '/profile', '/settings'];

    const authRoutes = ['/signin', '/register', '/forgot-password', '/reset-password'];

    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value || null;
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value || null;

    if (!accessToken && !refreshToken && isProtectedRoute) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    // Nếu có token và đang ở trang auth thì chuyển hướng tới dashboard
    if ((accessToken || refreshToken) && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Nếu accessToken hết hạn và có refreshToken thì tự động làm mới token
    if (accessToken && isTokenExpired(accessToken) && refreshToken && isProtectedRoute) {
        try {
            const response = await fetch(`${API_URL}/auth/refresh-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            })

            if (response.ok) {
                const data = await response.json();

                // Tạo response mới
                const newResponse = NextResponse.next();

                // Cập nhật cookies
                newResponse.cookies.set({
                    name: ACCESS_TOKEN_COOKIE,
                    value: data.accessToken,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 60 * 15 // 15 phút
                });

                if (data.refreshToken) {
                    newResponse.cookies.set({
                        name: REFRESH_TOKEN_COOKIE,
                        value: data.refreshToken,
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        path: '/',
                        maxAge: 60 * 60 * 24 * 7 // 7 ngày
                    });
                }

                return newResponse;
            }

            // Nếu refresh token không thành công thì xóa tất cả tokens và chuyển hướng tới login
            const logoutResponse = NextResponse.redirect(new URL('/login', request.url));
            logoutResponse.cookies.set(ACCESS_TOKEN_COOKIE, '', { maxAge: 0 });
            logoutResponse.cookies.set(REFRESH_TOKEN_COOKIE, '', { maxAge: 0 });
        } catch (error) {
            console.error('Token refresh error:', error);
            // Xảy ra lỗi khi refresh token, chuyển hướng tới login
            const errorResponse = NextResponse.redirect(new URL('/login', request.url));
            errorResponse.cookies.set(ACCESS_TOKEN_COOKIE, '', { maxAge: 0 });
            errorResponse.cookies.set(REFRESH_TOKEN_COOKIE, '', { maxAge: 0 });

            return errorResponse;
        }
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        // Match tất cả trừ các path quan trọng cần bỏ qua
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};