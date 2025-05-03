import { NextResponse, NextRequest } from 'next/server';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, clearAuthCookies, isTokenExpired, setAuthCookies } from './lib/auth';

// URL API của backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const publicRoutes = ['/signin', '/register', '/forgot-password', '/reset-password'];

    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

    const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value || null;
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value || null;

    if (!accessToken && !refreshToken && !isPublicRoute) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }


    // Nếu accessToken hết hạn và có refreshToken thì tự động làm mới token
    if (accessToken && isTokenExpired(accessToken) && refreshToken && !isPublicRoute) {
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
                let newResponse = NextResponse.next();

                // Cập nhật cookies
                newResponse = setAuthCookies(newResponse, data);

                return newResponse;
            }

            // Nếu refresh token không thành công thì xóa tất cả tokens và chuyển hướng tới login
            let logoutResponse = NextResponse.redirect(new URL('/login', request.url));
            logoutResponse = clearAuthCookies(logoutResponse);

            return logoutResponse;
        } catch (error) {
            console.error('Token refresh error:', error);
            // Xảy ra lỗi khi refresh token, chuyển hướng tới login
            let errorResponse = NextResponse.redirect(new URL('/login', request.url));
            errorResponse = clearAuthCookies(errorResponse);

            return errorResponse;
        }
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        // Match tất cả trừ các path quan trọng cần bỏ qua
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    ],
};