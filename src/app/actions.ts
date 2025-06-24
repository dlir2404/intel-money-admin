'use server'

import { Config } from "@/types/config";
import { User } from "@/types/user";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
const ACCESS_TOKEN_COOKIE = 'access_token';

export async function getUsers(page: number, pageSize: number, isVip?: boolean, search?: string): Promise<{ count: number; rows: User[] }> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

    let url = `${API_URL}/admin/user/all?page=${page}&pageSize=${pageSize}`
    if (isVip != undefined) {
        url += `&isVip=${isVip}`
    }
    if (search != undefined) {
        url += `&search=${search}`
    }

    const response = await fetch(
        url,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        console.log(accessToken)
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

export async function getConfigs(): Promise<Config> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

    const response = await fetch(
        `${API_URL}/system-config`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch configs');
    }

    const data = await response.json();

    return data;
}

export async function updateConfig(value: Partial<Config>): Promise<boolean> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

    const response = await fetch(
        `${API_URL}/system-config`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ ...value }),
        }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message[0]);
    }

    return true;
}