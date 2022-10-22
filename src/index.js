import { get, writable } from 'svelte/store';
import { connectWallet } from './provider';

let ethers;
let shouldConnectAccount = false;

export const ethereumProvider = writable(null);
export const provider = writable(null);
export const chainId = writable(null);
export const signer = writable(null);
export const signerAddress = writable(null);
export const connected = writable(false);
export const hasWallet = writable(false);

ethereumProvider.subscribe((value) => {
	if (value) {
		value.on('accountsChanged', initSigner);
		value.on('chainChanged', () => init(ethers, shouldConnectAccount));
		hasWallet.set(true);
	} else {
		hasWallet.set(false);
	}
});

/**
 * Init the providers by detecting the current injected wallet and constructing the ethers provider that goes with it
 */
async function initProviders() {
	const { ethersProvider, walletProvider } = await connectWallet(ethers);
	setProviders(walletProvider, ethersProvider);
}

/**
 * Sets the providers
 */
function setProviders(ethProvider, ethersProvider) {
	ethereumProvider.set(ethProvider);
	provider.set(ethersProvider);
}

/**
 * Initiate the signer and signerAddress store with the current connected Signer
 */
async function initSigner() {
	try {
		const _signer = getProvider().getSigner();

		signer.set(_signer);
		connected.set(true);

		// get current signer address.
		if (_signer) {
			signerAddress.set(await _signer.getAddress());
		} else {
			// null if disconnected
			signerAddress.set(null);
		}
	} catch (e) {
		connected.set(false);
		signer.set(null);
		signerAddress.set(null);
	}
}

/**
 * Inits the network (chainId and account if set)
 */
async function initNetwork() {
	// set the chainId & get the current account
	chainId.set(
		await getEthereumProvider().request({
			method: 'eth_chainId'
		})
	);

	if (shouldConnectAccount || localStorage.getItem('wallet:accountConnected')) {
		await connectAccount();
	}
}

/**
 * Allows consumers to init the detection of wallets
 *
 * @param _ethers the ethers.js constructor
 * @param _shouldConnectAccount if the system should try to automatically connect the user
 */
export async function init(_ethers, _shouldConnectAccount = false) {
	ethers = _ethers;
	if (!ethers) throw new Error('Please provide ethers.js');

	shouldConnectAccount = _shouldConnectAccount;

	await initProviders();
	await initNetwork();
}

/**
 * Asks the current wallet for the user to connect one account
 */
export async function connectAccount() {
	await getEthereumProvider().request({ method: 'eth_requestAccounts' });
	await initSigner();
	localStorage.setItem('wallet:accountConnected', 'true');
}

/**
 * Disconnects the current account
 */
export function disconnect() {
	localStorage.removeItem('wallet:accountConnected');
	connected.set(false);
	signer.set(null);
	signerAddress.set(null);
}

/**
 * Returns a svelte store with the current chainId
 */
export function getChainId() {
	return get(chainId);
}

/**
 * Returns a svelte store with the current signer or provider
 */
export function getSignerOrProvider() {
	return getSigner() || getProvider();
}
/**
 * Returns a svelte store with the current signer
 */
export function getSigner() {
	return get(signer);
}

/**
 * Returns a svelte store with the current ethers Provider
 */
export function getProvider() {
	return get(provider);
}

/**
 * Returns a svelte store with the current ethereum provider
 */
export function getEthereumProvider() {
	return get(ethereumProvider);
}

/**
 * Helper to easily ask the current wallet to switch to `chainId`
 *
 * @param chainId the chain to switch to
 */
export async function changeChainFor(chainId) {
	await ethereum.request({
		method: 'wallet_switchEthereumChain',
		params: [{ chainId }]
	});
}

/**
 * Allows to connect with given providers (useful when connecting with WalletConnect & other centralize stuff)
 *
 * @param ethProvider the Ethereum provider
 * @param ethersProvider the ethers provider
 */
export async function connectWithGivenProvider(ethProvider, ethersProvider) {
	setProviders(ethProvider, ethersProvider);

	shouldConnectAccount = true;

	await initNetwork();
}
