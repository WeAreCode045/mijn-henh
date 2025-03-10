import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useSubmissions } from '../communications/useSubmissions';
import { SubmissionDetail } from '../communications/SubmissionDetail';

// Let's ensure the Submission type is fully defined
interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiryType: string;
  createdAt: string;
  isRead: boolean;
  // Add any other fields needed
}

export function CommunicationsTabContent({ property }: { property: any }) {
  // Use a proper empty submission object
  const emptySubmission: Submission = {
    id: '',
    name: '',
    email: '',
    phone: '',
    message: '',
    inquiryType: '',
    createdAt: '',
    isRead: false
  };
  
  const [selectedSubmission, setSelectedSubmission] = useState<Submission>(emptySubmission);
  const { submissions, isLoading, error, markAsRead } = useSubmissions();

  const handleSelectSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
  };
  
  // Fix the comparison to check for ID property
  const isSelected = (submission: Submission) => {
    return selectedSubmission.id === submission.id;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Tabs defaultValue="inquiries" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
        <TabsTrigger value="submission-detail" disabled={!selectedSubmission.id}>Submission Detail</TabsTrigger>
      </TabsList>
      <TabsContent value="inquiries">
        <Card>
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
            <CardDescription>
              Here are the most recent inquiries for this property.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className={`border rounded-md p-4 mb-2 cursor-pointer ${isSelected(submission) ? 'bg-accent' : ''}`}
                onClick={() => handleSelectSubmission(submission)}
              >
                <h3 className="text-lg font-semibold">{submission.name}</h3>
                <p className="text-sm">{submission.email}</p>
                <p className="text-sm">{submission.message.substring(0, 50)}...</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="submission-detail">
        {selectedSubmission.id ? (
          <SubmissionDetail submission={selectedSubmission} />
        ) : (
          <div>No submission selected.</div>
        )}
      </TabsContent>
    </Tabs>
  );
}
