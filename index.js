
import express from 'express';
const axios = require('axios');

const app = express();
const PORT = 8000;

let balance = 10000;
let stockOwned = 0;
let stockPrice = 100;
let buyPrice = null;
let profitLoss = 0;

const getMockStockPrice = () => {
    return stockPrice * (1 + (Math.random() - 0.5) / 50);
};

const executeTradingStrategy = (price) => {
    if(buyPrice === null && price < stockPrice * 0.98) {
        stockOwned = balance/price;
        balance = 0;
        buyPrice = price;
        console.log(`Brought stock at $${price.toFixed(2)}`);
    } else if(buyPrice !== null && price > buyPrice * 1.03) {
        balance = stockOwned * price;
        profitLoss += balance - (stockOwned * buyPrice);
        stockOwned = 0;
        buyPrice = null;
        console.log(`Sold stock at $${price.toFixed(2)}`);
    }
};

setInterval(() => {
    stockPrice = getMockStockPrice();
    console.log(`Current stock price: $${stockPrice.toFixed(2)}`);
    executeTradingStrategy(stockPrice);
}, 5000);

app.get('/trading-summary', (req, res) => {
    res.json({
        balance: balance.toFixed(2),
        stockOwned: stockOwned.toFixed(2),
        profitLoss: profitLoss.toFixed(2),
        currentStockPrice: stockPrice.toFixed(2)
    });
});

app.listen(PORT, () => {
    console.log(`Trading bot running on port ${PORT}`);
})