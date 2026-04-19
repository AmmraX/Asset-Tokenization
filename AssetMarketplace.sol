// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./FractionalAssetToken.sol";


contract AssetMarketplace {
    struct Asset {
        string assetName;
        string assetURI;
        address token;            
        uint256 pricePerShareWei; 
        uint256 totalShares;
        address creator;
        bool exists;
    }

    address public immutable owner;

    mapping(uint256 => Asset) public assets;
    uint256 private _assetCount;

    mapping(uint256 => address[]) private holders;
    mapping(uint256 => mapping(address => bool)) private isHolder;

    event AssetCreated(
        uint256 indexed assetId,
        string assetName,
        address token,
        uint256 totalShares,
        uint256 pricePerShareWei,
        address indexed creator
    );

    event SharesPurchased(uint256 indexed assetId, address indexed buyer, uint256 shares, uint256 paidWei);
    event SharesSold(uint256 indexed assetId, address indexed seller, uint256 shares, uint256 receivedWei);
    event SharesTransferred(uint256 indexed assetId, address indexed from, address indexed to, uint256 shares);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function createAsset(
        string memory assetName,
        string memory symbol,
        string memory assetURI,
        uint256 totalShares,
        uint256 pricePerShareWei
    ) external onlyOwner returns (uint256 assetId) {
        require(totalShares > 0, "totalShares=0");
        require(pricePerShareWei > 0, "price=0");

        FractionalAssetToken token = new FractionalAssetToken(assetName, symbol, address(this));

        uint256 sharesUnits = totalShares * 1e18;

        token.mint(address(this), sharesUnits);

        _assetCount++;
        assetId = _assetCount;

        assets[assetId] = Asset({
            assetName: assetName,
            assetURI: assetURI,
            token: address(token),
            pricePerShareWei: pricePerShareWei,
            totalShares: sharesUnits,
            creator: msg.sender,
            exists: true
        });

        emit AssetCreated(assetId, assetName, address(token), sharesUnits, pricePerShareWei, msg.sender);
    }

    function buyShares(uint256 assetId, uint256 sharesWhole) external payable {
        Asset memory a = assets[assetId];
        require(a.exists, "no asset");
        require(sharesWhole > 0, "shares=0");

        uint256 sharesUnits = sharesWhole * 1e18;
        uint256 cost = sharesWhole * a.pricePerShareWei;

        require(msg.value >= cost, "insufficient ETH");
        require(FractionalAssetToken(a.token).balanceOf(address(this)) >= sharesUnits, "not enough shares left");

        require(FractionalAssetToken(a.token).transfer(msg.sender, sharesUnits), "transfer failed");

        _addHolder(assetId, msg.sender);

        emit SharesPurchased(assetId, msg.sender, sharesUnits, cost);
    }

    function sellShares(uint256 assetId, uint256 sharesWhole) external {
        Asset memory a = assets[assetId];
        require(a.exists, "no asset");
        require(sharesWhole > 0, "shares=0");

        uint256 sharesUnits = sharesWhole * 1e18;
        uint256 payout = sharesWhole * a.pricePerShareWei;

        require(address(this).balance >= payout, "market no ETH");

        bool ok = FractionalAssetToken(a.token).transferFrom(msg.sender, address(this), sharesUnits);
        require(ok, "transferFrom failed");

        (bool sent, ) = payable(msg.sender).call{value: payout}("");
        require(sent, "ETH send failed");

        _addHolder(assetId, msg.sender); 

        emit SharesSold(assetId, msg.sender, sharesUnits, payout);
    }

    function transferShares(uint256 assetId, address to, uint256 sharesWhole) external {
        Asset memory a = assets[assetId];
        require(a.exists, "no asset");
        require(to != address(0), "invalid recipient");
        require(to != msg.sender, "cannot transfer to self");
        require(sharesWhole > 0, "shares=0");

        uint256 sharesUnits = sharesWhole * 1e18;

        bool ok = FractionalAssetToken(a.token).transferFrom(msg.sender, to, sharesUnits);
        require(ok, "transferFrom failed");

        _addHolder(assetId, msg.sender);
        _addHolder(assetId, to);

        emit SharesTransferred(assetId, msg.sender, to, sharesUnits);
    }

    function _addHolder(uint256 assetId, address user) internal {
        if (!isHolder[assetId][user]) {
            isHolder[assetId][user] = true;
            holders[assetId].push(user);
        }
    }

    function assetCount() external view returns (uint256) {
        return _assetCount;
    }

    function getHolders(uint256 assetId) external view returns (address[] memory) {
        require(assets[assetId].exists, "no asset");
        return holders[assetId];
    }

    function getHolderBalances(uint256 assetId) external view returns (address[] memory addrs, uint256[] memory balances) {
        require(assets[assetId].exists, "no asset");

        address token = assets[assetId].token;
        address[] memory hs = holders[assetId];

        uint256[] memory bs = new uint256[](hs.length);
        for (uint256 i = 0; i < hs.length; i++) {
            bs[i] = FractionalAssetToken(token).balanceOf(hs[i]);
        }
        return (hs, bs);
    }

    function top10Holders(uint256 assetId) external view returns (address[] memory topAddrs, uint256[] memory topBalances) {
        require(assets[assetId].exists, "no asset");

        address token = assets[assetId].token;
        address[] memory hs = holders[assetId];

        uint256 n = hs.length;
        uint256 k = n < 10 ? n : 10;

        uint256[] memory bs = new uint256[](n);
        for (uint256 i = 0; i < n; i++) {
            bs[i] = FractionalAssetToken(token).balanceOf(hs[i]);
        }

        topAddrs = new address[](k);
        topBalances = new uint256[](k);

        bool[] memory picked = new bool[](n);

        for (uint256 t = 0; t < k; t++) {
            uint256 best = 0;
            uint256 bestIdx = type(uint256).max;

            for (uint256 i = 0; i < n; i++) {
                if (!picked[i] && bs[i] >= best) {
                    best = bs[i];
                    bestIdx = i;
                }
            }

            if (bestIdx == type(uint256).max) {
                break;
            }

            picked[bestIdx] = true;
            topAddrs[t] = hs[bestIdx];
            topBalances[t] = bs[bestIdx];
        }
    }

    receive() external payable {}
}
