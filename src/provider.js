export async function connectWallet(ethers) {
	const walletProvider = await getInjectedProvider();

	if (!walletProvider) {
		throw new Error('No ethereum provider.');
	}

	// A Web3Provider wraps a standard Web3 provider, which is
	// what Metamask injects as window.ethereum into each page
	const ethersProvider = new ethers.providers.Web3Provider(walletProvider);

	return { ethersProvider, walletProvider };
}

async function getInjectedProvider() {
	return new Promise((resolve, reject) => {
		if (window.ethereum) {
			resolve(window.ethereum);
		} else {
			// automatically reject if ethereum not initialized in 10s
			let timeout = setTimeout(() => reject('No injected wallet found.'), 10000);
			window.addEventListener(
				'ethereum#initialized',
				() => {
					clearTimeout(timeout);
					resolve(window.ethereum);
				},
				{
					once: true
				}
			);
		}
	});
}
