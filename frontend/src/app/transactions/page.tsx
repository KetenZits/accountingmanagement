'use client';

import React from 'react'
import { useState,useEffect } from 'react';

export function TransactionsListPage() {

    const [items, setItems] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
    fetchList();
    }, []);


    async function fetchList() {
    setLoading(true);
    setError('');
    try {
        const res = await fetch(`${API_URL}/transactions`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
        setItems(data);
    } catch (err) {
        setError(String(err));
    } finally {
        setLoading(false);
    }
    }


    async function remove(id) {
    if (!confirm('ลบจริงไหม?')) return;
    await fetch(`${API_URL}/transactions/${id}`, { method: 'DELETE' });
    fetchList();
    }

  return (
    <div>
        <h1>Transactions</h1>
        <p><a href="/">Back</a> | <a href="/transactions/create">Create</a></p>
                {loading && <p>Loading...</p>}
                {error && <p style={{color:'red'}}>{error}</p>}
            <table border={1} cellPadding="6">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Note</th>
                        <th>Actions</th>
                    </tr>
                </thead>
            <tbody>
                {items && items.length ? (
                items.map((it) => (
                <tr key={it.id}>
                    <td>{it.id}</td>
                    <td>{it.title}</td>
                    <td>{it.type}</td>
                    <td>{it.amount}</td>
                    <td>{it.date}</td>
                    <td>{it.note}</td>
                    <td>
                    <a href={`/transactions/${it.id}/edit`}>Edit</a>
                    {' | '}
                    <button onClick={() => remove(it.id)}>Delete</button>
                    </td>
                </tr>
                ))
                ) : (
                    <tr><td colSpan="7">No data</td></tr>
                )}
            </tbody>
        </table>
    </div>
  )
}

export default TransactionsListPage
