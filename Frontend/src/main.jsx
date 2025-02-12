import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import store, { persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <Analytics />
      </PersistGate>
    </Provider>
  </StrictMode>
);