import useAuthStore from "@/entities/auth/model/authStore.ts";
import { Link, useNavigate } from "react-router-dom";
import CustomDropdown from "@/shared/ui/custom/CustomDropdown.tsx";
import { Notification } from "@/entities/notification/model/types.ts";
import { User } from "@/entities/user/model/types.ts";
import SearchBar from "@/features/search/ui/SearchBar.tsx";
import { Button } from "@/shared/ui/shadcn/button.tsx";
import { Search } from "lucide-react";

interface HeaderActionsProps {
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
}

const HeaderActions = ({
  isSearchOpen,
  setIsSearchOpen,
}: HeaderActionsProps) => {
  const navigate = useNavigate();
  const currentState = useAuthStore.getState();

  // 알림 데이터
  const publicNotifications: Notification[] = [
    { id: 1, label: "로그인 후 회원님을 위한 맞춤 추천 웹툰을 확인하세요." },
  ];

  const notifications: Notification[] = [
    { id: 1, label: "사론님이 팔로우했습니다." },
    { id: 2, label: "대균님이 팔로우했습니다." },
    { id: 3, label: "소원님이 팔로우했습니다." },
  ];

  const users: User[] = [
    {
      id: 1,
      label: "닉네임님",
      onClick: () => navigate("/mypage"),
    },
    {
      id: 2,
      label: "마이페이지",
      onClick: () => navigate("/mypage"),
    },
    {
      id: 3,
      label: "로그아웃",
      onClick: () => {
        localStorage.removeItem("token");
        useAuthStore.setState({ isAuthenticated: false });
        console.log("로그아웃 처리 완료");
        navigate("/");
      },
    },
  ];

  function BeforeLogin() {
    return (
      <>
        <div className="hidden md:flex items-center transition-opacity duration-300">
          <ul className="flex items-center">
            <li className="mr-2">
              <SearchBar />
            </li>
            <li className="mr-2">
              <CustomDropdown
                label="알림"
                items={publicNotifications.map((notification) => ({
                  label: notification.label,
                  onClick: () => console.log("알림 클릭됨", notification.id),
                }))}
              />
            </li>
            <li className="text-gray-600 text-sm mr-4 hover:text-gray-900 transition-colors duration-300">
              <Link to="/login">로그인</Link>
            </li>
            <li className="bg-gray-900 hover:bg-gray-700 text-white rounded-md px-4 py-2 text-sm transition-colors duration-300">
              <Link to="/signup">회원가입</Link>
            </li>
          </ul>
        </div>

        {/*모바일*/}
        <div className="flex md:hidden items-center transition-opacity duration-300">
          <ul className="flex items-center">
            <li>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 transition-colors duration-300"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search />
              </Button>
            </li>
            <li>
              <CustomDropdown
                label="알림"
                items={publicNotifications.map((notification) => ({
                  label: notification.label,
                  onClick: () => console.log("알림 클릭됨", notification.id),
                }))}
              />
            </li>
            <li className="text-gray-600 text-sm mr-4 hover:text-gray-900 transition-colors duration-300">
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
              <CustomDropdown
                label="알림"
                items={notifications.map((notification) => ({
                  label: notification.label,
                  onClick: () => console.log("알림 클릭됨", notification.id),
                }))}
              />
            </li>
            <li>
              <CustomDropdown
                label="유저"
                items={users.map((item) => ({
                  label: item.label,
                  onClick: item.onClick,
                }))}
              />
            </li>
          </ul>
        </div>

        {/*모바일*/}
        <div className="flex md:hidden items-center transition-opacity duration-300">
          <ul className="flex items-center">
            <li>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 transition-colors duration-300"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search />
              </Button>
            </li>
            <li>
              <CustomDropdown
                label="알림"
                items={notifications.map((notification) => ({
                  label: notification.label,
                  onClick: () => console.log("알림 클릭됨", notification.id),
                }))}
              />
            </li>
            <li>
              <CustomDropdown
                label="유저"
                items={users.map((item) => ({
                  label: item.label,
                  onClick: item.onClick,
                }))}
              />
            </li>
          </ul>
        </div>
      </>
    );
  }

  return (
    <>{!currentState.isAuthenticated ? <BeforeLogin /> : <AfterLogin />}</>
  );
};

export default HeaderActions;
