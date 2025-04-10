import { FC, useState } from 'react';
import { Card, CardContent } from "@/shared/ui/shadcn/card";
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, ScatterController, LinearScale, PointElement, Tooltip, Legend, Title, ChartOptions } from 'chart.js';
import { fetchPcaData, fetchAvgScatterData } from '@/pages/admin/api';

ChartJS.register(PointElement, LinearScale, Tooltip, Legend, Title);

const UserAnalysis: FC = () => {
  const [pcaData, setPcaData] = useState<any[]>([]);
  const [scatterDataOther, setScatterDataOther] = useState<any[]>([]);

  const groupByColor = (color: string) =>
    pcaData.filter(d => d.color === color).map(d => ({ x: d.PC1, y: d.PC2 }));

  const scatterPcaChartData = {
    datasets: [
      { 
        label: 'Seen', 
        data: groupByColor('Seen'), 
        backgroundColor: 'rgba(54, 162, 235, 0.7)', 
        pointRadius: 6 
      },
      { 
        label: 'Chosen', 
        data: groupByColor('Chosen'), 
        backgroundColor: 'rgba(255, 99, 132, 0.7)', 
        pointRadius: 6 
      },
      { 
        label: 'Unchosen', 
        data: groupByColor('Unchosen'), 
        backgroundColor: 'rgba(255, 159, 64, 0.7)', 
        pointRadius: 6 
      },
      { 
        label: 'Others', 
        data: groupByColor('Others'), 
        backgroundColor: 'rgba(201, 203, 207, 0.7)', 
        pointRadius: 6 
      },
    ],
  };

  const scatterPcaOptions: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 40 },
    plugins: {
      legend: { position: 'top', labels: { font: { size: 18 }, padding: 16 } },
      title: { display: true, text: '벡터화 데이터 PCA 시각화', font: { size: 24 }, padding: { top: 20, bottom: 20 } },
      tooltip: { mode: 'nearest', intersect: false, bodyFont: { size: 16 }, titleFont: { size: 18 }, padding: 10 },
    },
    scales: {
      x: { title: { display: true, text: 'PC1', font: { size: 18 } }, ticks: { font: { size: 14 } } },
      y: { title: { display: true, text: 'PC2', font: { size: 18 } }, ticks: { font: { size: 14 } } },
    },
  };

  const scatterOtherChartData = {
    datasets: [
      {
        label: '유저 데이터',
        data: scatterDataOther.map(d => ({ x: d.cosine_sim, y: d.rating })),
        backgroundColor: 'rgba(153, 102, 255, 0.8)',
        pointRadius: 6,
      },
    ],
  };

  const scatterOtherChartOptions: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 18 } } },
      title: { display: true, text: '유사도 vs 평점 평균 (Chart.js)', font: { size: 24 } },
      tooltip: { bodyFont: { size: 16 }, titleFont: { size: 18 }, padding: 10 },
    },
    scales: {
      x: { title: { display: true, text: '평균 유사도', font: { size: 18 } }, ticks: { font: { size: 14 } } },
      y: { title: { display: true, text: '평균 평점', font: { size: 18 } }, ticks: { font: { size: 14 } } },
    },
  };

  const handlePcaDataClick = async () => setPcaData(await fetchPcaData());
  const handleOtherDataClick = async () => setScatterDataOther(await fetchAvgScatterData());

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">사용자 분석</h1>

      {/* 연령대별 및 성별 분포 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['연령대별 분포', '성별 분포'].map((title, idx) => (
          <Card key={idx}>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">{title}</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                {idx === 0 ? '파이 차트가 들어갈 영역' : '막대 차트가 들어갈 영역'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 사용자 활동 추이 카드 */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">사용자 활동 추이</h3>
          <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
            라인 차트가 들어갈 영역
          </div>
        </CardContent>
      </Card>

      {/* 유사도/평점 카드 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">유사도 vs 평점 시각화 (Chart.js)</h3>
            <button 
              onClick={handleOtherDataClick} 
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              유사도/평점 보기
            </button>
          </div>
          <div className="h-[600px] bg-white rounded-lg">
            {scatterDataOther.length > 0 
              ? <Scatter data={scatterOtherChartData} options={scatterOtherChartOptions} /> 
              : <p className="flex items-center justify-center h-full text-gray-500">차트가 로드되지 않았습니다.</p>
            }
          </div>
        </CardContent>
      </Card>

      {/* PCA 카드 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">PCA 결과 시각화</h3>
            <button 
              onClick={handlePcaDataClick} 
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              PCA 결과 보기
            </button>
          </div>
          <div className="h-[600px] bg-white rounded-lg">
            {pcaData.length > 0 
              ? <Scatter data={scatterPcaChartData} options={scatterPcaOptions} /> 
              : <p className="flex items-center justify-center h-full text-gray-500">차트가 로드되지 않았습니다.</p>
            }
          </div>
        </CardContent>
      </Card>

      {/* 통계 정보 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: '평균 체류 시간', value: '24분', change: '▲ 5분 이번 주' },
          { title: '평균 방문 횟수', value: '3.5회', change: '▲ 0.5회 이번 주' },
          { title: '이용률', value: '68%', change: '▲ 3% 이번 주' },
        ].map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-600">{stat.title}</h3>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
              <p className="text-sm text-green-600 mt-2">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserAnalysis;