import { useAuthStore } from '@/entities/auth/api/store';
import { useUserStore } from '@/entities/user/api/userStore';
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomDropdown from "@/shared/ui/custom/CustomDropdown";
import SearchBar from "@/features/webtoon-search/ui/SearchBar";
import { Button } from "@/shared/ui/shadcn/button";
import { Search, User as UserIcon, LogOut, Settings } from "lucide-react";

interface HeaderActionsProps {
    isSearchOpen: boolean;
    setIsSearchOpen: (isOpen: boolean) => void;
}

interface MenuItem {
    id: number;
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    isDanger?: boolean;
}

const HeaderActions = ({ isSearchOpen, setIsSearchOpen }: HeaderActionsProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, initialize, logout, userInfo } = useAuthStore();
    const { fetchCurrentUserInfo, userInfo: currentUser } = useUserStore();
    const [userMenuItems, setUserMenuItems] = useState<MenuItem[]>([]);

    useEffect(() => {
        initialize();
        
        if (isAuthenticated && userInfo?.userId) {
            void fetchCurrentUserInfo();
        }
    }, [initialize, isAuthenticated, userInfo?.userId, fetchCurrentUserInfo]);

    useEffect(() => {
        const nickname = currentUser?.nickname || '사용자';
        const isAdmin = userInfo?.role === 'ADMIN';
        
        const menuItems: MenuItem[] = [
            {
                id: 1,
                label: `${nickname}님`,
                onClick: () => navigate('/mypage')
            },
            {
                id: 2,
                label: "마이페이지",
                onClick: () => navigate('/mypage'),
                icon: <UserIcon size={16} />
            },
            // {
            //     id: 3,
            //     label: "좋아요한 웹툰",
            //     onClick: () => navigate('/mypage/liked'),
            //     icon: <Heart size={16} />
            // },
            // {
            //     id: 4,
            //     label: "내 댓글",
            //     onClick: () => navigate('/mypage/comments'),
            //     icon: <MessageCircle size={16} />
            // },
            // {
            //     id: 5,
            //     label: "설정",
            //     onClick: () => navigate('/mypage/settings'),
            //     icon: <Settings size={16} />
            // },
        ];

        if (isAdmin) {
            menuItems.push({
                id: 5,
                label: "관리자 페이지",
                onClick: () => navigate('/admin'),
                icon: <Settings size={16} />
            });
        }

        menuItems.push({
            id: 6,
            label: "로그아웃",
            onClick: () => {
                logout();
                navigate('/');
            },
            icon: <LogOut size={16} />,
            isDanger: true
        });

        setUserMenuItems(menuItems);
    }, [currentUser, navigate, logout, userInfo]);

    const isMyPage = location.pathname.startsWith('/mypage');

    function BeforeLogin() {
        return (
            <>
                <div className="hidden md:flex items-center transition-opacity duration-300">
                    <ul className="flex items-center">
                        <li className="mr-4">
                            <SearchBar />
                        </li>
                        <li className="text-gray-600 text-sm mr-4 hover:text-gray-900 transition-colors duration-300">
                            <Link to="/login">로그인</Link>
                        </li>
                        <li className="bg-gray-900 hover:bg-gray-700 text-white rounded-md px-4 py-2 text-sm transition-colors duration-300">
                            <Link to="/signup">회원가입</Link>
                        </li>
                    </ul>
                </div>

                <div className="flex md:hidden items-center transition-opacity duration-300">
                    <ul className="flex items-center">
                        <li className="mr-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-600 transition-colors duration-300"
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                            >
                                <Search size={20} />
                            </Button>
                        </li>
                        <li className="text-gray-600 text-sm hover:text-gray-900 transition-colors duration-300">
                            <Link to="/login">로그인</Link>
                        </li>
                    </ul>
                </div>
            </>
        );
    }

    function AfterLogin() {
        return (
            <>
                <div className="hidden md:flex items-center transition-opacity duration-300">
                    <ul className="flex items-center">
                        <li className="mr-4">
                            <SearchBar />
                        </li>
                        <li>
                            <div className="h-9 w-9 flex items-center justify-center">
                                <CustomDropdown
                                    label={<UserIcon size={20} className="text-gray-600" />}
                                    items={userMenuItems.map((item) => ({
                                        label: item.label,
                                        onClick: item.onClick,
                                        icon: item.icon,
                                        isDanger: item.isDanger
                                    }))}
                                />
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="flex md:hidden items-center transition-opacity duration-300">
                    <ul className="flex items-center">
                        <li className="mr-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-600 transition-colors duration-300"
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                            >
                                <Search size={20} />
                            </Button>
                        </li>
                        <li>
                            <div className="h-9 w-9 flex items-center justify-center">
                                <CustomDropdown
                                    label={<UserIcon size={20} className="text-gray-600" />}
                                    items={userMenuItems.map((item) => ({
                                        label: item.label,
                                        onClick: item.onClick,
                                        icon: item.icon,
                                        isDanger: item.isDanger
                                    }))}
                                />
                            </div>
                        </li>
                    </ul>
                </div>
            </>
        );
    }

    function MyPageHeaderActions() {
        const myPageMenuItems = userMenuItems.filter(item =>
            item.id === 1 ||
            item.id === 2 ||
            item.id === 5 ||
            item.id === 6
        );
        
        return (
            <div className="flex items-center transition-opacity duration-300">
                <ul className="flex items-center">
                    <li>
                        <div className="h-9 w-9 flex items-center justify-center">
                            <CustomDropdown
                                label={<UserIcon size={20} className="text-gray-600" />}
                                items={myPageMenuItems.map((item) => ({
                                    label: item.label,
                                    onClick: item.onClick,
                                    icon: item.icon,
                                    isDanger: item.isDanger
                                }))}
                            />
                        </div>
                    </li>
                </ul>
            </div>
        );
    }

    function AdminPageHeaderActions() {
        const adminMenuItems = userMenuItems.filter(item =>
            item.id === 1 ||
            item.id === 2 ||
            item.id === 5 ||
            item.id === 6
        );
        
        return (
            <div className="flex items-center transition-opacity duration-300">
                <ul className="flex items-center">
                    <li>
                        <div className="h-9 w-9 flex items-center justify-center">
                            <CustomDropdown
                                label={<UserIcon size={20} className="text-gray-600" />}
                                items={adminMenuItems.map((item) => ({
                                    label: item.label,
                                    onClick: item.onClick,
                                    icon: item.icon,
                                    isDanger: item.isDanger
                                }))}
                            />
                        </div>
                    </li>
                </ul>
            </div>
        );
    }

    const isAdminPage = location.pathname.startsWith('/admin');

    if (isMyPage && isAuthenticated) {
        return <MyPageHeaderActions />;
    }
    
    if (isAdminPage && isAuthenticated) {
        return <AdminPageHeaderActions />;
    }

    return (
        <>
            {!isAuthenticated ? <BeforeLogin /> : <AfterLogin />}
        </>
    );
}

export default HeaderActions