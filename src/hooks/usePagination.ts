import { useQuery } from "@tanstack/react-query"
import { notification } from "antd";

export interface PaginationParams {
    endpoint: string;
    page: number;
    pageSize: number;
    queryKey: string;
    params: object;
}

export const usePagination = ({endpoint, page, pageSize, queryKey, params }: PaginationParams) => {
    return useQuery({
        queryKey: [queryKey, page, pageSize, params],
        queryFn: async () => {
            let url = `${endpoint}?page=${page}&pageSize=${pageSize}`;
            if (params) {
                url += `&${new URLSearchParams(params as any).toString()}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                notification.error({
                    message: 'Lỗi',
                    description: 'Có lỗi xảy ra khi tải dữ liệu',
                    placement: 'topRight',
                });
            }

            const data = await response.json();
            return {
                data: data.data,
                total: data.total,
            };
        },
    })
}