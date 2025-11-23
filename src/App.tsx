import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/store";
import Login from "./pages/login/Login";
import About from "./pages/about/About";
import Home from "./pages/home/Home";
import SharedMoney from "./pages/sharedMoney/SharedMoney";
import PageNotFound from "./pages/error/PageNotFound";
import PrivateRoute from "./components/privateRoutes/PrivateRoute"; // Import PrivateRoute

import "./App.scss";
import { setCurrentPage } from "./redux/slices/NavigationSlice";
import { RootState } from "./redux/store";
import CustomAppBar from "./components/appBar/AppBar";
import HanziContainer from "./pages/hanzi/HanziContainer";
import { WorkoutTimer } from "./pages/exercise/WorkoutTimer";
import FlashCardsView from "./pages/hanzi/FlashCardsView";

const queryClient = new QueryClient();

// Custom hook to dispatch current page
const usePageNavigation = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const page = window.location.pathname.split("/")[1] || "Home";
    dispatch(setCurrentPage(page));
  }, [dispatch]);
};

const App: React.FC = () => {
  const currentPage = useSelector((state: RootState) => {
    return state.navigation?.currentPage; // Ensure you're checking for undefined state
  });

  usePageNavigation();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <CustomAppBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<PageNotFound />} /> {/* Catch-all for undefined routes */}
            <Route path="/shared" element={<PrivateRoute element={<SharedMoney />} />} />
            <Route path="/hanzi" element={<PrivateRoute element={<HanziContainer />} />} />
            <Route path="/flashcards" element={<FlashCardsView />} />
            <Route path="/workout" element={<PrivateRoute element={<WorkoutTimer />} />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
