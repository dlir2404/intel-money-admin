import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookies, clearAuthCookies } from '@/lib/auth';

// URL API của backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
const ACCESS_TOKEN_COOKIE = 'access_token';
// const REFRESH_TOKEN_COOKIE = 'refresh_token';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const resolvedParams = await params;
        const path = resolvedParams.path.join('/');
        const body = await request.json();

        // Nếu là API sign out và thành công, xóa cookies
        if (path === 'signout') {
            const logoutResponse = NextResponse.json({}, { status: 200 });
            return clearAuthCookies(logoutResponse);
        }

        const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

        // Gọi API đến backend
        const response = await fetch(`${API_URL}/${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        // Tạo NextResponse với status code tương ứng
        const nextResponse = NextResponse.json(
            data,
            { status: response.status }
        );

        // Nếu là API sign in và thành công, lưu tokens vào cookies
        if (path === 'auth/admin/login' && response.ok && data.accessToken && data.refreshToken) {
            return setAuthCookies(nextResponse, {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken
            });
        }

        return nextResponse;
    } catch (error) {
        const resolvedParams = await params;
        console.error(`API proxy error (${resolvedParams.path.join('/')}):`, error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const resolvedParams = await params;
        const path = resolvedParams.path.join('/');

        // Lấy access token từ cookie
        const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

        // Gọi API đến backend với access token
        const response = await fetch(`${API_URL}/${path}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
            },
        });

        const data = await response.json();

        return NextResponse.json(
            data,
            { status: response.status }
        );
    } catch (error) {
        const resolvedParams = await params;
        console.error(`API proxy error (${resolvedParams.path.join('/')}):`, error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}