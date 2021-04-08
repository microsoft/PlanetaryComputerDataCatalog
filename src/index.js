// Remove when we drop support for IE 11
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@fluentui/react";

import "./index.css";
import App from "./App";

import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

ReactDOM.render(
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </ThemeProvider>,
  document.getElementById("root")
);

// An example of how to build just the header component for embedding in other apps

// import Header from "./components/Header";
// import { BrowserRouter } from "react-router-dom";
// ReactDOM.render(
//   <ThemeProvider>
//     <BrowserRouter forceRefresh>
//       <Header />
//     </BrowserRouter>
//   </ThemeProvider>,
//   document.getElementById("root")
// );
