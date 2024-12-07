// Block class definition
class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return CryptoJS.SHA256(
      this.index + this.timestamp + this.data + this.previousHash
    ).toString();
  }
}

// Blockchain class definition
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }), "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid() {
    let isValid = true;
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        isValid = false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        isValid = false;
      }
    }
    return isValid;
  }
}

// Initialize blockchain and reference to DOM elements
const blockchain = new Blockchain();
const blockchainDiv = document.getElementById("blockchain");
const addBlockBtn = document.getElementById("add-block-btn");

// Function to render the blockchain
function renderBlockchain() {
  console.log("Rendering Blockchain...");
  console.log(blockchain.chain); // Ensure blockchain has data

  blockchainDiv.innerHTML = "";  // Clear the blockchain div

  let isChainInvalid = false;  // Flag to track invalid chain

  blockchain.chain.forEach((block, index) => {
    const blockDiv = document.createElement("div");
    blockDiv.classList.add("block");

    // Check if the block is tampered with
    if (index > 0) {
      const currentBlock = blockchain.chain[index];
      const previousBlock = blockchain.chain[index - 1];

      if (
        currentBlock.hash !== currentBlock.calculateHash() ||
        currentBlock.previousHash !== previousBlock.hash
      ) {
        blockDiv.classList.add("invalid");
        isChainInvalid = true;
      }

      if (isChainInvalid) {
        blockDiv.classList.add("invalid");
      }
    }

    // Create HTML content for each block, including hashes and previous hash
    blockDiv.innerHTML = `
      <p><strong>Index:</strong> ${block.index}</p>
      <p><strong>Timestamp:</strong> ${block.timestamp}</p>
      <p><strong>Data:</strong>
        <span contenteditable="true" class="editable-data" data-index="${index}">${block.data}</span>
      </p>
      <p><strong>Hash:</strong> <span class="full-hash">${block.hash}</span></p>
      <p><strong>Previous Hash:</strong> <span class="previous-hash">${block.previousHash}</span></p>
      ${index > 0 ? `<button class="save-btn" data-index="${index}">Save Changes</button>` : ''}
    `;

    blockchainDiv.appendChild(blockDiv);
  });

  // Event listeners for saving modified data
  const saveButtons = document.querySelectorAll(".save-btn");
  saveButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = parseInt(event.target.getAttribute("data-index"));
      const dataSpan = document.querySelector(
        `.editable-data[data-index="${index}"]`
      );
      const newData = dataSpan.textContent;

      if (index < blockchain.chain.length && index > 0) {
        blockchain.chain[index].data = newData;
        renderBlockchain(); // Re-render the blockchain
        alert("Block modified! Check the invalid chain.");
      } else {
        alert("You cannot tamper with the Genesis Block!");
      }
    });
  });
}


// Add new block on button click
addBlockBtn.addEventListener("click", () => {
  const newBlock = new Block(
    blockchain.chain.length,
    new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    `New Block Data ${blockchain.chain.length}`
  );
  blockchain.addBlock(newBlock);
  renderBlockchain();
});

// Initial render
renderBlockchain();
