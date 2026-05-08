import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';
import QuestionItem from './components/QuestionItem';
import SubmissionPreview from './components/SubmissionPreview';
import { PlusCircle, Send, Sun, Moon, ArrowLeft } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'dynamic_form_questions';
const THEME_STORAGE_KEY = 'dynamic_form_theme';

function App() {
  const [questions, setQuestions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setQuestions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved questions", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(questions));
  }, [questions]);

  // Apply dark mode class to HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    }
  }, [isDarkMode]);

  const handleAddQuestion = () => {
    const newQuestion = {
      id: uuidv4(),
      text: '',
      type: 'Short Answer',
      answer: '',
      children: []
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleDeleteQuestion = (idToDelete) => {
    const deleteRecursive = (list) => {
      return list.filter(q => q.id !== idToDelete).map(q => ({
        ...q,
        children: deleteRecursive(q.children)
      }));
    };
    setQuestions(deleteRecursive(questions));
  };

  const handleUpdateQuestion = (updatedQuestion) => {
    const updateRecursive = (list) => {
      return list.map(q => {
        if (q.id === updatedQuestion.id) {
          return updatedQuestion;
        }
        return {
          ...q,
          children: updateRecursive(q.children)
        };
      });
    };
    setQuestions(updateRecursive(questions));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    // We only support reordering top-level parent questions
    if (result.type === 'PARENT_QUESTION') {
      const items = Array.from(questions);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setQuestions(items);
    }
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F4F1F8] dark:bg-[#141218] text-[#1D1B20] dark:text-[#E6E0E9] py-10 px-4 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight">Form Submission Preview</h1>
            <button
              onClick={() => setIsSubmitted(false)}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#EADDFF] dark:bg-[#4F378B] text-[#21005D] dark:text-[#EADDFF] rounded-full hover:bg-[#D0BCFF] dark:hover:bg-[#4F378B]/80 transition-colors shadow-sm font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Edit
            </button>
          </div>
          <div className="bg-[#FEF7FF] dark:bg-[#2B2930] rounded-[24px] shadow-sm p-8 transition-colors duration-300">
            <SubmissionPreview questions={questions} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F1F8] dark:bg-[#141218] py-10 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleTheme}
            className="p-3 bg-[#EADDFF] dark:bg-[#4F378B] text-[#21005D] dark:text-[#EADDFF] rounded-full hover:bg-[#D0BCFF] dark:hover:bg-[#4F378B]/80 transition-all shadow-sm"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="bg-[#FEF7FF] dark:bg-[#2B2930] rounded-[28px] shadow-md overflow-hidden transition-colors duration-300">
          <div className="p-5 sm:p-8 pb-5 sm:pb-6 border-b border-[#CAC4D0] dark:border-[#49454F] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-medium text-[#1D1B20] dark:text-[#E6E0E9] tracking-tight">Dynamic Form Builder</h1>
            <button
              onClick={() => setIsSubmitted(true)}
              disabled={questions.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] rounded-full hover:bg-[#6750A4]/90 dark:hover:bg-[#D0BCFF]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm active:scale-[0.98]"
            >
              <Send className="w-5 h-5" />
              Submit Form
            </button>
          </div>

          <div className="p-4 sm:p-8">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="parent-questions" type="PARENT_QUESTION">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-6"
                  >
                    {questions.map((q, index) => (
                      <QuestionItem
                        key={q.id}
                        question={q}
                        index={index}
                        prefix={`${index + 1}`}
                        onDelete={handleDeleteQuestion}
                        onUpdate={handleUpdateQuestion}
                        isParent={true}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {questions.length === 0 && (
              <div className="text-center py-16 border-2 border-dashed border-[#CAC4D0] dark:border-[#49454F] rounded-[24px] mb-6">
                <p className="text-[#49454F] dark:text-[#CAC4D0] text-lg mb-2">No questions added yet.</p>
                <p className="text-[#49454F]/70 dark:text-[#CAC4D0]/70">Click the button below to start building your form.</p>
              </div>
            )}

            <button
              onClick={handleAddQuestion}
              className="mt-6 flex items-center justify-center w-full gap-2 px-4 py-4 border-2 border-dashed border-[#6750A4]/30 dark:border-[#D0BCFF]/30 text-[#6750A4] dark:text-[#D0BCFF] bg-transparent hover:bg-[#6750A4]/5 dark:hover:bg-[#D0BCFF]/5 rounded-[24px] transition-all font-medium text-lg active:scale-[0.99]"
            >
              <PlusCircle className="w-6 h-6" />
              Add New Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
