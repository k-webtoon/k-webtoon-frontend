import { useNavigate } from "react-router-dom";

function Error() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">페이지를 찾을 수 없습니다</h2>
          <p className="text-gray-500">요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
          >
            이전 페이지로 돌아가기
          </button>
          <button
            onClick={() => navigate("/")}
            className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
          >
            메인 페이지로 이동
          </button>
        </div>
      </div>
    </div>
  );
}

export default Error;