export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    picture?: string;
    isVip: boolean;
    vipExpirationDate?: string;
}