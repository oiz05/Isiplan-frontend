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
    element: <Layout />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "explore",
        element: <Explore />,
      },
      {
        path: "explore/:id",
        element: <DestinationDetail />,
      },
      {
        path: "itinerary",
        element: <Itinerary />,
      },
      {
        path: "budget",
        element: <Budget />,
      },
      {
        path: "map",
        element: <MapView />,
      },
      {
        path: "ai-chat",
        element: <AiPlanner />,
      },
    ],
  }
])
