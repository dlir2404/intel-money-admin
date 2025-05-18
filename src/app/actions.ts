'use server'

import { User } from "@/types/user";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
const ACCESS_TOKEN_COOKIE = 'access_token';

export async function getUsers(page: number, pageSize: number): Promise<{ count: number; rows: User[] }> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

    const response = await fetch(
        `${API_URL}/admin/user/all?page=${page}&pageSize=${pageSize}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }

    const data = await response.json();

    return {
        count: data.count,
        rows: data.rows,
    };
}

export async function setUserVip(userId: number, vipExpirationDate: Date): Promise<boolean> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

    const response = await fetch(
        `${API_URL}/admin/user/${userId}/vip`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ vipExpirationDate: vipExpirationDate.toISOString() }),
        }
    );

    if (!response.ok) {
        throw new Error('Failed to set user VIP status');
    }

    return true;
}

export async function removeVip(userId: number): Promise<boolean> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

    const response = await fetch(
        `${API_URL}/admin/user/vip/disable`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ userId }),
        }
    );

    if (!response.ok) {
        throw new Error('Failed to remove VIP status');
    }

    return true;
}