import { useReactToPrint } from "react-to-print";
import React, { useRef } from "react";
import "../../../../css/Invoice.css";

const PrintableComponent = React.forwardRef(({ invoice }, ref) => {
    return (
        <div ref={ref} style={{ padding: 20 }}>
            <header>
                <div>
                    <h1 class="invoice-title">Invoice</h1>
                </div>
                <div class="company-info">Multi Model AI SaaS</div>
            </header>

            <div class="section-group">
                <div class="invoice-details">
                    <div>
                        <strong>Invoice number</strong> 6A223D70-0002
                    </div>
                    <div>
                        <strong>Date of issue</strong> February 6, 2025
                    </div>
                    <div>
                        <strong>Date due</strong> February 6, 2025
                    </div>
                    {/* <div>
                        <strong>Default sandbox</strong> United States
                    </div> */}
                </div>

                <div class="bill-to">
                    <div>
                        <strong>Bill to</strong>
                    </div>
                    <div>{invoice.user.name}</div>
                    <div>{invoice.user.email}</div>
                </div>
            </div>

            <div class="amount-due">$10.00 USD Paid February 6, 2025</div>
            {/* <div class="pay-online">Pay online</div> */}

            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Unit price</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            ERP
                            <br />
                            <small>Feb 6 – Mar 6, 2025</small>
                        </td>
                        <td>1</td>
                        <td>${invoice.amount.toFixed(2)}</td>
                        <td>${invoice.amount.toFixed(2)}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" class="subtotal-row">
                            Subtotal
                        </td>
                        <td class="subtotal-row">
                            ${invoice.amount.toFixed(2)}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" class="total-row">
                            Total
                        </td>
                        <td class="total-row">${invoice.amount.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="3" class="amount-due-row">
                            Amount due
                        </td>
                        <td class="amount-due-row">$0 USD</td>
                    </tr>
                </tfoot>
            </table>

            <footer class="invoice-footer">
                <div>6A223D70-0002 : $10.00 USD due February 6, 2025</div>
                <div>Page 1 of 1</div>
            </footer>
        </div>
    );
});

export default function PrintInvoice({ invoice }) {
    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    return (
        <div>
            <button
                style={{
                    backgroundColor: "#f9f9f9",
                    color: "#333",
                    padding: "10px 20px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#eaeaea")
                }
                onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#f9f9f9")
                }
                onClick={reactToPrintFn}
            >
                Download
            </button>
            <div className="hidden">
                <PrintableComponent invoice={invoice} ref={contentRef} />
            </div>
        </div>
    );
}
