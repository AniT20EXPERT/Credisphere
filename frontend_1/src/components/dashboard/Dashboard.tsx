
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Upload,
  Eye,
  Download,
  Trash2,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/lib/toast";

const recentReports = [
  {
    id: "REP-1234",
  },
  {
    id: "REP-1235",
  },
  {
    id: "REP-1236",
  },
  {
    id: "REP-1237",
  },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeStatusTab, setActiveStatusTab] = useState<string>("all");
  const [filteredReports, setFilteredReports] = useState(recentReports);

  const handleDownload = (reportId: string) => {
    toast.success(`Report ${reportId} downloaded successfully`);
  };

  const handleDeleteReport = (reportId: string) => {
    setFilteredReports(filteredReports.filter((report) => report.id !== reportId));
    toast.success("Report deleted successfully");
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome, {user?.organization}</h1>
          <p className="text-muted-foreground">
            Here's your credit risk analysis overview
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild className="button-hover-effect">
            <Link to="/report-submission">
              <Upload className="mr-2 h-4 w-4" /> Submit New Report
            </Link>
          </Button>
        </div>
      </div>

      {/* Recent Reports Section */}
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Recent Reports</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">
                    Report ID
                  </th>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-4 text-center text-muted-foreground">
                      No reports available
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr
                      key={report.id}
                      className="hover:bg-accent/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">{report.id}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 rounded-lg"
                            asChild
                          >
                            <Link to={`/report-analysis?id=${report.id}`}>
                              <Eye className="mr-1.5 h-4 w-4" /> View
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 rounded-lg"
                            onClick={() => handleDownload(report.id)}
                          >
                            <Download className="mr-1.5 h-4 w-4" /> Download
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteReport(report.id)}
                          >
                            <Trash2 className="mr-1.5 h-4 w-4" /> Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 text-center border-t border-border">
            <Button variant="ghost" asChild>
              <Link to="/report-history">
                View All Reports <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
