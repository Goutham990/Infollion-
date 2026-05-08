import React, { useState, useRef, useEffect } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';
import { GripVertical, Trash2, Plus, ChevronDown } from 'lucide-react';

const QuestionItem = ({ question, index, prefix, onDelete, onUpdate, isParent }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (field, value) => {
    onUpdate({ ...question, [field]: value });
  };

  const handleAddChild = () => {
    const newChild = {
      id: uuidv4(),
      text: '',
      type: 'Short Answer',
      answer: '',
      children: []
    };
    onUpdate({ ...question, children: [...question.children, newChild] });
  };

  const content = (
    <div className={`bg-[#FEF7FF] dark:bg-[#2B2930] rounded-[24px] ${isParent ? 'border border-[#CAC4D0] dark:border-[#49454F] shadow-sm hover:shadow-md' : ''} p-5 transition-all duration-300`}>
      <div className="flex items-start gap-4">
        {isParent && (
          <div className="mt-3 text-[#49454F] dark:text-[#CAC4D0] cursor-grab active:cursor-grabbing hover:text-[#1D1B20] dark:hover:text-[#E6E0E9] drag-handle">
            <GripVertical className="w-6 h-6" />
          </div>
        )}
        
        <div className="flex-1 space-y-5">
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#49454F] dark:text-[#CAC4D0] mb-1.5 ml-1">
                Question {prefix}
              </label>
              <input
                type="text"
                value={question.text}
                onChange={(e) => handleChange('text', e.target.value)}
                placeholder="Enter your question here..."
                className="w-full px-4 py-3.5 bg-[#F4F1F8] dark:bg-[#1D1B20] text-[#1D1B20] dark:text-[#E6E0E9] border-b-2 border-[#49454F]/20 dark:border-[#CAC4D0]/20 rounded-t-[4px] focus:ring-0 focus:border-[#6750A4] dark:focus:border-[#D0BCFF] transition-all outline-none placeholder-[#49454F]/50 dark:placeholder-[#CAC4D0]/50"
              />
            </div>
            <div className="w-56">
              <label className="block text-sm font-medium text-[#49454F] dark:text-[#CAC4D0] mb-1.5 ml-1">
                Type
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3.5 bg-[#F4F1F8] dark:bg-[#1D1B20] text-[#1D1B20] dark:text-[#E6E0E9] border-b-2 border-[#49454F]/20 dark:border-[#CAC4D0]/20 rounded-t-[4px] focus:outline-none focus:border-[#6750A4] dark:focus:border-[#D0BCFF] transition-all flex items-center justify-between"
                >
                  <span className="truncate">{question.type}</span>
                  <ChevronDown className={`w-5 h-5 text-[#49454F] dark:text-[#CAC4D0] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-[#FEF7FF] dark:bg-[#2B2930] rounded-[4px] shadow-md border border-[#CAC4D0]/30 dark:border-[#49454F]/30 overflow-hidden py-1">
                    {['Short Answer', 'True/False'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          handleChange('type', option);
                          if (option !== 'True/False') {
                            handleChange('answer', '');
                          }
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-[#1D1B20]/5 dark:hover:bg-[#E6E0E9]/5 transition-colors ${question.type === option ? 'bg-[#EADDFF]/50 dark:bg-[#4F378B]/50 text-[#21005D] dark:text-[#EADDFF]' : 'text-[#1D1B20] dark:text-[#E6E0E9]'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={() => onDelete(question.id)}
              className="mt-7 p-2.5 text-[#B3261E] dark:text-[#F2B8B5] hover:bg-[#B3261E]/10 dark:hover:bg-[#F2B8B5]/10 rounded-full transition-colors active:scale-95"
              title="Delete Question"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>

          {question.type === 'True/False' && (
            <div className="flex items-center gap-6 bg-[#EADDFF]/30 dark:bg-[#4F378B]/20 p-4 rounded-[16px]">
              <label className="text-sm font-medium text-[#1D1B20] dark:text-[#E6E0E9]">Select expected answer:</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input
                      type="radio"
                      name={`answer-${question.id}`}
                      value="True"
                      checked={question.answer === 'True'}
                      onChange={(e) => handleChange('answer', e.target.value)}
                      className="peer appearance-none w-5 h-5 border-2 border-[#49454F] dark:border-[#CAC4D0] rounded-full checked:border-[#6750A4] dark:checked:border-[#D0BCFF] transition-colors cursor-pointer"
                    />
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-[#6750A4] dark:bg-[#D0BCFF] scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
                  </div>
                  <span className="text-[15px] text-[#1D1B20] dark:text-[#E6E0E9] group-hover:text-[#6750A4] dark:group-hover:text-[#D0BCFF] transition-colors">True</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input
                      type="radio"
                      name={`answer-${question.id}`}
                      value="False"
                      checked={question.answer === 'False'}
                      onChange={(e) => handleChange('answer', e.target.value)}
                      className="peer appearance-none w-5 h-5 border-2 border-[#49454F] dark:border-[#CAC4D0] rounded-full checked:border-[#6750A4] dark:checked:border-[#D0BCFF] transition-colors cursor-pointer"
                    />
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-[#6750A4] dark:bg-[#D0BCFF] scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
                  </div>
                  <span className="text-[15px] text-[#1D1B20] dark:text-[#E6E0E9] group-hover:text-[#6750A4] dark:group-hover:text-[#D0BCFF] transition-colors">False</span>
                </label>
              </div>
            </div>
          )}

          {question.type === 'True/False' && question.answer === 'True' && (
            <div className="pt-2">
              <button
                onClick={handleAddChild}
                className="flex items-center gap-2 text-[15px] font-medium text-[#6750A4] dark:text-[#D0BCFF] hover:bg-[#6750A4]/10 dark:hover:bg-[#D0BCFF]/10 px-4 py-2 rounded-full transition-colors active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Add Nested Question
              </button>
            </div>
          )}

          {question.children && question.children.length > 0 && (
            <div className="mt-6 pl-6 border-l-[3px] border-[#EADDFF] dark:border-[#4F378B] space-y-5">
              {question.children.map((child, childIndex) => (
                <QuestionItem
                  key={child.id}
                  question={child}
                  index={childIndex}
                  prefix={`${prefix}.${childIndex + 1}`}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  isParent={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isParent) {
    return (
      <Draggable draggableId={question.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="mb-4"
          >
            {content}
          </div>
        )}
      </Draggable>
    );
  }

  return <div className="mb-4 last:mb-0">{content}</div>;
};

export default QuestionItem;
