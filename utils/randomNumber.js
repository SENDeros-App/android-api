tools = {}

tools.generateRandomNumber = (n) => {
    let randomNumber = '';
    for (let i = 0; i < n; i++) {
      randomNumber += Math.floor(Math.random() * 10);
    }
    return randomNumber;
}

module.exports = tools;