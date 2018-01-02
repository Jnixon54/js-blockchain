const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(index, timestamp, data, previousHash = ''){
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
    this.timeElapsed = 0;
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    const startTime = +new Date()/1000;
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
      this.nonce++;
      this.hash = this.calculateHash();
    }
    const endTime = +new Date()/1000;
    this.timeElapsed = (endTime - startTime).toFixed(2);
    console.log(`Block mined: ${this.hash} | ${this.timeElapsed} seconds`);
  }
}

class BlockChain{
  constructor(){
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 6;
  }

  createGenesisBlock() {
    return new Block(0, "25/12/2017", "My first block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++){
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()){
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash){
        return false;
      }
    }
    return true;
  }
}

let joeCoin = new BlockChain();
console.log('Mining Block 1...');
joeCoin.addBlock(new Block(1, "26/12/2017", { amount: 100}))
console.log('Mining Block 2...')
joeCoin.addBlock(new Block(2, "27/12/2017", { amount: 20}))
console.log('Mining Block 3...');
joeCoin.addBlock(new Block(3, "27/12/2017", { amount: 1020}))
console.log('Mining Block 4...')
joeCoin.addBlock(new Block(4, "28/12/2017", { amount: 201}))
console.log('Mining Block 5...');
joeCoin.addBlock(new Block(5, "29/12/2017", { amount: 1020}))


console.log(JSON.stringify(joeCoin, null, 4));

console.log('is chain valid? ', joeCoin.isChainValid());

joeCoin.chain[1].data = {amount: 4111};
joeCoin.chain[1].hash = joeCoin.chain[1].calculateHash();

console.log('is chain valid? ', joeCoin.isChainValid());