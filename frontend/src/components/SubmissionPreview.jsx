import React from 'react';
import { ChevronRight } from 'lucide-react';

const PreviewItem = ({ question, prefix }) => {
  return (
    <div className="mb-6">
      <div className="flex items-start gap-3">
        <div className="mt-1.5">
          <ChevronRight className="w-5 h-5 text-[#6750A4] dark:text-[#D0BCFF]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-semibold text-[#1D1B20] dark:text-[#E6E0E9] text-lg">Q{prefix}</span>
            <span className="text-xs px-3 py-1 bg-[#EADDFF] dark:bg-[#4F378B] text-[#21005D] dark:text-[#EADDFF] rounded-full font-medium">
              {question.type}
            </span>
          </div>
          <p className="text-[#49454F] dark:text-[#CAC4D0] text-lg mb-3 leading-relaxed">
            {question.text || <span className="italic opacity-60">Empty Question</span>}
          </p>
          
          {question.type === 'True/False' && question.answer && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4F1F8] dark:bg-[#1D1B20] rounded-[8px] mb-4 border border-[#CAC4D0]/50 dark:border-[#49454F]/50">
              <span className="text-sm font-medium text-[#49454F] dark:text-[#CAC4D0]">Expected Answer:</span>
              <span className="text-sm font-semibold text-[#6750A4] dark:text-[#D0BCFF]">
                {question.answer}
              </span>
            </div>
          )}

          {question.children && question.children.length > 0 && (
            <div className="mt-4 pl-8 border-l-[2px] border-[#EADDFF] dark:border-[#4F378B]/50">
              {question.children.map((child, index) => (
                <PreviewItem
                  key={child.id}
                  question={child}
                  prefix={`${prefix}.${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SubmissionPreview = ({ questions }) => {
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12 text-[#49454F] dark:text-[#CAC4D0] text-lg">
        No questions to display.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {questions.map((q, index) => (
        <div key={q.id} className="pb-6 mb-6 border-b border-[#CAC4D0]/30 dark:border-[#49454F]/30 last:border-0 last:pb-0 last:mb-0">
          <PreviewItem question={q} prefix={`${index + 1}`} />
        </div>
      ))}
    </div>
  );
};

export default SubmissionPreview;
