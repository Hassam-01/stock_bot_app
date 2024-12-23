const express = require('express');
const knexConfig = require('./database.js');
const knex = require('knex');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = knex(knexConfig.development);
const app = express();
app.use(cors(
{  origin: process.env.REACT_APP_FRONTEND_URL, // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], //
  }
));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send('Hello World');
})
app.post('/api/auth/login', async (req, res) => {
  // we recieve the username and password from the client
  const { username, password } = req.body;
  // we check if the user exists in the database
  try{
    const user = await db('users').where({username}).first();
    // if the user does not exist, we return an error
    if(!user){

      return res.status(400).json({message: 'User Does Not Exist'});
    }
    // if the user exists, we check if the password is correct using bcrypt
    // if the password is incorrect, we return an error
    if(!bcrypt.compareSync(password, user.password_hash)){
      return res.status(400).json({message: 'Invalid Credentials'});
    }
    // if the password is correct, we return the user details
    // we can also use jwt to create a token and send it to the client
    // use jwt to create a token
    const token = jwt.sign({id: user.id, username: user.username
    }, 'secret', {expiresIn: '1h'});
    return res.status(200).json({token, username: user.username, id: user.user_id});
  }catch (err){
    return res.status(500).json({message: 'Something went wrong'});
  }
});

app.post('/api/recommendation', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5000/api/signal/recommendation', req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error in forwarding request:', error);
    res.status(500).send('Error communicating with FastAPI');
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { username, password, email } = req.body;

  // Hash the password using bcrypt
  const hash = bcrypt.hashSync(password, 10);

  try {
    // Insert user and return the username and user_id
    const [user] = await db('users')
      .insert({ username, password_hash: hash, email })  // Make sure 'password_hash' matches your DB column name
      .returning(['user_id', 'username']);  // Returning the fields you need

    // Return a success response with the user details
    return res.status(201).json({ message: 'User Registered Successfully', username: user.username, user_id: user.user_id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

app.post('/api/trade/:user_id/buy', async (req, res) => {
  // ! ---------------------------------------------------------------------------------
  // -- making a trade 
  // -- if stock exits in stocks take the stock id else make an entry and take stock id
  // -- then go to price table and make an entry their take price id
  // -- go to assets and enter the price id, stock id, quantity, user id
  // -- go to transactions enter useridm stock id, type, quantity, price
  // ! ---------------------------------------------------------------------------------
  const { price, quantity, date, signal, ticker } = req.body.dataSend;
  const user_id = req.params.user_id;
  const transaction_type = 'buy';
  // Check if the user exists
  const user = await db('users').where({ user_id }).first();
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  try {
    // Check if the stock exists
    if (!ticker) {
      return res.status(400).json({ message: 'Ticker is required' });
    }
    let [stock] = await db('stocks').where({ ticker });
    // If the stock does not exist, insert it
    if (!stock) {
      [stock] = await db('stocks').insert({ ticker, company_name: ticker }).returning('*');
    }
    // Insert the price for the stock_id and get the price_id
    const [stockPrice] = await db('stock_prices').insert({ stock_id: stock.stock_id, price, price_date:date }).returning('*');
    // Insert the asset
    await db('assets').insert({ user_id, stock_id: stock.stock_id, price_id: stockPrice.price_id, quantity });
    // Insert the transaction
    await db('transactions').insert({ user_id, stock_id: stock.stock_id, transaction_type, quantity, price,transaction_date: date });
    await db('users').where({ user_id }).decrement('total_investment', quantity * price);
    // Return a success response
    return res.status(201).json({ message: 'Buy Trade Successful' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});



app.post('/api/trade/:user_id/sell', async (req, res) => {
  // ! ---------------------------------------------------------------------------------
  // for sell first we check and verify if the stock exists in the stocks table // * done
  // then we check if the user exists  // * done
  // then we insert the price for the stock_id and get the price_id // * done
  // then we insert the transaction // * done
  // then we go to assets find the assets and update the quantity (using price_id and stock_id) // * done
  // if the quantity is 0, we delete the asset // * done 
  // then we update the user's balance // * done
  // ! ----------------------------------------------------------------------------------
  const {
    sellPrice: price,
    sellQuantity: quantity,
    sellDate: date,
    sellTicker: ticker,
    sellSignal: signal,
    sellStockId: stock_id,
    sellPriceId: price_id
  } = req.body.dataSend[0];
  const user_id = req.params.user_id;

  const transaction_type = 'sell';
  // Check if the user exists
  const user = await db('users').where({ user_id }).first();
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  try {
    // Check if the stock exists
    let [stock] = await db('stocks').where({ ticker });
    // If the stock does not exist, insert it
    if (!stock) {
      [stock] = await db('stocks').insert({ ticker, company_name: ticker }).returning('*');
    }
    // Insert the price for the stock_id and get the price_id
    const [priceData] = await db('stock_prices').where({ price_id }).returning('*');
    // const price_id = priceData.price_id;
    const buy_price = priceData.price;
    // Insert the transaction
    await db('transactions').insert({ user_id, stock_id: stock_id, price, quantity, transaction_type, transaction_date: date });
    // Update the user's balance
    await db("assets").where({ user_id, stock_id,price_id }).decrement('quantity', quantity);
    // go to user+portfolio and update the sell_price and for the price_id stock_id and user_id
    await db('user_portfolio').insert({ user_id, stock_id, buy_price, sell_price: price,  price_id, sell_quantity: quantity, sell_date: date });
    // Return a success response
    return res.status(201).json({ message: 'Sell Trade Successful' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
// for now: transactions taable updated 



});

app.get("/api/dashboard/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    // Check if the user exists
    const user = await db('users').where({ user_id }).first();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // for the assets we go to assets table and take stock_id and price_id, then we go to stock_prices table and
    // take the price for the price_id and then we go to stocks table and take the company_name and ticker for the stock_id

    const assets = await db('assets')
      .join('stocks', 'assets.stock_id', 'stocks.stock_id')
      .join('stock_prices', 'assets.price_id', 'stock_prices.price_id')
      .select('assets.stock_id', 'stocks.company_name', 'stocks.ticker', 'stock_prices.price', 'assets.price_id', 'assets.quantity', 'stock_prices.price_date')
      .where({ user_id });
      
    // ? formatting the assets to be sent to the client, grouping them by ticker

      const transformedAssets = {};
       assets.forEach((asset) => {
          const { ticker, price_id, price, stock_id, quantity, price_date } = asset;
           if (!transformedAssets[ticker]) {
              transformedAssets[ticker] = [];
            }
            transformedAssets[ticker].push({ price_id, price, stock_id, quantity, date: price_date });
    }) 
    


    // taking the transactions from the transactions table
    const activities = await db('transactions').where({ user_id });

    const joined = await db('users')
      .select('created_at')
      .where({ user_id })
      .first();

    const balance = await db('users')
      .select('total_investment', 'total_profit_loss')
      .where({ user_id })
      .first();
    // Return the user's data
    const transformedAssetsArray = Object.keys(transformedAssets).map((ticker) => ({
      ticker,
      assets: transformedAssets[ticker],
    }));
    return res.status(200).json({
      transformedAssets : transformedAssetsArray,
      activities,
      balance,
      joined,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

app.listen(3009, ()=>{
    console.log('Server is running on port 3009');
});
