# DSC180_ethstates
DSC180 Final Project - Blockchain Property platform

### Environment Variables

Add private key of the wallet for backend dev and Etherscan API key to `.env.example` in the root directory. Once finish, rename it to `.env`.

Add pinata JWT to `.env.example` in the `frontend` directory. Also rename to `.env` afterward.

### Setup

The first things you need to do is installing its dependencies

```sh
npm install
```

Once installed, on a new terminal, go to the repository's root folder and run this to deploy your contract:

```sh
npx hardhat run scripts/deployProxy.ts --network goerli
```

Use the implementation address from output:

```sh
npx hardhat verify <implementation-address>
```

Finally, we can run the frontend with:

```sh
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) to see your Dapp. You will need to have [Coinbase Wallet](https://www.coinbase.com/wallet) or [Metamask](https://metamask.io/) installed and listening to `localhost 8545`.

Documentation to access github from remix
1. Go to plugins on the bottom left of the remix sidebar and install DGIT
2. Generate a Personal access token on github - https://github.com/settings/tokens/new?scopes=gist,repo&description=Remix%20IDE%20Token
3. Enter "github credentials" on the settings tab on remix
4. Go to version control and clone the repo
5. Go to "CLONE, PUSH, PULL & REMOTES"
6. Under COMMANDS, enter main as LOCAL BRANCH and origin as REMOTE BRANCH and click on "init"
7. Under "GIT REMOTE", enter "origin" and the URL and "add remote"
8. After working on the files, under "source control", stage the files and "git commit"
9. Go to "CLONE, PUSH, PULL & REMOTES" and push
