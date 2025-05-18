import { useQuery } from "@tanstack/react-query"
import { getUsers } from "@/app/actions"
import { notification } from "antd";

export const useGetUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            try {
                return await getUsers(1, 10);
            } catch (error) {
                notification.error({
                    placement: "topRight",
                    message: "Lỗi khi tải danh sách người dùng",
                });
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: true,
        retry: 2
    })
}