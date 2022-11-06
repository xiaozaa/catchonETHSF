// SPDX-License-Identifier: MIT

pragma solidity >=0.8.9 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol"; // AUTO: whitelist option 3
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol"; // AUTO: whitelist option 3

contract Ecomerce is
    ERC1155,
    Ownable,
    IERC2981,
    Initializable,
    ERC1155Burnable
{
    event Minted(
        uint256 indexed _tokenId,
        address _buyer,
        uint256 _amount,
        uint256 _sales
    );

    string private _name = "Catchon";
    string private _symbol = "CO";

    struct saleInfo {
        uint256 price;
        uint256 maxRoundSupply;
        bool isAllowlist;
    }

    mapping(uint256 => uint256) public tokenMinted;
    mapping(uint256 => uint256) public burnSupply;
    mapping(uint256 => uint256) public supplyLimit;
    mapping(uint256 => address) public forgingContractAddresses;
    mapping(uint256 => string) public tokenURIs;
    mapping(uint256 => bytes32) public merkleRoots;
    mapping(uint256 => bool) public isMintOn;
    mapping(uint256 => uint256) public currentRound;
    mapping(uint256 => mapping(uint256 => saleInfo)) public mintInfo;

    // ======== Royalties =========
    address public royaltyAddress;
    uint256 public royaltyPercent;

    uint256 public boundry;

    constructor() ERC1155("CATCHON") {}

    modifier callerIsUser() {
        require(tx.origin == msg.sender, "The caller is another contract");
        _;
    }

    function initialize(string memory name_, string memory symbol_)
        public
        initializer
    {
        _name = name_;
        _symbol = symbol_;
        _transferOwnership(tx.origin);
        royaltyAddress = tx.origin;
    }

    function addTokenAndConfigureUri(uint256 newSupply, string calldata newUri)
        public
        onlyOwner
    {
        setSupply(boundry, newSupply);
        setTokenURIs(boundry, newUri);
        boundry++;
    }

    // Mint function

    function mint(
        uint256 tokenId,
        uint256 amount,
        bytes32[] calldata merkleProof
    ) external payable callerIsUser {
        require(
            tokenMinted[tokenId] + amount <= supplyLimit[tokenId],
            "Limit reached"
        );
        require(isMintOn[tokenId], "Sale not starts yet.");
        uint256 cRound = currentRound[tokenId];
        require(
            mintInfo[tokenId][cRound].maxRoundSupply >= amount,
            "No more product avaialbe."
        );
        if (mintInfo[tokenId][cRound].isAllowlist) {
            require(
                merkleRoots[tokenId] != bytes32(0x0),
                "Merkle Root is not set"
            );
            require(
                MerkleProof.verify(
                    merkleProof,
                    merkleRoots[tokenId],
                    keccak256(
                        abi.encodePacked(this, msg.sender, tokenId, cRound)
                    )
                ),
                "Sender address is not in allowlist"
            );
        }

        uint256 salesAmount = mintInfo[tokenId][cRound].price * amount;
        require(msg.value >= salesAmount, "Require more eth!");

        tokenMinted[tokenId] = tokenMinted[tokenId] + amount;
        mintInfo[tokenId][cRound].maxRoundSupply -= amount;
        address buyerAddr = _msgSender();
        _mint(buyerAddr, tokenId, amount, "");
        emit Minted(tokenId, buyerAddr, amount, salesAmount);
    }

    // Forge function
    function forgeToken(uint256 tokenId, uint256 amount) external callerIsUser {
        require(
            balanceOf(msg.sender, tokenId) >= amount,
            "Doesn't own the token"
        ); // Check if the user own one of the ERC-1155
        burnSupply[tokenId] += amount;
        burn(msg.sender, tokenId, amount); // Burn one the ERC-1155 token
    }

    // --------
    // Getter
    // --------

    function uri(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return tokenURIs[tokenId];
    }

    // --------
    // Setter
    // --------
    function setMintOn(uint256 tokenId, bool _status) external onlyOwner {
        isMintOn[tokenId] = _status;
    }

    function setCurrentRound(uint256 tokenId, uint256 _round)
        external
        onlyOwner
    {
        currentRound[tokenId] = _round;
    }

    function setSaleInfo(
        uint256 tokenId,
        uint256[] memory _prices,
        uint256[] memory _maxRoundSupply,
        bool[] memory _isAllowlists,
        bytes32 _merkleRoot
    ) external onlyOwner {
        for (uint256 i = 0; i < _prices.length; i++) {
            saleInfo memory newSaleInfo = saleInfo({
                price: _prices[i],
                maxRoundSupply: _maxRoundSupply[i],
                isAllowlist: _isAllowlists[i]
            });
            mintInfo[tokenId][i] = newSaleInfo;
        }
        merkleRoots[tokenId] = _merkleRoot;
    }

    function setTokenURIs(uint256 tokenId, string calldata newUri)
        public
        onlyOwner
    {
        tokenURIs[tokenId] = newUri;
    }

    function setSupply(uint256 tokenId, uint256 newSupply) public onlyOwner {
        require(
            newSupply >= tokenMinted[tokenId],
            "New supply cannot be smaller than number minted"
        );
        if (tokenId == boundry) {
            boundry++;
        }
        supplyLimit[tokenId] = newSupply;
    }

    // In case someone send money to the contract by mistake
    function withdrawFunds() public onlyOwner {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Transfer failed.");
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    // ======== Royalties =========
    function setRoyaltyReceiver(address royaltyReceiver) public onlyOwner {
        royaltyAddress = royaltyReceiver;
    }

    function setRoyaltyPercentage(uint256 royaltyPercentage) public onlyOwner {
        royaltyPercent = royaltyPercentage;
    }

    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        require(tokenMinted[tokenId] != 0, "Non-existent token");
        return (royaltyAddress, (salePrice * royaltyPercent) / 100);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}

