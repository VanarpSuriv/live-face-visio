"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Calendar,
  Mail,
  CheckCircle,
} from "lucide-react";
import jsPDF from "jspdf";

/* ---------------- STUDENT REFERENCE ---------------- */

const STUDENTS = [
  { roll: "2025IT0123", name: "KISHORE P" },
  { roll: "2025IT1063", name: "KISHORE T" },
  { roll: "2025IT1022", name: "KRITHIKA S" },
  { roll: "2025IT0420", name: "LITHIKA P" },
  { roll: "2025IT0500", name: "MADHUMITHA A" },
  { roll: "2025IT0316", name: "MITHRA M S" },
  { roll: "2025IT0366", name: "MOHAMMED ASLAM A" },
  { roll: "2025IT0511", name: "MOTHEESH D" },
  { roll: "2025IT0171", name: "NIGILA FATHIMA L" },
  { roll: "2025IT0098", name: "NISHANTH JACOB E" },
  { roll: "2025IT1087", name: "POOJA SRI M" },
  { roll: "2025IT0041", name: "PRADYUMNA KOYYALAM SRIRAM" },
  { roll: "2025IT1070", name: "PRANAV A" },
  { roll: "2025IT1032", name: "PRANAYA M" },
  { roll: "2025IT1093", name: "PREMNATH R" },
  { roll: "2025IT0327", name: "PRIYADARSHAN M" },
  { roll: "2025IT0424", name: "PRIYADHARSHINI K" },
  { roll: "2025IT1020", name: "R RAGHURAMAN" },
  { roll: "2025IT1036", name: "RAAKESH KESAVAN" },
  { roll: "2025IT1072", name: "RAGHAVI S" },
  { roll: "2025IT1033", name: "RAGHUL M" },
  { roll: "2025IT0065", name: "RAHULGANDHI V B" },
  { roll: "2025IT1062", name: "RAJINI K" },
  { roll: "2025IT0248", name: "REKHA P" },
  { roll: "2025IT0140", name: "RITHICK T" },
  { roll: "2025IT0229", name: "RITIKA S" },
  { roll: "2025IT0196", name: "S NEHA" },
];

/* ---------------- HELPERS ---------------- */

function getRandomStudents(count: number) {
  return [...STUDENTS].sort(() => 0.5 - Math.random()).slice(0, count);
}

function formatStudents(students: any[]) {
  return students.map((s, i) => `${i + 1}. ${s.roll} - ${s.name}`).join("\n");
}

/* ---------------- PDF CONTENT ---------------- */

function getPDFContentByType(report: any) {
  const absentees = getRandomStudents(Math.floor(Math.random() * 6) + 3);

  switch (report.type) {
    case "attendance":
      return `
ATTENDANCE REPORT
------------------------------
Report Name : ${report.title}
Date        : ${report.date}

Total Students : 60
Present        : ${60 - absentees.length}
Absent         : ${absentees.length}

Absent Students:
${formatStudents(absentees)}

Attendance % : ${Math.floor(85 + Math.random() * 10)}%
`;

    case "absentee":
      return `
ABSENTEE NOTIFICATION
------------------------------
Class : ${report.title}
Date  : ${report.date}

Absent Students:
${formatStudents(absentees)}

Emails Sent : ${report.emails}
SMTP Status : SUCCESS
`;

    case "alert":
      return `
LOW ATTENDANCE ALERT
------------------------------
Alert Date : ${report.date}

Students Below 75% Attendance:
${formatStudents(absentees.slice(0, 3))}

Action Required:
• Notify parents
• Student counselling
`;

    case "summary":
      return `
DAILY ATTENDANCE SUMMARY
------------------------------
Date : ${report.date}

Classes Conducted : ${6 + Math.floor(Math.random() * 3)}
Average Attendance : ${Math.floor(80 + Math.random() * 15)}%

Frequently Absent Students:
${formatStudents(absentees.slice(0, 4))}
`;

    default:
      return "No data available.";
  }
}

/* ---------------- REAL PDF GENERATOR ---------------- */

function downloadMockPDF(report: any) {
  const doc = new jsPDF();
  const content = getPDFContentByType(report);

  doc.setFont("courier");
  doc.setFontSize(10);

  const lines = doc.splitTextToSize(content, 180);
  doc.text(lines, 10, 15);

  const fileName = `${report.title
    .replace(/\s+/g, "_")
    .toLowerCase()}_${report.date}.pdf`;

  doc.save(fileName);
}

/* ---------------- REPORT DATA ---------------- */

const reports = [
  {
    id: 1,
    title: "Weekly Attendance Report",
    date: "2026-01-27",
    type: "attendance",
    status: "ready",
    emails: 3,
  },
  {
    id: 2,
    title: "Absentee Notification - IT22201",
    date: "2026-01-27",
    type: "absentee",
    status: "sent",
    emails: 5,
  },
  {
    id: 3,
    title: "Low Attendance Alert",
    date: "2026-01-26",
    type: "alert",
    status: "sent",
    emails: 3,
  },
  {
    id: 4,
    title: "Daily Summary - Monday",
    date: "2026-01-27",
    type: "summary",
    status: "ready",
    emails: 0,
  },
];

/* ---------------- PAGE ---------------- */

export default function Reports() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">

        <h1 className="text-2xl font-bold">Reports & Notifications</h1>

        <Card>
          <CardHeader>
            <CardTitle>Generated Reports</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
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

                <div className="flex items-center gap-2">
                  <Badge>
                    {report.status === "sent" ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Sent
                      </span>
                    ) : (
                      "Ready"
                    )}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => downloadMockPDF(report)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}
