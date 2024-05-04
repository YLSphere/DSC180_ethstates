import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";

// import `rainbowkit` styles and configs
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  darkTheme,
  connectorsForWallets,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, createConfig, http } from "wagmi";
import { polygonAmoy } from "wagmi/chains";

// import `ChakraProvider` component
import { ChakraProvider } from "@chakra-ui/react";

// import `react-query` components
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const demoAppInfo = {
  appName: "EthStates",
  projectId: "70398219d86559f5f2abee2f75af0c41",
};

const { wallets } = getDefaultWallets({
  projectId: demoAppInfo.projectId,
  appName: demoAppInfo.appName,
});

const connectors = connectorsForWallets(wallets, {
  projectId: demoAppInfo.projectId,
  appName: demoAppInfo.appName,
});

const config = createConfig({
  chains: [polygonAmoy],
  connectors,
  transports: {
    [polygonAmoy.id]: http(import.meta.env.VITE_ALCHEMY_AMONY_URL),
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme()}
          initialChain={polygonAmoy}
          appInfo={demoAppInfo}
        >
          <ChakraProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ChakraProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
