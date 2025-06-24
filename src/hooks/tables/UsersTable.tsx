'use client';
import Image from "next/image";
import { useGetUsers } from "../users";
import { Space, TableProps, Tag, Table, Input, Select } from "antd";
import { User } from "@/types/user";
import { useMemo, useState } from "react";
import { SetVipModal } from "@/components/modals/setvip.modal";
import { RemoveVipModal } from "@/components/modals/removevip.modal";
import { SearchOutlined } from "@ant-design/icons"
import { debounce } from 'lodash';

export default function UsersTable() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [setVipOpen, setSetVipOpen] = useState(false);
    const [removeVipOpen, setRemoveVipOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [vip, setVip] = useState<boolean | undefined>();
    const [search, setSearch] = useState<string | undefined>();

    const { data, isLoading, refetch } = useGetUsers({
        page: page,
        pageSize: pageSize,
        isVip: vip,
        search: search
    });

    const columns: TableProps<User>['columns'] = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            render: (text: number) => <a>{text}</a>,
        },
        {
            title: 'User',
            dataIndex: 'name',
            key: 'user',
            render: (val: string, user: User) => (<div className="flex items-center gap-3">
                <div className="w-10 h-10 overflow-hidden rounded-full">
                    <Image
                        width={40}
                        height={40}
                        src={user.picture || "https://www.gravatar.com/avatar/?d=mp"}
                        alt={val}
                    />
                </div>
                <div>
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {user.name}
                    </span>
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        Normal User
                    </span>
                </div>
            </div>)
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        // {
        //     title: 'IsVip',
        //     key: 'vip',
        //     dataIndex: 'isVip',
        //     render: (value: boolean) => (<Tag color={value ? "green" : "volcano"}>
        //         {value ? "VIP" : "Normal"}
        //     </Tag>),
        // },
        {
            title: 'Action',
            key: 'action',
            render: (record: User) => (
                // <Space size="middle">
                //     <a onClick={() => {
                //         setSetVipOpen(true);
                //         setUser(record);
                //     }}>Set VIP</a>
                //     <a className="text-red-700" onClick={() => {
                //         setRemoveVipOpen(true);
                //         setUser(record);
                //     }}>Remove VIP</a>
                // </Space>
                <></>
            ),
        },
    ];

    const debouncedSearch = useMemo(() =>
        debounce((value: string) => {
            setSearch(value)
        }, 500),
        [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value)
    }

    return (
        <>
            <div className="mb-4 flex gap-4">
                <div className="min-w-[600px]">
                    <Input size="large" placeholder="Type to search ..." prefix={<SearchOutlined />} onChange={handleChange} />
                </div>
                {/* <div>
                    <Select
                        size="large"
                        placeholder="Vip status"
                        onChange={(value) => setVip(value)}
                        style={{ width: 200 }}
                        allowClear
                        options={[
                            {
                                label: "VIP",
                                value: true,
                            },
                            {
                                label: "Normal",
                                value: false
                            }
                        ]}
                    />
                </div> */}
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        <Table
                            rowKey='id'
                            loading={isLoading}
                            columns={columns}
                            dataSource={data?.rows || []}
                            pagination={{
                                total: data?.count,
                                pageSize: pageSize,
                                current: page,
                                showSizeChanger: true,
                                showTotal: (total) => `Total ${total} users`,
                            }}
                            onChange={(pagination) => {
                                setPage(pagination.current || 1);
                                setPageSize(pagination.pageSize || 10);
                            }}
                        />
                    </div>
                </div>
                {(setVipOpen && user) && <SetVipModal isOpen={true} user={user} closeModal={() => setSetVipOpen(false)} onSuccess={() => {
                    refetch();
                }} />}
                {(removeVipOpen && user) && <RemoveVipModal isOpen={true} user={user} closeModal={() => setRemoveVipOpen(false)} onSuccess={() => {
                    refetch();
                }} />}
            </div>
        </>
    );
}