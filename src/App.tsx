import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from "@/pages/main/Main.tsx";
import Layout from "@/layouts/Layout.tsx";
import WebtoonMain from "@/pages/webtoon/WebtoonManin.tsx";

function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route path='/' element={<Layout />}>
                  <Route index element={<Main />} />

                  {/*비회원 ======================*/}

                  {/*회원 ======================*/}


                  {/*웹툰*/}
                  <Route path='/webtoon' element={<WebtoonMain />} />

              </Route>
          </Routes>
      </BrowserRouter>
  )
}

export default App
