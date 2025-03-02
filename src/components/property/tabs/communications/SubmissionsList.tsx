
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Search } from "lucide-react";
import { SubmissionItem } from "./SubmissionItem";

type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  inquiry_type: string;
  message: string;
  created_at: string;
  is_read: boolean;
  response?: string;
  response_date?: string;
};

interface SubmissionsListProps {
  submissions: Submission[];
  isLoading: boolean;
  selectedSubmission: Submission | null;
  onSelectSubmission: (submission: Submission) => void;
  onMarkAsRead: (id: string) => void;
}

export function SubmissionsList({ 
  submissions, 
  isLoading, 
  selectedSubmission, 
  onSelectSubmission,
  onMarkAsRead
}: SubmissionsListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubmissions = submissions.filter(submission =>
    submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Contact Submissions</span>
          <span className="text-sm font-normal text-muted-foreground">
            {submissions.length} total
          </span>
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search submissions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            {searchTerm ? "No matching submissions found" : "No submissions yet"}
          </p>
        ) : (
          <div className="space-y-2">
            {filteredSubmissions.map((submission) => (
              <SubmissionItem
                key={submission.id}
                submission={submission}
                isSelected={selectedSubmission?.id === submission.id}
                onClick={() => onSelectSubmission(submission)}
                onMarkAsRead={onMarkAsRead}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
