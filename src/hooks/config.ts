import { getConfigs } from "@/app/actions";
import { useQuery } from "@tanstack/react-query";
import { notification } from "antd";

export const useGetConfigs = () => {
    return useQuery({
        queryKey: ['configs'],
        queryFn: async () => {
            try {
                return await getConfigs();
            } catch (error) {
                console.error("Error fetching configs:", error);
                notification.error({
                    placement: "topRight",
                    message: "Lỗi khi tải danh sách cấu hình",
                });
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: true,
        retry: 2
    })
}