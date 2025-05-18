import { useQuery } from "@tanstack/react-query"
import { getUsers } from "@/app/actions"
import { notification } from "antd";

export const useGetUsers = ({
    page = 1,
    pageSize = 10
}) => {
    return useQuery({
        queryKey: ['users', page, pageSize],
        queryFn: async () => {
            try {
                return await getUsers(page, pageSize);
            } catch (error) {
                console.error("Error fetching users:", error);
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