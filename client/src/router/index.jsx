import React from "react";
//layoutpages
import Default from "../layout/default";

import { DefaultRouter } from "./default-route";

export const IndexRouters = [
  {
    path: "/",
    element: <Default />,
    children: [...DefaultRouter],
  },
];
