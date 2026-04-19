import { useState, useEffect } from "react";
import { ethers } from "ethers";

const MARKETPLACE_ADDRESS = "0xa8c14D735A3Dd251D80DBcb68D394CDA7bd57617";

const MARKETPLACE_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "assetId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "assetName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalShares",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "pricePerShareWei",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			}
		],
		"name": "AssetCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "assetId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "sharesWhole",
				"type": "uint256"
			}
		],
		"name": "buyShares",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "assetName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "assetURI",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "totalShares",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pricePerShareWei",
				"type": "uint256"
			}
		],
		"name": "createAsset",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "assetId",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "assetId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "sharesWhole",
				"type": "uint256"
			}
		],
		"name": "sellShares",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "assetId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "shares",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "paidWei",
				"type": "uint256"
			}
		],
		"name": "SharesPurchased",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "assetId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "shares",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "receivedWei",
				"type": "uint256"
			}
		],
		"name": "SharesSold",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "assetId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "shares",
				"type": "uint256"
			}
		],
		"name": "SharesTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "assetId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "sharesWhole",
				"type": "uint256"
			}
		],
		"name": "transferShares",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [],
		"name": "assetCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "assets",
		"outputs": [
			{
				"internalType": "string",
				"name": "assetName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "assetURI",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "pricePerShareWei",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalShares",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "assetId",
				"type": "uint256"
			}
		],
		"name": "getHolderBalances",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "addrs",
				"type": "address[]"
			},
			{
				"internalType": "uint256[]",
				"name": "balances",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "assetId",
				"type": "uint256"
			}
		],
		"name": "getHolders",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "assetId",
				"type": "uint256"
			}
		],
		"name": "top10Holders",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "topAddrs",
				"type": "address[]"
			},
			{
				"internalType": "uint256[]",
				"name": "topBalances",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const TOKEN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 value) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint256 value) returns (bool)"
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Mono:wght@300;400;500&display=swap');

  :root {
    --cream: #f5f3f3;
    --dark: #411d1d;
    --gold: #c9a84c;
    --gold-light: #e8c97a;
    --rust: #8b3a2a;
    --sage: #4a6741;
    --mist: #000000;
    --border: rgba(201,168,76,0.3);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Mono', monospace;
    background: var(--dark);
    color: var(--cream);
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    background: 
      radial-gradient(ellipse at 20% 0%, rgba(201,168,76,0.08) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 100%, rgba(139,58,42,0.06) 0%, transparent 60%),
      var(--dark);
  }

  .header {
    border-bottom: 1px solid var(--border);
    padding: 20px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    backdrop-filter: blur(10px);
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(15,13,10,0.9);
  }

  .logo {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 900;
    letter-spacing: -0.5px;
    color: var(--gold);
  }

  .logo span { color: var(--cream); }

  .wallet-section { display: flex; gap: 12px; align-items: center; }

  .wallet-badge {
    font-size: 11px;
    color: var(--gold);
    background: rgba(201,168,76,0.1);
    border: 1px solid var(--border);
    padding: 6px 14px;
    border-radius: 2px;
    letter-spacing: 0.5px;
  }

  .connect-btn {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 10px 20px;
    background: var(--gold);
    color: var(--dark);
    border: none;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }

  .connect-btn:hover { background: var(--gold-light); }

  .nav {
    display: flex;
    gap: 0;
    padding: 0 40px;
    border-bottom: 1px solid var(--border);
    background: rgba(15,13,10,0.6);
  }

  .nav-tab {
    padding: 16px 24px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(245,240,232,0.4);
    cursor: pointer;
    border: none;
    background: none;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
  }

  .nav-tab:hover { color: var(--cream); }
  .nav-tab.active {
    color: var(--gold);
    border-bottom-color: var(--gold);
  }

  .main { padding: 40px; max-width: 1300px; margin: 0 auto; }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 700;
    color: var(--cream);
    margin-bottom: 8px;
  }

  .section-subtitle {
    font-size: 11px;
    color: rgba(245,240,232,0.4);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 40px;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
  }

  .asset-card {
    border: 1px solid var(--border);
    background: rgba(245,240,232,0.03);
    padding: 28px;
    position: relative;
    transition: all 0.3s;
  }

  .asset-card:hover {
    background: rgba(201,168,76,0.06);
    border-color: rgba(201,168,76,0.5);
    transform: translateY(-2px);
  }

  .asset-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px; height: 100%;
    background: var(--gold);
  }

  .card-type {
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 12px;
  }

  .card-name {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .card-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 20px 0;
  }

  .stat-label {
    font-size: 9px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(245,240,232,0.35);
    margin-bottom: 4px;
  }

  .stat-value {
    font-size: 15px;
    font-weight: 500;
    color: var(--cream);
  }

  .btn {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 10px 20px;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-gold {
    background: var(--gold);
    color: var(--dark);
    font-weight: 500;
  }

  .btn-gold:hover:not(:disabled) { background: var(--gold-light); }

  .btn-outline {
    background: transparent;
    color: var(--cream);
    border: 1px solid var(--border);
  }

  .btn-outline:hover:not(:disabled) {
    border-color: var(--gold);
    color: var(--gold);
  }

  .btn-sm { padding: 7px 14px; font-size: 10px; }

  .form-panel {
    border: 1px solid var(--border);
    background: rgba(245,240,232,0.02);
    padding: 36px;
    margin-bottom: 40px;
  }

  .form-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    margin-bottom: 28px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }

  .form-group { display: flex; flex-direction: column; gap: 8px; }
  .form-group.full { grid-column: 1 / -1; }

  label {
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(245,240,232,0.45);
  }

  input, select, textarea {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    background: rgba(245,240,232,0.05);
    border: 1px solid rgba(245,240,232,0.1);
    color: var(--cream);
    padding: 12px 14px;
    outline: none;
    transition: border-color 0.2s;
  }

  input:focus, select:focus, textarea:focus {
    border-color: var(--gold);
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15,13,10,0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    backdrop-filter: blur(4px);
  }

  .modal {
    background: #16130e;
    border: 1px solid var(--border);
    padding: 36px;
    width: 520px;
    max-width: 95vw;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }

  .modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    margin-bottom: 24px;
  }

  .modal-close {
    position: absolute;
    top: 16px; right: 20px;
    background: none;
    border: none;
    color: rgba(245,240,232,0.4);
    font-size: 20px;
    cursor: pointer;
  }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    margin-bottom: 40px;
  }

  .stat-box {
    background: #0f0d0a;
    padding: 24px 28px;
  }

  .stat-box-label {
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(245,240,232,0.35);
    margin-bottom: 8px;
  }

  .stat-box-value {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    color: var(--gold);
    font-weight: 700;
  }

  .alert {
    padding: 14px 18px;
    border-left: 3px solid var(--gold);
    background: rgba(201,168,76,0.06);
    font-size: 12px;
    color: rgba(245,240,232,0.7);
    margin-bottom: 24px;
  }

  .flex-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: rgba(245,240,232,0.25);
    font-size: 12px;
    letter-spacing: 1px;
  }

  .empty-state-icon {
    font-size: 40px;
    margin-bottom: 16px;
    opacity: 0.4;
  }

  .loading {
    text-align: center;
    padding: 60px 20px;
    color: rgba(245,240,232,0.5);
    font-size: 14px;
  }

  .status-message {
    padding: 12px 18px;
    background: rgba(201,168,76,0.1);
    border: 1px solid var(--border);
    margin-bottom: 20px;
    font-size: 12px;
    color: var(--gold);
  }

  .table-wrap { overflow-x: auto; }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }

  th {
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--gold);
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid var(--border);
    font-weight: 400;
  }

  td {
    padding: 14px 16px;
    border-bottom: 1px solid rgba(245,240,232,0.05);
    color: rgba(245,240,232,0.8);
  }

  tr:hover td { background: rgba(201,168,76,0.03); }

  .tag {
    display: inline-block;
    font-size: 9px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 1px;
  }

  .tag-gold { background: rgba(201,168,76,0.15); color: var(--gold); border: 1px solid var(--border); }
  .tag-green { background: rgba(74,103,65,0.3); color: #7ab56e; border: 1px solid rgba(74,103,65,0.5); }

  .rank-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-size: 14px;
    font-weight: 700;
    border-radius: 2px;
  }

  .rank-badge.gold { background: var(--gold); color: var(--dark); }
  .rank-badge.silver { background: #c0c0c0; color: var(--dark); }
  .rank-badge.bronze { background: #cd7f32; color: var(--dark); }
  .rank-badge.plain { background: rgba(245,240,232,0.1); color: var(--cream); }

  @media (max-width: 768px) {
    .header { padding: 16px 20px; }
    .main { padding: 24px 20px; }
    .form-grid { grid-template-columns: 1fr; }
    .stats-row { grid-template-columns: 1fr 1fr; }
    .cards-grid { grid-template-columns: 1fr; }
  }
`;

function shortAddr(addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}

function formatNum(n) {
  return n.toLocaleString("en-US");
}

function formatEth(wei) {
  return parseFloat(ethers.utils.formatEther(wei)).toFixed(4);
}

export default function App() {
  const [tab, setTab] = useState("marketplace");
  
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [marketplace, setMarketplace] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [modal, setModal] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);
      setStatus("Connecting wallet...");

      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      await web3Provider.send("eth_requestAccounts", []);
      const web3Signer = web3Provider.getSigner();
      const address = await web3Signer.getAddress();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(address);

      const marketplaceContract = new ethers.Contract(
        MARKETPLACE_ADDRESS,
        MARKETPLACE_ABI,
        web3Signer
      );
      setMarketplace(marketplaceContract);

      try {
        const ownerAddr = await marketplaceContract.owner();
        setIsOwner(address.toLowerCase() === ownerAddr.toLowerCase());
      } catch (e) {
        console.log("Could not fetch owner (contract may not have owner function)");
      }

      setStatus("Wallet connected!");
      setTimeout(() => setStatus(""), 2000);
      
      await loadAssets(marketplaceContract, address);
      setLoading(false);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setStatus("Failed to connect wallet: " + error.message);
      setLoading(false);
    }
  };

  const loadAssets = async (marketplaceContract, userAddress) => {
    try {
      setLoading(true);
      console.log("Loading assets...");
      console.log("Marketplace:", marketplaceContract?.address);
      console.log("User address:", userAddress);
      
      const count = await marketplaceContract.assetCount();
      console.log("Asset count:", count.toNumber());
      
      const assetList = [];

      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

      for (let i = 1; i <= count.toNumber(); i++) {
        const asset = await marketplaceContract.assets(i);
        
        if (!asset.exists) continue;

        const tokenContract = new ethers.Contract(asset.token, TOKEN_ABI, web3Provider);
        
        let balance = ethers.BigNumber.from(0);
        let symbol = "TOKEN";
        
        try {
          symbol = await tokenContract.symbol();
          console.log(`Asset ${i} symbol:`, symbol);
        } catch (e) {
          console.error("Could not fetch symbol for", asset.token, e);
        }
        
        if (userAddress) {
          try {
            balance = await tokenContract.balanceOf(userAddress);
            console.log(`Asset ${i} balance:`, balance.toString(), "=", ethers.utils.formatUnits(balance, 18));
          } catch (e) {
            console.error("Could not fetch balance for", asset.token, e);
          }
        }

        assetList.push({
          id: i,
          name: asset.assetName,
          uri: asset.assetURI,
          token: asset.token,
          tokenSymbol: symbol,
          pricePerShare: formatEth(asset.pricePerShareWei),
          pricePerShareWei: asset.pricePerShareWei,
          totalShares: ethers.utils.formatUnits(asset.totalShares, 18),
          creator: asset.creator,
          myBalance: ethers.utils.formatUnits(balance, 18),
          myBalanceRaw: balance
        });
      }

      console.log("Loaded assets:", assetList);
      setAssets(assetList);
      setLoading(false);
    } catch (error) {
      console.error("Error loading assets:", error);
      setStatus("Failed to load assets: " + error.message);
      setLoading(false);
    }
  };

  const handleCreateAsset = async (formData) => {
    try {
      setLoading(true);
      setStatus("Creating asset...");

      const tx = await marketplace.createAsset(
        formData.name,
        formData.tokenSymbol,
        formData.description || "ipfs://placeholder",
        formData.tokenSupply,
        ethers.utils.parseEther(formData.pricePerShare)
      );

      setStatus("Waiting for confirmation...");
      await tx.wait();

      setStatus("Asset created successfully!");
      await loadAssets(marketplace, account);
      setModal(null);
      setLoading(false);
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      console.error("Error creating asset:", error);
      setStatus("Failed to create asset: " + error.message);
      setLoading(false);
    }
  };

  const handleBuyShares = async (asset, amount) => {
    try {
      amount = parseInt(amount);
      if (!amount || amount <= 0) return;

      setLoading(true);
      setStatus("Purchasing shares...");

      const totalCost = ethers.BigNumber.from(amount).mul(asset.pricePerShareWei);

      const tx = await marketplace.buyShares(asset.id, amount, {
        value: totalCost
      });

      setStatus("Waiting for confirmation...");
      await tx.wait();

      setStatus("Shares purchased successfully!");
      await loadAssets(marketplace, account);
      setModal(null);
      setLoading(false);
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      console.error("Error buying shares:", error);
      setStatus("Failed to buy shares: " + error.message);
      setLoading(false);
    }
  };

  const handleSellShares = async (asset, amount) => {
    try {
      amount = parseInt(amount);
      if (!amount || amount <= 0) return;

      setLoading(true);
      setStatus("Checking approval...");

      const tokenContract = new ethers.Contract(asset.token, TOKEN_ABI, signer);
      const sharesWei = ethers.utils.parseUnits(amount.toString(), 18);

      const allowance = await tokenContract.allowance(account, MARKETPLACE_ADDRESS);

      if (allowance.lt(sharesWei)) {
        setStatus("Approving tokens...");
        const approveTx = await tokenContract.approve(
          MARKETPLACE_ADDRESS,
          ethers.constants.MaxUint256
        );
        setStatus("Waiting for approval...");
        await approveTx.wait();
      }

      setStatus("Selling shares...");
      const tx = await marketplace.sellShares(asset.id, amount);

      setStatus("Waiting for confirmation...");
      await tx.wait();

      setStatus("Shares sold successfully!");
      await loadAssets(marketplace, account);
      setModal(null);
      setLoading(false);
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      console.error("Error selling shares:", error);
      setStatus("Failed to sell shares: " + error.message);
      setLoading(false);
    }
  };

  const handleTransfer = async (asset, toAddr, amount) => {
    try {
      amount = parseInt(amount);
      if (!toAddr || amount <= 0) return;
      if (!ethers.utils.isAddress(toAddr)) {
        alert("Invalid address");
        return;
      }
      if (toAddr.toLowerCase() === account.toLowerCase()) {
        alert("Cannot transfer to yourself");
        return;
      }

      setLoading(true);
      setStatus("Checking approval...");

      const tokenContract = new ethers.Contract(asset.token, TOKEN_ABI, signer);
      const sharesWei = ethers.utils.parseUnits(amount.toString(), 18);

      const allowance = await tokenContract.allowance(account, MARKETPLACE_ADDRESS);

      if (allowance.lt(sharesWei)) {
        setStatus("Approving tokens...");
        const approveTx = await tokenContract.approve(
          MARKETPLACE_ADDRESS,
          ethers.constants.MaxUint256
        );
        setStatus("Waiting for approval...");
        await approveTx.wait();
      }

      setStatus("Transferring shares...");
      const tx = await marketplace.transferShares(asset.id, toAddr, amount);

      setStatus("Waiting for confirmation...");
      await tx.wait();

      setStatus("Transfer successful! Recipient added to holders list.");
      await loadAssets(marketplace, account);
      setModal(null);
      setLoading(false);
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      console.error("Error transferring:", error);
      setStatus("Failed to transfer: " + error.message);
      setLoading(false);
    }
  };

  const addTokenToMetaMask = async (asset) => {
    try {
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: asset.token,
            symbol: asset.tokenSymbol,
            decimals: 18,
            image: '',
          },
        },
      });

      if (wasAdded) {
        setStatus(`${asset.tokenSymbol} added to MetaMask!`);
        setTimeout(() => setStatus(""), 3000);
      }
    } catch (error) {
      console.error("Error adding token to MetaMask:", error);
      setStatus("Failed to add token: " + error.message);
    }
  };

  const addTokenToWallet = async (asset) => {
    try {
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: asset.token,
            symbol: asset.tokenSymbol,
            decimals: 18,
            image: '',
          },
        },
      });

      if (wasAdded) {
        setStatus(`${asset.tokenSymbol} added to MetaMask!`);
        setTimeout(() => setStatus(""), 3000);
      }
    } catch (error) {
      console.error("Error adding token to wallet:", error);
      setStatus("Failed to add token: " + error.message);
    }
  };

  useEffect(() => {
    const autoConnect = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          });
          
          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (error) {
          console.log('Auto-connect failed:', error);
        }
      }
    };

    autoConnect();
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          setAccount(null);
          setSigner(null);
          setMarketplace(null);
          setAssets([]);
        } else if (accounts[0] !== account) {
          connectWallet();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [account]);

  const totalAssets = assets.length;
  const totalTokens = assets.reduce((s, a) => s + parseFloat(a.totalShares), 0);
  const myHoldings = assets.filter(a => parseFloat(a.myBalance) > 0);

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div className="logo">ESTATE<span>CHAIN</span></div>
          <div className="wallet-section">
            {!account ? (
              <button className="connect-btn" onClick={connectWallet}>
                Connect Wallet
              </button>
            ) : (
              <>
                <div className="wallet-badge">● {shortAddr(account)}</div>
                {isOwner && <div className="wallet-badge" style={{background: 'rgba(201,168,76,0.2)'}}>ADMIN</div>}
              </>
            )}
          </div>
        </header>

        {account && (
          <nav className="nav">
            <button className={`nav-tab ${tab === "marketplace" ? "active" : ""}`} onClick={() => setTab("marketplace")}>
              Marketplace
            </button>
            {isOwner && (
              <button className={`nav-tab ${tab === "tokenize" ? "active" : ""}`} onClick={() => setTab("tokenize")}>
                Tokenize Asset
              </button>
            )}
            <button className={`nav-tab ${tab === "portfolio" ? "active" : ""}`} onClick={() => setTab("portfolio")}>
              My Portfolio
            </button>
            <button className={`nav-tab ${tab === "top10" ? "active" : ""}`} onClick={() => setTab("top10")}>
              Top 10 Holders
            </button>
          </nav>
        )}

        <main className="main">
          {status && <div className="status-message">{status}</div>}

          {!account ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏛️</div>
              <p>Connect your wallet to access the marketplace</p>
              <button className="btn btn-gold" style={{marginTop: 20}} onClick={connectWallet}>
                Connect Wallet
              </button>
            </div>
          ) : (
            <>
              <div className="stats-row">
                <div className="stat-box">
                  <div className="stat-box-label">Total Assets</div>
                  <div className="stat-box-value">{totalAssets}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-box-label">Total Tokens</div>
                  <div className="stat-box-value">{formatNum(Math.round(totalTokens))}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-box-label">My Holdings</div>
                  <div className="stat-box-value">{myHoldings.length}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-box-label">Network</div>
                  <div className="stat-box-value" style={{fontSize: '16px'}}>Connected</div>
                </div>
              </div>

              {tab === "marketplace" && (
                <>
                  <h2 className="section-title">Asset Marketplace</h2>
                  <p className="section-subtitle">Browse & acquire fractional real-world asset tokens</p>

                  {loading ? (
                    <div className="loading">Loading assets...</div>
                  ) : assets.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">🏛️</div>
                      No assets available yet. {isOwner && "Create the first one in Tokenize Asset."}
                    </div>
                  ) : (
                    <div className="cards-grid">
                      {assets.map((asset) => {
                        const userOwns = parseFloat(asset.myBalance);
                        return (
                          <div key={asset.id} className="asset-card">
                            <div className="card-type">Asset #{asset.id}</div>
                            <div className="card-name">{asset.name}</div>
                            <div className="card-stats">
                              <div>
                                <div className="stat-label">Price per Share</div>
                                <div className="stat-value">{asset.pricePerShare} ETH</div>
                              </div>
                              <div>
                                <div className="stat-label">Total Supply</div>
                                <div className="stat-value">{formatNum(Math.round(parseFloat(asset.totalShares)))}</div>
                              </div>
                              <div>
                                <div className="stat-label">Token Symbol</div>
                                <div className="stat-value">{asset.tokenSymbol}</div>
                              </div>
                              <div>
                                <div className="stat-label">You Own</div>
                                <div className="stat-value" style={{color: userOwns > 0 ? 'var(--gold)' : 'inherit'}}>
                                  {formatNum(Math.round(userOwns))}
                                </div>
                              </div>
                            </div>
                            <div className="flex-row" style={{marginTop: 20}}>
                              <button
                                className="btn btn-gold btn-sm"
                                onClick={() => setModal({ type: "buy", asset })}
                                disabled={loading}
                              >
                                Buy Shares
                              </button>
                              {userOwns > 0 && (
                                <>
                                  <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => setModal({ type: "sell", asset })}
                                    disabled={loading}
                                  >
                                    Sell Shares
                                  </button>
                                  <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => setModal({ type: "transfer", asset })}
                                    disabled={loading}
                                  >
                                    Transfer
                                  </button>
                                </>
                              )}
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => addTokenToMetaMask(asset)}
                                style={{marginLeft: 'auto', fontSize: 9, padding: '7px 12px'}}
                                title="Add token to MetaMask"
                              >
                                + Wallet
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {tab === "tokenize" && isOwner && (
                <>
                  <h2 className="section-title">Tokenize a Real-World Asset</h2>
                  <p className="section-subtitle">Define your asset and mint fractional tokens on-chain</p>
                  <TokenizeForm onSubmit={handleCreateAsset} loading={loading} />
                </>
              )}

              {tab === "portfolio" && (
                <>
                  <h2 className="section-title">My Portfolio</h2>
                  <p className="section-subtitle">Assets and tokens you hold</p>
                  
                  <div className="alert" style={{marginBottom: 30, background: 'rgba(74,103,65,0.15)', borderLeftColor: 'var(--sage)'}}>
                    <strong>Your Wallet Tokens:</strong>
                    {myHoldings.length === 0 ? (
                      <span style={{marginLeft: 8}}>No tokens held</span>
                    ) : (
                      <div style={{marginTop: 8, display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                        {myHoldings.map(asset => (
                          <span key={asset.id} className="tag tag-green">
                            {formatNum(Math.round(parseFloat(asset.myBalance)))} {asset.tokenSymbol}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {myHoldings.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">💼</div>
                      You don't hold any tokens yet. Purchase some in the Marketplace.
                    </div>
                  ) : (
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Asset</th>
                            <th>Token</th>
                            <th>Tokens Held</th>
                            <th>% Ownership</th>
                            <th>Token Address</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myHoldings.map((asset) => {
                            const held = parseFloat(asset.myBalance);
                            const total = parseFloat(asset.totalShares);
                            const pct = ((held / total) * 100).toFixed(2);
                            return (
                              <tr key={asset.id}>
                                <td><strong style={{color: 'var(--cream)'}}>{asset.name}</strong></td>
                                <td><span className="tag tag-gold">{asset.tokenSymbol}</span></td>
                                <td style={{color: 'var(--gold)', fontWeight: 500}}>{formatNum(Math.round(held))}</td>
                                <td>{pct}%</td>
                                <td>
                                  <div style={{fontSize: 10, fontFamily: 'monospace', color: 'rgba(245,240,232,0.45)'}}>
                                    {shortAddr(asset.token)}
                                  </div>
                                </td>
                                <td>
                                  <div className="flex-row">
                                    <button className="btn btn-outline btn-sm" onClick={() => setModal({ type: "sell", asset })} disabled={loading}>
                                      Sell
                                    </button>
                                    <button className="btn btn-outline btn-sm" onClick={() => setModal({ type: "transfer", asset })} disabled={loading}>
                                      Transfer
                                    </button>
                                    <button 
                                      className="btn btn-outline btn-sm" 
                                      onClick={() => addTokenToMetaMask(asset)}
                                      title="Add to MetaMask"
                                      style={{fontSize: 9}}
                                    >
                                      + Wallet
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {tab === "top10" && (
                <>
                  <h2 className="section-title">Top 10 Holders</h2>
                  <p className="section-subtitle">View largest token holders by asset</p>

                  {assets.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">🏆</div>
                      No assets available yet.
                    </div>
                  ) : (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '40px'}}>
                      {assets.map((asset) => (
                        <Top10HoldersCard 
                          key={asset.id} 
                          asset={asset} 
                          marketplace={marketplace}
                          currentAccount={account}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </main>

        {modal && (
          <Modal
            modal={modal}
            onClose={() => setModal(null)}
            onBuy={handleBuyShares}
            onSell={handleSellShares}
            onTransfer={handleTransfer}
            loading={loading}
          />
        )}
      </div>
    </>
  );
}

function Top10HoldersCard({ asset, marketplace, currentAccount }) {
  const [holders, setHolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTop10();
  }, [asset.id]);

  const loadTop10 = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log(`Loading top 10 holders for asset ${asset.id}...`);
      const [addresses, balances] = await marketplace.top10Holders(asset.id);
      
      console.log("Top 10 addresses:", addresses);
      console.log("Top 10 balances:", balances.map(b => b.toString()));

      const holderList = addresses.map((addr, i) => ({
        address: addr,
        balance: balances[i],
        balanceFormatted: ethers.utils.formatUnits(balances[i], 18),
        rank: i + 1,
        isCurrentUser: addr.toLowerCase() === currentAccount.toLowerCase()
      })).filter(h => parseFloat(h.balanceFormatted) > 0);

      setHolders(holderList);
      setLoading(false);
    } catch (err) {
      console.error("Error loading top 10 holders:", err);
      setError("Failed to load holders: " + err.message);
      setLoading(false);
    }
  };

  const getRankBadgeClass = (rank) => {
    if (rank === 1) return "gold";
    if (rank === 2) return "silver";
    if (rank === 3) return "bronze";
    return "plain";
  };

  return (
    <div className="form-panel">
      <div style={{marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 8}}>
              {asset.name}
            </h3>
            <div style={{fontSize: 11, color: 'rgba(245,240,232,0.5)', letterSpacing: '1.5px'}}>
              {asset.tokenSymbol} • {formatNum(Math.round(parseFloat(asset.totalShares)))} Total Shares
            </div>
          </div>
          <button 
            className="btn btn-outline btn-sm" 
            onClick={loadTop10}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert" style={{background: 'rgba(139,58,42,0.15)', borderLeftColor: 'var(--rust)', marginBottom: 20}}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading top holders...</div>
      ) : holders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          No holders found for this asset.
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{width: 60}}>Rank</th>
                <th>Address</th>
                <th>Tokens Held</th>
                <th>% of Supply</th>
                <th>Identity</th>
              </tr>
            </thead>
            <tbody>
              {holders.map((holder) => {
                const percentage = ((parseFloat(holder.balanceFormatted) / parseFloat(asset.totalShares)) * 100).toFixed(2);
                return (
                  <tr key={holder.address} style={{background: holder.isCurrentUser ? 'rgba(201,168,76,0.08)' : 'transparent'}}>
                    <td>
                      <span className={`rank-badge ${getRankBadgeClass(holder.rank)}`}>
                        {holder.rank}
                      </span>
                    </td>
                    <td>
                      <div style={{fontFamily: 'monospace', fontSize: 11, color: holder.isCurrentUser ? 'var(--gold)' : 'rgba(245,240,232,0.7)'}}>
                        {holder.address}
                      </div>
                    </td>
                    <td style={{color: 'var(--cream)', fontWeight: 500}}>
                      {formatNum(Math.round(parseFloat(holder.balanceFormatted)))}
                    </td>
                    <td style={{color: 'var(--gold)'}}>
                      {percentage}%
                    </td>
                    <td>
                      {holder.isCurrentUser ? (
                        <span className="tag tag-green">You</span>
                      ) : (
                        <span className="tag tag-gold">Anonymous</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TokenizeForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    name: "",
    tokenSymbol: "",
    description: "",
    tokenSupply: "",
    pricePerShare: "",
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.tokenSymbol || !form.tokenSupply || !form.pricePerShare) {
      alert("Please fill in all required fields.");
      return;
    }
    onSubmit(form);
  };

  return (
    <form className="form-panel" onSubmit={handleSubmit}>
      <div className="form-title">Define New Asset</div>
      <div className="form-grid">
        <div className="form-group">
          <label>Property Name *</label>
          <input value={form.name} onChange={set("name")} placeholder="e.g. The Meridian Tower" />
        </div>
        <div className="form-group">
          <label>Token Symbol *</label>
          <input value={form.tokenSymbol} onChange={set("tokenSymbol")} placeholder="e.g. MERI" maxLength={6} />
        </div>
        <div className="form-group">
          <label>Token Supply *</label>
          <input type="number" value={form.tokenSupply} onChange={set("tokenSupply")} placeholder="10000" min="1" />
        </div>
        <div className="form-group">
          <label>Price per Share (ETH) *</label>
          <input type="number" step="0.001" value={form.pricePerShare} onChange={set("pricePerShare")} placeholder="0.05" min="0" />
        </div>
        <div className="form-group full">
          <label>Description / URI</label>
          <textarea value={form.description} onChange={set("description")} placeholder="ipfs://... or description" />
        </div>
      </div>
      {form.tokenSupply && form.pricePerShare && (
        <div className="alert">
          Total asset value: <strong>{(parseFloat(form.tokenSupply) * parseFloat(form.pricePerShare)).toFixed(2)} ETH</strong>
        </div>
      )}
      <button type="submit" className="btn btn-gold" disabled={loading}>
        {loading ? 'Creating...' : 'Mint Asset Tokens →'}
      </button>
    </form>
  );
}

function Modal({ modal, onClose, onBuy, onSell, onTransfer, loading }) {
  const [amount, setAmount] = useState("");
  const [toAddr, setToAddr] = useState("");

  const { type, asset } = modal;
  const userOwns = Math.floor(parseFloat(asset.myBalance));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        {type === "buy" && (
          <>
            <div className="modal-title">Purchase Shares</div>
            <p style={{ fontSize: 12, color: "rgba(245,240,232,0.5)", marginBottom: 20 }}>
              Asset: <strong>{asset.name}</strong> — {asset.tokenSymbol} @ {asset.pricePerShare} ETH/share
            </p>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label>Number of Shares</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="1" placeholder="0" />
            </div>
            {amount && (
              <div className="alert">
                Total cost: <strong>{(parseFloat(amount) * parseFloat(asset.pricePerShare)).toFixed(4)} ETH</strong>
              </div>
            )}
            <button className="btn btn-gold" onClick={() => onBuy(asset, amount)} disabled={loading || !amount}>
              {loading ? 'Processing...' : 'Confirm Purchase'}
            </button>
          </>
        )}

        {type === "sell" && (
          <>
            <div className="modal-title">Sell Shares</div>
            <p style={{ fontSize: 12, color: "rgba(245,240,232,0.5)", marginBottom: 20 }}>
              You hold <strong style={{color: 'var(--gold)'}}>{formatNum(userOwns)}</strong> {asset.tokenSymbol} tokens.
            </p>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label>Number of Shares to Sell</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="1" max={userOwns} placeholder="0" />
            </div>
            {amount && (
              <div className="alert">
                You will receive: <strong>{(parseFloat(amount) * parseFloat(asset.pricePerShare)).toFixed(4)} ETH</strong>
              </div>
            )}
            <button className="btn btn-gold" onClick={() => onSell(asset, amount)} disabled={loading || !amount}>
              {loading ? 'Processing...' : 'Sell Shares'}
            </button>
          </>
        )}

        {type === "transfer" && (
          <>
            <div className="modal-title">Transfer Shares</div>
            <p style={{ fontSize: 12, color: "rgba(245,240,232,0.5)", marginBottom: 20 }}>
              Transfer {asset.tokenSymbol} tokens to another address.
            </p>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Recipient Address</label>
              <input value={toAddr} onChange={(e) => setToAddr(e.target.value)} placeholder="0x..." />
            </div>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label>Number of Shares</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="1" max={userOwns} placeholder="0" />
            </div>
            <button className="btn btn-gold" onClick={() => onTransfer(asset, toAddr, amount)} disabled={loading || !amount || !toAddr}>
              {loading ? 'Processing...' : 'Send Transfer'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}