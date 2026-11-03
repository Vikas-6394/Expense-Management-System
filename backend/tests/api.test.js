const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Category = require('../models/Category');

let mongod;
let user1Token, user1Id;
let user2Token, user2Id;
let account1Id, account2Id;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);

  // Register User 1
  const res1 = await request(app).post('/api/auth/register').send({
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123',
    currency: 'INR',
  });
  user1Token = res1.body.token;
  user1Id = res1.body.user._id;

  // Register User 2
  const res2 = await request(app).post('/api/auth/register').send({
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'password123',
    currency: 'USD',
  });
  user2Token = res2.body.token;
  user2Id = res2.body.user._id;

  // Get user1's created default accounts
  const accRes = await request(app)
    .get('/api/accounts')
    .set('Authorization', `Bearer ${user1Token}`);
  account1Id = accRes.body.accounts[0]._id;
  account2Id = accRes.body.accounts[1]._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('1. Authentication & Security', () => {
  it('should login an existing user and return a JWT token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'alice@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('alice@example.com');
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'alice@example.com',
      password: 'wrongpassword',
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject unauthenticated requests to protected endpoints', async () => {
    const res = await request(app).get('/api/transactions');
    expect(res.statusCode).toBe(401);
  });
});

describe('2. Account Balances & Transfers', () => {
  it('should initialize account with opening balance and allow updating balance', async () => {
    const res = await request(app)
      .put(`/api/accounts/${account1Id}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ currentBalance: 10000 });
    expect(res.statusCode).toBe(200);
    expect(res.body.account.currentBalance).toBe(10000);
  });

  it('should accurately transfer money between accounts without altering income or expense', async () => {
    // Set account 2 balance to 2000
    await request(app)
      .put(`/api/accounts/${account2Id}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ currentBalance: 2000 });

    const transferRes = await request(app)
      .post('/api/accounts/transfer')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        fromAccountId: account1Id,
        toAccountId: account2Id,
        amount: 3000,
        notes: 'Monthly ATM cash reload',
      });

    expect(transferRes.statusCode).toBe(201);
    expect(transferRes.body.fromAccount.currentBalance).toBe(7000);
    expect(transferRes.body.toAccount.currentBalance).toBe(5000);

    // Verify transfer is NOT counted as income or expense
    const txSummary = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(txSummary.body.summary.totalIncome).toBe(0);
    expect(txSummary.body.summary.totalExpense).toBe(0);
  });
});

describe('3. Transactions & IDOR Isolation', () => {
  let user1TxId;

  it('should create an expense and automatically deduct from account balance', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'Supermarket Groceries',
        type: 'expense',
        amount: 1500,
        account: account1Id,
        paymentMethod: 'UPI',
        categoryName: 'Groceries',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.transaction.amount).toBe(1500);
    user1TxId = res.body.transaction._id;

    // Check account balance deduction (7000 - 1500 = 5500)
    const accRes = await request(app)
      .get('/api/accounts')
      .set('Authorization', `Bearer ${user1Token}`);
    const acc1 = accRes.body.accounts.find((a) => a._id === account1Id);
    expect(acc1.currentBalance).toBe(5500);
  });

  it('should create income and automatically increase account balance', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'Freelance Design Milestone',
        type: 'income',
        amount: 8000,
        account: account1Id,
        paymentMethod: 'Bank Transfer',
        categoryName: 'Freelancing',
      });

    expect(res.statusCode).toBe(201);
    // 5500 + 8000 = 13500
    const accRes = await request(app)
      .get('/api/accounts')
      .set('Authorization', `Bearer ${user1Token}`);
    const acc1 = accRes.body.accounts.find((a) => a._id === account1Id);
    expect(acc1.currentBalance).toBe(13500);
  });

  it('CRITICAL IDOR TEST: User 2 must NOT be able to view, edit, or delete User 1 transactions', async () => {
    // User 2 tries to GET User 1's transaction
    const getRes = await request(app)
      .get(`/api/transactions/${user1TxId}`)
      .set('Authorization', `Bearer ${user2Token}`);
    expect(getRes.statusCode).toBe(404);

    // User 2 tries to UPDATE User 1's transaction
    const putRes = await request(app)
      .put(`/api/transactions/${user1TxId}`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send({ title: 'Hacked Title' });
    expect(putRes.statusCode).toBe(404);

    // User 2 tries to DELETE User 1's transaction
    const delRes = await request(app)
      .delete(`/api/transactions/${user1TxId}`)
      .set('Authorization', `Bearer ${user2Token}`);
    expect(delRes.statusCode).toBe(404);
  });

  it('should recalculate account balance when editing a transaction amount', async () => {
    // Edit the 1500 expense to 2000 (an increase in expense of 500)
    const updateRes = await request(app)
      .put(`/api/transactions/${user1TxId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ amount: 2000 });

    expect(updateRes.statusCode).toBe(200);

    // Balance was 13500, now should be 13000
    const accRes = await request(app)
      .get('/api/accounts')
      .set('Authorization', `Bearer ${user1Token}`);
    const acc1 = accRes.body.accounts.find((a) => a._id === account1Id);
    expect(acc1.currentBalance).toBe(13000);
  });

  it('should restore balance when deleting a transaction', async () => {
    const delRes = await request(app)
      .delete(`/api/transactions/${user1TxId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(delRes.statusCode).toBe(200);

    // Balance restored: 13000 + 2000 = 15000
    const accRes = await request(app)
      .get('/api/accounts')
      .set('Authorization', `Bearer ${user1Token}`);
    const acc1 = accRes.body.accounts.find((a) => a._id === account1Id);
    expect(acc1.currentBalance).toBe(15000);
  });
});

describe('4. Budgets & Calculations', () => {
  it('should calculate budget spent, remaining, and percentage correctly', async () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Create a budget of ₹10,000 for Food
    const bRes = await request(app)
      .post('/api/budgets')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        categoryName: 'Food and Drinks',
        amount: 10000,
        month,
        year,
      });

    expect(bRes.statusCode).toBe(201);

    // Add ₹4,000 Food expense
    await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'Dinner at Italian Bistro',
        type: 'expense',
        amount: 4000,
        account: account1Id,
        categoryName: 'Food and Drinks',
      });

    // Check budget calculation
    const listRes = await request(app)
      .get(`/api/budgets?month=${month}&year=${year}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(listRes.statusCode).toBe(200);
    const budget = listRes.body.budgets[0];
    expect(budget.amount).toBe(10000);
    expect(budget.spent).toBe(4000);
    expect(budget.remaining).toBe(6000);
    expect(budget.percentage).toBe(40);
  });
});
