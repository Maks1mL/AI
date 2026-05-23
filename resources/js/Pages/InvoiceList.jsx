import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('/invoices')
      .then(response => {
         setInvoices(response.data.invoices);
         setLoading(false);
      })
      .catch(error => {
         console.error(error);
         setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading invoices...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      {invoices.length === 0 ? (
         <p>No invoices found.</p>
      ) : (
         <table className="min-w-full bg-white">
            <thead>
               <tr>
                  <th className="py-2 px-4 border">Date</th>
                  <th className="py-2 px-4 border">Amount</th>
                  <th className="py-2 px-4 border">Invoice</th>
               </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice.id}>
                  <td className="py-2 px-4 border">{new Date(invoice.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border">${invoice.amount}</td>
                  <td className="py-2 px-4 border">
                     <a
                       href={invoice.download_url}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="text-indigo-600 underline"
                     >
                       Download
                     </a>
                  </td>
                </tr>
              ))}
            </tbody>
         </table>
      )}
    </div>
  );
};

export default InvoiceList;
