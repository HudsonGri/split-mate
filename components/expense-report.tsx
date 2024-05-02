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
import { useSearchParams } from "next/navigation";

const fetchExpenses = async (group_id) => {
  const response = await fetch("api/history", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ group_id: group_id }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export default function ExpenseReport() {
  const [expenses, setExpenses] = useState([]);

  const searchParams = useSearchParams();

  const group_id = searchParams.get("group_id");

  useEffect(() => {
    fetchExpenses(group_id)
      .then((data) => {
        const sortedExpenses = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        );
        setExpenses(sortedExpenses);
      })
      .catch((error) => console.error("Error fetching data: ", error));

    const handleBeforePrint = (event) => {
      if (expenses.length > 0) {
        document.body.classList.add("print");
      }
    };

    const handleAfterPrint = (event) => {
      document.body.classList.remove("print");
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [expenses]);

  useEffect(() => {
    if (expenses.length > 0) {
      window.print();
    }
  }, [expenses]);

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
      <div className="bg-white w-screen h-screen print:p-0 print:w-auto print:h-auto">
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
