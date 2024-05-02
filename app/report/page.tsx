"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

const fetchExpenses = async () => {
  const response = await fetch("api/history", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ group_id: "7146eef7-5f38-4113-a212-80ee31b63b8a" }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export default function Report() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchExpenses()
      .then((data) => {
        const sortedExpenses = data.sort(
          (a, b) => new Date(a.date) - new Date(b.date),
        );
        setExpenses(sortedExpenses);
      })
      .catch((error) => console.error("Error fetching data: ", error));
    window.addEventListener("beforeprint", (event) => {
      document.body.classList.add("print");
    });
    window.addEventListener("afterprint", (event) => {
      document.body.classList.remove("print");
    });
    //window.print();
  }, []);

  const groupExpensesByMonth = (expenses) => {
    return expenses.reduce((acc, expense) => {
      const month = new Date(expense.date).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(expense);
      return acc;
    }, {});
  };

  const expensesByMonth = groupExpensesByMonth(expenses);

  return (
    <>
      <style jsx global>{`
        @media print {
          body.print {
            width: 100%;
          }
          .container {
            width: auto;
            max-width: 100%;
            page-break-inside: avoid;
          }
          img {
            max-width: 100%;
            page-break-inside: avoid;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          thead {
            display: table-header-group;
          }
          tfoot {
            display: table-footer-group;
          }
        }
      `}</style>
      <div className="bg-white w-screen h-screen">
        <div className="h-10 bg-white"></div>
        <Image
          src="/expense-report.png"
          alt="Expense Report"
          width={200}
          height={200}
          className="mx-auto"
        />

        {Object.entries(expensesByMonth).map(([month, expenses]) => (
          <div key={month} className="my-8">
            <h2 className="text-lg font-bold mb-4 text-black ml-4">{month}</h2>
            <Table className="text-black">
              <TableHeader className="text-black">
                <TableRow>
                  <TableHead className="text-black">Date</TableHead>
                  <TableHead className="text-black">Amount</TableHead>
                  <TableHead className="text-black">Payer</TableHead>
                  <TableHead className="text-black">Receiver</TableHead>
                  <TableHead className="text-black">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      {new Date(expense.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>${expense.amount.toFixed(2)}</TableCell>
                    <TableCell>{expense.payer}</TableCell>
                    <TableCell>{expense.receiver || "-"}</TableCell>
                    <TableCell>{expense.expense}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    </>
  );
}
