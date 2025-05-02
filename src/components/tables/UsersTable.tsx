import Badge from "../ui/badge/Badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Image from "next/image";

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    picture: string;
    isVip: boolean;
    // createdAt: string;
    // updatedAt: string;
}

const tableData: User[] = [
    {
        id: 1,
        name: "Olivie Knight",
        email: "oknight0@pinterest.com",
        phone: "826-891-9222",
        picture: "https://robohash.org/minimaetest.png?size=50x50&set=set1",
        isVip: false
    },
    {
        id: 2,
        name: "Germain Helsby",
        email: "ghelsby1@moonfruit.com",
        phone: "568-165-1005",
        picture: "https://robohash.org/ipsadoloribusmaiores.png?size=50x50&set=set1",
        isVip: true
    },
    {
        id: 3,
        name: "Katrina Londing",
        email: "klonding2@reuters.com",
        phone: "353-262-5100",
        picture: "https://robohash.org/omnisquibusdamqui.png?size=50x50&set=set1",
        isVip: true
    },
    {
        id: 4,
        name: "Uriah Kenset",
        email: "ukenset3@chronoengine.com",
        phone: "555-132-9366",
        picture: "https://robohash.org/impeditquiaquas.png?size=50x50&set=set1",
        isVip: true
    },
    {
        id: 5,
        name: "Kayley Virr",
        email: "kvirr4@squidoo.com",
        phone: "318-974-8039",
        picture: "https://robohash.org/consequunturnatusdelectus.png?size=50x50&set=set1",
        isVip: false
    },
    {
        id: 6,
        name: "Camilla Oddey",
        email: "coddey5@bloglines.com",
        phone: "379-756-5049",
        picture: "https://robohash.org/cupiditatevoluptasfacilis.png?size=50x50&set=set1",
        isVip: true
    },
    {
        id: 7,
        name: "Marlee Van Velde",
        email: "mvan6@hostgator.com",
        phone: "459-286-4200",
        picture: "https://robohash.org/eosautrecusandae.png?size=50x50&set=set1",
        isVip: true
    },
    {
        id: 8,
        name: "Ofella Blackleech",
        email: "oblackleech7@google.co.jp",
        phone: "458-576-8392",
        picture: "https://robohash.org/sapientedistinctiocorrupti.png?size=50x50&set=set1",
        isVip: false
    },
    {
        id: 9,
        name: "Jamey Shanahan",
        email: "jshanahan8@seattletimes.com",
        phone: "374-805-4141",
        picture: "https://robohash.org/velitomnisquis.png?size=50x50&set=set1",
        isVip: true
    },
    {
        id: 10,
        name: "Vincenz Cersey",
        email: "vcersey9@yelp.com",
        phone: "873-244-3078",
        picture: "https://robohash.org/velporroeaque.png?size=50x50&set=set1",
        isVip: false
    }
];

export default function UsersTable() {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Id
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    User
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Email
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Phone
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Is VIP
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {tableData.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {user.id}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 overflow-hidden rounded-full">
                                                <Image
                                                    width={40}
                                                    height={40}
                                                    src={user.picture}
                                                    alt={user.name}
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
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {user.email}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {user.phone}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Badge
                                            size="sm"
                                            color={
                                                user.isVip ? "success" : "warning"
                                            }
                                        >
                                            {user.isVip ? "VIP" : "Normal"}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}