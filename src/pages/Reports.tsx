import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Calendar,
  Mail,
} from "lucide-react";
import jsPDF from "jspdf";

/* ================= REPORT METADATA ================= */

const reports = [
  {
    id: 1,
    title: "Weekly Attendance Report",
    date: "2026-01-27",
    subject: "IT22201",
  },
  {
    id: 2,
    title: "Absentee Notification - IT22201",
    date: "2026-01-27",
    subject: "IT22201",
  },
  {
    id: 3,
    title: "Low Attendance Alert",
    date: "2026-01-26",
    subject: "MA22251",
  },
  {
    id: 4,
    title: "Daily Summary - Monday",
    date: "2026-01-27",
    subject: "HS22252",
  },
];

/* ================= PDF GENERATOR ================= */

function generatePDF(title: string, subject: string, date: string) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(title, 14, 20);

  doc.setFontSize(11);
  doc.text(`Subject : ${subject}`, 14, 32);
  doc.text(`Date    : ${date}`, 14, 40);

  let y = 60;
  doc.setFontSize(12);
  doc.text("S.No", 14, y);
  doc.text("Roll No", 30, y);
  doc.text("Student Name", 80, y);

  y += 4;
  doc.line(14, y, 195, y);
  y += 8;

  const fakeStudents = [
    ["1", "2025IT0123", "KISHORE P"],
    ["2", "2025IT1063", "KISHORE T"],
    ["3", "2025IT1022", "KRITHIKA S"],
    ["4", "2025IT0420", "LITHIKA P"],
  ];

  doc.setFontSize(10);
  fakeStudents.forEach((s) => {
    doc.text(s[0], 14, y);
    doc.text(s[1], 30, y);
    doc.text(s[2], 80, y);
    y += 7;
  });

  y += 10;
  doc.text(
    "This is a system-generated report.",
    14,
    y
  );

  doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
}

/* ================= PAGE ================= */

export default function Reports() {

  /* SEND EMAIL (modhzz.py) */
  const sendEmailReport = async () => {
    try {
      const res = await fetch("http://localhost:5000/send-report", {
        method: "POST",
      });

      if (!res.ok) throw new Error();

      alert("✅ Email sent successfully");
    } catch {
      alert("❌ Failed to send email");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 animate-fade-in">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reports & Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Download reports or send them via email
            </p>
          </div>

          {/* EMAIL BUTTON */}
          <Button
            className="gap-2 bg-primary hover:bg-primary/90"
            onClick={sendEmailReport}
          >
            <Mail className="h-4 w-4" />
            Generate Report
          </Button>
        </div>

        {/* Generated Reports */}
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
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/30"
                >
                  <div>
                    <p className="font-medium">{report.title}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(report.date).toLocaleDateString()}
                    </p>
                  </div>

                  {/* DOWNLOAD BUTTON */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      generatePDF(
                        report.title,
                        report.subject,
                        report.date
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
