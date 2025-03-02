import { db } from "@/drizzle/db";
import { monthlyReport, reportTable } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    // first lets get settings to know if we should even
    // dream of generating a report or not
  try {
    // Query the database
    const reportSetting = await db.query.reportTable.findMany({
        orderBy: [desc(reportTable.id)],
        limit: 1,
    });
    if(reportSetting.length > 0){
        // we have a setting
        // lets check if its today
        const monthDate = reportSetting[0].monthDate || ''
        const today = new Date();
        const todayMonthDate = today.getDate();
        const previousMonthDate = new Date(today);
        previousMonthDate.setMonth(today.getMonth() - 1); // Subtract 1 from the current month
        // Get the previous month's name
        const previousMonth = previousMonthDate.toLocaleString('default', { month: 'long' });
        // lets see if today is the date
        if(monthDate == todayMonthDate.toString()){
            // check if a report was already generated
            const reportCheck = await db
            .query
            .monthlyReport
            .findMany({
              where: eq(monthlyReport.monthDate, monthDate) && eq(monthlyReport.month, previousMonth)
          })
          if(reportCheck.length == 0){
            const data = {
                monthDate: monthDate,
                month: previousMonth
            }
            // no report found, we can generate
            await db.insert(monthlyReport).values({...data})

            //fetch all reports then
            const allReports = await db.query.monthlyReport.findMany()
            return NextResponse.json(allReports);
            } else {
            // not today generated for that month
            return NextResponse.json([])
            }
            
        } else {
            // not today
            return NextResponse.json([])
        }
    }
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch report settings" }, { status: 500 });
  }
}
