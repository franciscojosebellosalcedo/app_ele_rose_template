import React, { useState, useEffect, useRef } from 'react';
import { Form, Dropdown } from 'react-bootstrap';

interface Suggestion {
  label: string;
  value: string;
}

interface AutocompleteProps {
  options: Suggestion[];
  onSelect: (selected: Suggestion) => void;
  label: string;
  isLabelTitle: boolean;
  className: string;
  defaultValue: string;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ options, onSelect, label, isLabelTitle, className, defaultValue }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>(options);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {

    const defaultOption = options.find((option) => option.value === defaultValue);

    if (defaultOption) {

      setInputValue(defaultOption.label);

    }

  }, [defaultValue, options]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {

      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(value.toLowerCase())
      );

      setFilteredSuggestions(filtered);

    } else {

      setFilteredSuggestions(options);

    }

    setShowSuggestions(true);
    setActiveIndex(-1);
  };

  const handleSelect = (selectedSuggestion: Suggestion) => {

    setInputValue(selectedSuggestion.label);
    setShowSuggestions(false);
    onSelect(selectedSuggestion);

  };

  const handleFocus = () => {

    setFilteredSuggestions(options);
    setShowSuggestions(true);

  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {

      e.preventDefault();

      setActiveIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : prev));

    } else if (e.key === 'ArrowUp') {

      e.preventDefault();

      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));

    } else if (e.key === 'Enter') {

      e.preventDefault();

      if (activeIndex >= 0) {
        handleSelect(filteredSuggestions[activeIndex]);
      }

    }
  };

  useEffect(() => {
    const checkDropdownDirection = () => {
      if (inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        setDropdownDirection(spaceBelow < 200 && spaceAbove > spaceBelow ? 'up' : 'down');
      }
    };

    checkDropdownDirection();
    window.addEventListener('resize', checkDropdownDirection);
    return () => window.removeEventListener('resize', checkDropdownDirection);
  }, [showSuggestions]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {label && isLabelTitle === true && (
        <label className='mb-2' htmlFor="select">{label}</label>
      )}
      <Form.Control
        className={`form-select ${className}`}
        type="text"
        id='select'
        ref={inputRef}
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
      />
      {showSuggestions && (
        <Dropdown.Menu
          show
          style={{
            width: '100%',
            position: 'absolute',
            top: dropdownDirection === 'down' ? '105%' : 'auto',
            bottom: dropdownDirection === 'up' ? '69%' : 'auto',
          }}
        >
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((suggestion, index) => (
              <Dropdown.Item
                key={suggestion.value}
                active={index === activeIndex}
                onClick={() => handleSelect(suggestion)}
              >
                {suggestion.label}
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item disabled>No hay resultado</Dropdown.Item>
          )}
        </Dropdown.Menu>
      )}
    </div>
  );
};

export default Autocomplete;
