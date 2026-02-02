import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar } from "lucide-react";
import jsPDF from "jspdf";

/* ================= REPORT DATA ================= */

const reports = [
  {
    id: 1,
    title: "Weekly Attendance Report",
    date: "2026-01-27",
  },
  {
    id: 2,
    title: "Absentee Notification - IT22201",
    date: "2026-01-27",
  },
  {
    id: 3,
    title: "Low Attendance Alert",
    date: "2026-01-26",
  },
  {
    id: 4,
    title: "Daily Summary - Monday",
    date: "2026-01-27",
  },
];

/* ================= PDF DOWNLOAD (EMPTY BUT VALID) ================= */

function downloadEmptyPDF(filename: string) {
  const doc = new jsPDF();
  doc.text(" ", 10, 10); // ensures valid PDF
  doc.save(filename);
}

/* ================= PAGE ================= */

export default function Reports() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 animate-fade-in">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reports & Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Download generated attendance reports
            </p>
          </div>

          {/* Placeholder button (does nothing intentionally) */}
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        </div>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated Reports
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{report.title}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(report.date).toLocaleDateString()}
                    </p>
                  </div>

                  {/* DOWNLOAD ICON */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      downloadEmptyPDF(
                        `${report.title.replace(/\s+/g, "_")}.pdf`
                      )
                    }
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}
