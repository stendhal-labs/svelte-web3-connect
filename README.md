# Svelte-Web3-Connect

small set of tools used to easily connect an injected wallet (Metamask, Tally Oh!, Coinbase), when creating a web3 wesbite with svelte.

## What?

This small library exports a few functions and stores that can be used in your svelte application

### Requirements

1. svelte is added as a peer dependency (it must be installed in your project).
2. It works with ethers.js and expects it to be passed in the `init()` function

## functions

### `init(ethers, shouldConnectAccount)`

Initialize the providers and tries to reach the current injected wallet.
If the user has already connected to the current website in the past, it will try to call `connectAccount()` too.

### `connectAccount()`

Asks the current connected wallet to connect the account.

Requires init() to be called prior

### `disconnect()`

Disconnects the current account

### `connectWithGivenProvider(ethereumProvider, ethersProvider)`

Allows consumer to st Ethereum Provider and EthersProvider externally without relying on the injected wallet.

### `changeChainFor(chainId)`

Asks the current wallet to switch the current network to network corresponding to `chainId`

## stores

### `hasWallet`

true if there is a provider known.

### `ethereumProvider`

the current ethereum provider; by default the injected wallet, else the wallet provided when calling `connectWithGivenProvider()`

### `provider`

the current ethers provider

### `chainId`

the current chain id

### `signer`

the current signer (if connectAccount has been called)

### `signerAddress`

the current signerAddress (if connectAccount has been called)

### `connected`

if the current account is connected

## stores value getters

### `getChainId()`

gets the value of current chainId store

### `getSigner()`

gets the value of current signer store

### `getProvider()`

gets the value of current provider store

### `getSignerOrProvider()`

gets the value of current signer or provider stores

### `getEthereumProvider()`

gets the value of current ethereumProvider store
