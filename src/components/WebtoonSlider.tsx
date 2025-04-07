import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { Webtoon } from '@/entities/webtoon/model/types';
import { Card, CardContent } from '@/shared/ui';

interface WebtoonSliderProps {
  title: string;
  apiUrl: string;
}

export const WebtoonSlider: FC<WebtoonSliderProps> = ({ title, apiUrl }) => {
  const [webtoons, setWebtoons] = useState<Webtoon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(apiUrl, {
          withCredentials: true
        });
        
        if (!response.data || !response.data.content) {
          throw new Error('데이터가 없습니다.');
        }
        
        setWebtoons(response.data.content);
        setError(null);
      } catch (err) {
        console.error('웹툰 데이터 로드 오류:', err);
        setError('웹툰 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [apiUrl]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {webtoons.map((webtoon) => (
          <Card key={webtoon.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <img
                src={webtoon.thumbnailUrl}
                alt={webtoon.title}
                className="w-full aspect-[3/4] object-cover rounded-lg mb-2"
              />
              <h3 className="font-semibold text-sm truncate">{webtoon.title}</h3>
              <p className="text-gray-500 text-xs truncate">{webtoon.author}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 