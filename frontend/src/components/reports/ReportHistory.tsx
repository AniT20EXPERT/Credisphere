
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "@/lib/toast";
import {
  FileText,
  Download,
  Trash2,
  Eye,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";

interface Report {
  id: string;
}

const generateDummyReports = (): Report[] => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `REP-${1000 + i}`,
  }));
};

const ReportHistory: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const dummyReports = generateDummyReports();
        setReports(dummyReports);
        setFilteredReports(dummyReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
        toast.error("Failed to load reports");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReports();
  }, []);
  
  useEffect(() => {
    let result = [...reports];
    
    if (searchTerm) {
      result = result.filter(
        (report) => report.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredReports(result);
  }, [reports, searchTerm]);
  
  const handleDeleteReport = (reportId: string) => {
    setReports(reports.filter((report) => report.id !== reportId));
    toast.success("Report deleted successfully");
  };
  
  const handleDownload = (reportId: string) => {
    toast.success(`Report ${reportId} downloaded successfully`);
  };
  
  const clearFilters = () => {
    setSearchTerm("");
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Report History</h1>
          <p className="text-muted-foreground">
            View, download, and manage your credit reports
          </p>
        </div>
        <Button asChild className="button-hover-effect">
          <Link to="/report-submission">
            <FileText className="mr-2 h-4 w-4" /> Submit New Report
          </Link>
        </Button>
      </div>
      
      <Card className="glass-card mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID..."
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card overflow-hidden">
        <CardHeader className="p-0">
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
                {isLoading ? (
                  <tr>
                    <td colSpan={2} className="py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="space-x-1 mb-2">
                          <span className="loading-dot loading-dot-1"></span>
                          <span className="loading-dot loading-dot-2"></span>
                          <span className="loading-dot"></span>
                        </div>
                        <p className="text-muted-foreground">Loading reports...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium mb-1">No reports found</h3>
                        <p className="text-muted-foreground mb-4">
                          {searchTerm
                            ? "Try adjusting your search"
                            : "No reports have been submitted yet"}
                        </p>
                        {searchTerm && (
                          <Button variant="outline" onClick={clearFilters}>
                            <X className="mr-2 h-4 w-4" />
                            Clear Filters
                          </Button>
                        )}
                      </div>
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
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="mr-1.5 h-4 w-4" /> Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Report
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete report {report.id}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteReport(report.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ReportHistory;
