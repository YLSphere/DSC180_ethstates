import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

// import `rainbowkit` styles and configs
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, goerli, sepolia, hardhat } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

// import `ChakraProvider` component
import { ChakraProvider } from "@chakra-ui/react";

// import `react-query` components
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, goerli, sepolia, hardhat],
  [publicProvider()]
);

const projectId = "70398219d86559f5f2abee2f75af0c41";

const { wallets } = getDefaultWallets({
  appName: "EthStates",
  projectId,
  chains,
});

const demoAppInfo = {
  appName: "EthStates",
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        theme={darkTheme()}
        chains={chains}
        appInfo={demoAppInfo}
      >
        <QueryClientProvider client={queryClient}>
          <ChakraProvider>
            <App />
          </ChakraProvider>
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
