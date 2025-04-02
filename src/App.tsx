import UserProfile from "./pages/user/userpage/UserProfile";
import UserFollowers from "./pages/user/userpage/UserFollowers";
import UserFollowees from "./pages/user/userpage/UserFollowees";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user/:userId" element={<UserProfile />} />
        <Route path="/user/:userId/followers" element={<UserFollowers />} />
        <Route path="/user/:userId/followees" element={<UserFollowees />} />
      </Routes>
    </Router>
  );
}

export default App; 