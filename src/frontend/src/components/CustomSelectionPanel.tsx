import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ListChecks } from 'lucide-react';

interface CustomSelectionPanelProps {
  onSubmit: (count: number) => void;
}

export function CustomSelectionPanel({ onSubmit }: CustomSelectionPanelProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(inputValue, 10);

    if (isNaN(count) || count <= 0) {
      alert('Please enter a valid positive number');
      return;
    }

    onSubmit(count);
    setInputValue('');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="default">
          <ListChecks className="w-4 h-4 mr-2" />
          Custom Selection
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Select Multiple Rows</h4>
            <p className="text-xs text-muted-foreground">
              Enter the number of rows to select starting from the first row
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="row-count">Number of Rows</Label>
            <Input
              id="row-count"
              type="number"
              min="1"
              placeholder="e.g., 25"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Apply Selection
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
