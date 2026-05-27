import { createBrowserRouter } from "react-router"
import { Layout } from "./components/Layout"
import { Home } from "./pages/Home"
import { Explore } from "./pages/Explore"
import { Itinerary } from "./pages/Itinerary"
import { Budget } from "./pages/Budget"
import { MapView } from "./pages/Map"
import { AiPlanner } from "./pages/AiPlanner"
import { DestinationDetail } from "./components/DestinationDetail"
import { Auth } from "./pages/Auth"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "/home",
    element: <Layout><Home /></Layout>,
  },
  {
    path: "/explore",
    element: <Layout><Explore /></Layout>,
  },
  {
    path: "/explore/:id",
    element: <DestinationDetail />,
  },
  {
    path: "/itinerary",
    element: <Layout><Itinerary /></Layout>,
  },
  {
    path: "/budget",
    element: <Layout><Budget /></Layout>,
  },
  {
    path: "/map",
    element: <Layout><MapView /></Layout>,
  },
  {
    path: "/ai-chat",
    element: <Layout><AiPlanner /></Layout>,
  }
])