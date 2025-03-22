
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

  // Initialize the editor with default settings
  const editor = useBlockNote({
    initialContent: null, // Start with empty content
    defaultStyles: false,
  });

  // Set initial content when component mounts or formData changes
  useEffect(() => {
    if (formData.description && editor) {
      try {
        // Simple approach: set editor content based on the text
        const lines = formData.description.split('\n\n');
        
        // Clear existing content
        const allBlocks = editor.topLevelBlocks;
        if (allBlocks.length > 0) {
          editor.removeBlocks(allBlocks);
        }
        
        // Add paragraphs for each line
        lines.forEach((line, index) => {
          if (line.trim() !== '') {
            editor.insertBlocks([
              {
                type: "paragraph",
                content: [{ type: "text", text: line }]
              }
            ], index === 0 ? "beginning" : "end");
          }
        });
      } catch (error) {
        console.error("Error setting editor content:", error);
      }
    }
  }, [formData.id]); // Only run when property ID changes

  // Update formData.description when editor content changes
  useEffect(() => {
    const handleEditorChange = () => {
      try {
        // Extract text content from editor blocks
        const textContent = editor.topLevelBlocks
          .map(block => {
            // Extract text from inline content
            if (block.content) {
              const blockText = block.content
                .filter(item => item.type === 'text')
                .map(item => (item as any).text || '')
                .join('');
              return blockText;
            }
            return '';
          })
          .filter(text => text.trim() !== '')
          .join('\n\n');
        
        onFieldChange('description', textContent);
        if (setPendingChanges) {
          setPendingChanges(true);
        }
      } catch (error) {
        console.error("Error updating from editor:", error);
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
          <div className="border rounded-md min-h-[400px]">
            <BlockNoteView editor={editor} theme="light" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
