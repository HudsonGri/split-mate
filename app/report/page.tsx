import ExpenseReport from "@/components/expense-report";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Monthly Expense Report for Group',
}

export default function Report() {
    
    

    return (
        <>
            <ExpenseReport />
        </>
    );
}
