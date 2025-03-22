
import { PropertyFormData } from "@/types/property";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { useEffect } from "react";

interface DescriptionSectionProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  setPendingChanges?: (pending: boolean) => void;
}

export function DescriptionSection({ formData, onFieldChange, setPendingChanges }: DescriptionSectionProps) {
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onFieldChange(name as keyof PropertyFormData, value);
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };

  // Initialize the editor with the description content
  const editor = useBlockNote({
    initialContent: formData.description 
      ? [{ type: "paragraph", content: formData.description }] 
      : [{ type: "paragraph", content: "" }],
  });

  // Update formData.description when editor content changes
  useEffect(() => {
    const handleEditorChange = () => {
      const markdown = editor.topLevelBlocks.map(block => {
        if (block.type === 'paragraph' && block.content) {
          return block.content;
        }
        return '';
      }).join('\n\n');
      
      onFieldChange('description', markdown);
      if (setPendingChanges) {
        setPendingChanges(true);
      }
    };

    // Subscribe to editor changes
    const unsubscribe = editor.onEditorContentChange(handleEditorChange);
    
    return () => {
      unsubscribe();
    };
  }, [editor, onFieldChange, setPendingChanges]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Description</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Textarea
            id="shortDescription"
            name="shortDescription"
            placeholder="Enter a brief summary of the property (displayed in listings)"
            value={formData.shortDescription || ''}
            onChange={handleTextareaChange}
            rows={2}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Full Description</Label>
          <div className="border rounded-md min-h-[300px]">
            <BlockNoteView editor={editor} theme="light" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
