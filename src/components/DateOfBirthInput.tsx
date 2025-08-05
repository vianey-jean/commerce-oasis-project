
import { Input } from '@/components/ui/input';
import { forwardRef } from 'react';

interface DateOfBirthInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const DateOfBirthInput = forwardRef<HTMLInputElement, DateOfBirthInputProps>(
  ({ value, onChange, className }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value;
      
      // Supprimer tous les caractères non numériques
      inputValue = inputValue.replace(/\D/g, '');
      
      // Formater automatiquement en dd/mm/yyyy
      if (inputValue.length >= 3 && inputValue.length <= 4) {
        inputValue = inputValue.slice(0, 2) + '/' + inputValue.slice(2);
      } else if (inputValue.length >= 5) {
        inputValue = inputValue.slice(0, 2) + '/' + inputValue.slice(2, 4) + '/' + inputValue.slice(4, 8);
      }
      
      onChange(inputValue);
    };

    return (
      <Input
        ref={ref}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="DD/MM/AAAA"
        maxLength={10}
        className={className}
      />
    );
  }
);

DateOfBirthInput.displayName = 'DateOfBirthInput';

export default DateOfBirthInput;
