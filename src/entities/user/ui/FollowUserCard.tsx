import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/shared/ui/shadcn/card";
import { FollowUser } from "../model/types";

interface FollowUserCardProps {
  user: FollowUser;
}

export const FollowUserCard: React.FC<FollowUserCardProps> = ({ user }) => {
  return (
    <Link to={`/user/${user.indexId}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <img
              src="/images/profile-placeholder.jpg"
              alt={user.nickname}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium">{user.nickname}</h3>
              <p className="text-sm text-gray-500">{user.userEmail}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}; 