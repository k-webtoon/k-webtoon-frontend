import { FC, useState } from 'react';
import { Card, CardContent } from "@/shared/ui/shadcn/card";
import { Button } from "@/shared/ui/shadcn/button";

const TagManagement: FC = () => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    // 태그 추가 로직
    setNewTag('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">태그 관리</h1>
      
      {/* 태그 추가 폼 */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">새 태그 추가</h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="새 태그 이름"
              className="flex-1 px-4 py-2 border rounded-md"
            />
            <Button onClick={handleAddTag}>추가</Button>
          </div>
        </CardContent>
      </Card>

      {/* 태그 목록 */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">태그 목록</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['액션', '로맨스', '판타지', '일상', '스포츠', '학원', '요리', '음악'].map((tag) => (
              <div key={tag} className="flex items-center justify-between p-4 border rounded-lg">
                <span className="font-medium">{tag}</span>
                <Button variant="destructive" size="sm">삭제</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 태그 사용 통계 */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">태그 사용 통계</h3>
          <div className="space-y-4">
            {[
              { tag: '액션', count: 156, percentage: 25 },
              { tag: '로맨스', count: 143, percentage: 23 },
              { tag: '판타지', count: 98, percentage: 16 },
              { tag: '일상', count: 87, percentage: 14 },
            ].map((item) => (
              <div key={item.tag} className="flex items-center gap-4">
                <div className="w-24 font-medium">{item.tag}</div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right">{item.count}개</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TagManagement; 