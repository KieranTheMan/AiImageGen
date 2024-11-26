import { CreatePost, Home } from "../pages";

export const DefaultRouter = [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "create-post",
      element: <CreatePost />,
    }
]