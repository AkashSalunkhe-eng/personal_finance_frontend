'use client';
import React, { useState, useEffect } from 'react';
import Api from "./serverRoutes"
import Select from "react-select"
import Chart from "./chart"

export default function Home() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [dropdownOptions, setDropDownOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState("user1");
  const [userTransaction, setUserTransaction] = useState([{ username: '', amount: '' }]);
  const [debitTrans, setDebitTrans] = useState([{ username: '', amount: '' }]);
  const [lodaingTransaction, setLoadingTransaction] = useState(false);
  const [chartData, setChartData] = useState([]);
  
  const userData = async () => {
    const userOverview = await Api.getUserTransaction(selectedUser);
    setItems(userOverview.data);
  };

  const getAllUsers = async () => {
    const result = await Api.getAllUsers();
    const newArray = result.data;
    const sortData = sortDataForChart(newArray);
    setChartData([sortData]);
    const uniqueArray = [];
    newArray.forEach((item) => {
      const isUsernameExists = uniqueArray.some((uniqueItem) => uniqueItem.value === item.username);
          if (!isUsernameExists) {
        uniqueArray.push({ value: item.username, label: item.username });
      }
    });
    setDropDownOptions(uniqueArray);
    const totalAmount = calculateTotalCreditedAmount(newArray, selectedUser);
    setTotal(totalAmount);
  }

  const calculateTotalCreditedAmount = (userTransactions, username) => {
    const creditedAmount = userTransactions
      .filter(item => item.username === username && item.transaction === 'Credited')
      .reduce((total, item) => total + parseFloat(item.amount), 0);
  
    const debitedAmount = userTransactions
      .filter(item => item.username === username && item.transaction === 'Debited')
      .reduce((total, item) => total + parseFloat(item.amount), 0);
  
    return creditedAmount - debitedAmount;
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    userData();
    getAllUsers();
  }, [selectedUser, lodaingTransaction]);
  
  const addTransaction = async (e) => {
    e.preventDefault(); 
    setLoadingTransaction(true);
    const details = {
      amount: userTransaction.amount,
      username: userTransaction.username,
      transaction: "Credited",
    }
    await Api.addNewTransaction(details);
    setUserTransaction({username: '', amount: ''});
    setLoadingTransaction(false);
  };

  const debitTransaction = async (e) => {
    e.preventDefault(); 
    setLoadingTransaction(true);
    const details = {
      amount: debitTrans.amount,
      username: debitTrans.username,
      transaction: "Debited",
    }
    await Api.addNewTransaction(details);
    setDebitTrans({username: '', amount: ''});
    setLoadingTransaction(false);
  };

  const handleUserChange = (selectedOption) => {
    setSelectedUser(selectedOption.value);
      userData();
  };
  const sortDataForChart = (userTransactions) => {
    return userTransactions.reduce((map, { username, transaction, amount }) => {
      if (transaction === 'Credited') {
        map.set(username, [...(map.get(username) || []), parseFloat(amount)]);
      }
      return map;
    }, new Map());
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-between sm:p-24 p-4'>
      <div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm '>
        <div p-4 w-full flex justify-between>
          <h1 className='text-4xl p-4'>Personal Expense</h1>
          <Select
            options={dropdownOptions}
            placeholder="Select a user"
            className='text-black'
            onChange={handleUserChange}
          />
        </div>
        <div className='bg-slate-800 p-4 rounded-lg'>
        <div className='p-4 w-full flex justify-between'>
                  <span className='capitalize text-white-600 text-xl'>user</span>
                  <span className='capitalize text-white-600 text-xl'>Transaction</span>
                  <span className='text-white-600 text-xl'>Amount</span>
        </div>
          <ul className="overflow-x-auto" style={{ height: '700px' }}>
            {items.map((item, id) => (
              <li
                key={id}
                className='my-4 w-full flex justify-between bg-slate-950'
              >
                <div className='p-4 w-full flex justify-between' style={{border: "1px solid blue", fontWeight:"bolder", fontSize:"20px", color: item.transaction === "Debited" ? "orange" : "green"}} >
                  <span className='capitalize'>{item.username}</span>
                  <span className='capitalize'>{item.transaction}</span>
                  <span>${item.amount}</span>
                </div>
              </li>
            ))}
          </ul>
          {items.length < 1 ? (
            ''
          ) : (
            <div className='flex justify-between p-3'>
              <span style={{fontSize: "25px", color: "yellow"}}>Total</span>
              <span style={{fontSize: "24px", color: "yellow"}}>${total}</span>
            </div>
          )}
          <br/>
          <span className='p-1 text-xl'>Credit</span>
          <form className='grid grid-cols-6 items-center text-black'>
            <input
              value={userTransaction.username}
              onChange={(e) => setUserTransaction({ ...userTransaction, username: e.target.value })}
              className='col-span-3 p-3 border'
              type='text'
              placeholder='Enter User name'
            />
            <input
              value={userTransaction.amount}
              onInput={(e) => {
                const value = e.target.value;   
                if (value.length <= 4 && /^\d*\.?\d*$/.test(value)) {
                  setUserTransaction({ ...userTransaction, amount: value });
                }
              }}
              className='col-span-2 p-3 border mx-3'
              type='number'
              placeholder='Enter $'
              maxLength={3}
            />
            <button
              onClick={addTransaction}
              className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl'
              type='submit'
            >
              +
            </button>
          </form>
          <br/>
          <span className='p-1 text-xl'>Debit</span>
          <form className='grid grid-cols-6 items-center text-black'>
            <input
              value={debitTrans.username}
              onChange={(e) => setDebitTrans({ ...debitTrans, username: e.target.value })}
              className='col-span-3 p-3 border'
              type='text'
              placeholder='Enter User name'
            />
            <input
              value={debitTrans.amount}
              onInput={(e) => {
                const value = e.target.value;   
                if (value.length <= 4 && /^\d*\.?\d*$/.test(value)) {
                  setDebitTrans({ ...debitTrans, amount: value });
                }
              }}
              className='col-span-2 p-3 border mx-3'
              type='number'
              placeholder='Enter $'
            />
            <button
              onClick={debitTransaction}
              className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl'
              type='submit'
            >
              -
            </button>
          </form>
        </div>
      </div>
      <Chart chartData={chartData}/>
    </main>
  );
}