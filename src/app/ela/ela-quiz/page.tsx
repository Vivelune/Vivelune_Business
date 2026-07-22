"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// 40 Grade 6 ELA Questions
const QUESTIONS = [
  { q: "Which word is a synonym for 'abundant'?", options: ["A) Scarce", "B) Plentiful", "C) Empty", "D) Rare"], correct: 1 },
  { q: "Identify the figurative language: 'The wind howled in the night.'", options: ["A) Simile", "B) Metaphor", "C) Personification", "D) Hyperbole"], correct: 2 },
  { q: "Choose the correct spelling:", options: ["A) Accomodate", "B) Acommodate", "C) Accommodate", "D) Acomodate"], correct: 2 },
  { q: "What is the main purpose of a persuasive essay?", options: ["A) To entertain", "B) To inform", "C) To convince", "D) To describe"], correct: 2 },
  { q: "Which of these is a coordinating conjunction?", options: ["A) Because", "B) Although", "C) And", "D) Since"], correct: 2 },
  { q: "What does the prefix 'un-' mean?", options: ["A) Again", "B) Before", "C) Not", "D) After"], correct: 2 },
  { q: "Identify the noun in this sentence: 'The quick dog ran fast.'", options: ["A) Quick", "B) Dog", "C) Ran", "D) Fast"], correct: 1 },
  { q: "What is the climax of a story?", options: ["A) The beginning", "B) The turning point", "C) The resolution", "D) The setting"], correct: 1 },
  { q: "Which sentence is punctuated correctly?", options: ["A) Let's eat grandma.", "B) Lets eat, grandma.", "C) Let's eat, grandma.", "D) Lets eat grandma."], correct: 2 },
  { q: "Identify the figurative language: 'He is as strong as an ox.'", options: ["A) Simile", "B) Metaphor", "C) Personification", "D) Idiom"], correct: 0 },
  { q: "What is the antonym of 'expand'?", options: ["A) Grow", "B) Shrink", "C) Stretch", "D) Build"], correct: 1 },
  { q: "Which word contains a suffix?", options: ["A) Return", "B) Happiness", "C) Unhappy", "D) Prepay"], correct: 1 },
  { q: "Identify the verb in this sentence: 'She sings beautifully.'", options: ["A) She", "B) Sings", "C) Beautifully", "D) None"], correct: 1 },
  { q: "What is the theme of a story?", options: ["A) The characters", "B) The time and place", "C) The central message", "D) The conflict"], correct: 2 },
  { q: "Choose the correct homophone: 'I need to ___ a new book.'", options: ["A) By", "B) Bye", "C) Buy", "D) Bi"], correct: 2 },
  { q: "What does 'bene-' mean in the word 'beneficial'?", options: ["A) Bad", "B) Good", "C) Time", "D) Water"], correct: 1 },
  { q: "Identify the adjective: 'The tall tree cast a shadow.'", options: ["A) Tree", "B) Tall", "C) Cast", "D) Shadow"], correct: 1 },
  { q: "What is the first person point of view?", options: ["A) Using 'he/she'", "B) Using 'they'", "C) Using 'I/me'", "D) Using 'you'"], correct: 2 },
  { q: "Which word means 'to form a mental image'?", options: ["A) Dictate", "B) Visualize", "C) Predict", "D) Summarize"], correct: 1 },
  { q: "Identify the adverb: 'He walked slowly to the door.'", options: ["A) Walked", "B) Slowly", "C) Door", "D) He"], correct: 1 },
  { q: "What is a stanza?", options: ["A) A paragraph in a story", "B) A group of lines in a poem", "C) The title of a book", "D) The author's name"], correct: 1 },
  { q: "Which word is an antonym for 'courageous'?", options: ["A) Brave", "B) Fearful", "C) Bold", "D) Heroic"], correct: 1 },
  { q: "Identify the preposition: 'The cat is under the table.'", options: ["A) Cat", "B) Is", "C) Under", "D) Table"], correct: 2 },
  { q: "What does the root 'chron' mean?", options: ["A) Color", "B) Time", "C) Star", "D) Water"], correct: 1 },
  { q: "Which sentence uses a metaphor?", options: ["A) The snow was a white blanket.", "B) The snow fell gently.", "C) The snow was like a blanket.", "D) The cold snow melted."], correct: 0 },
  { q: "What is an inference?", options: ["A) A wild guess", "B) A stated fact", "C) A conclusion based on evidence", "D) A summary"], correct: 2 },
  { q: "Choose the correct spelling:", options: ["A) Definately", "B) Definitly", "C) Definitely", "D) Defenitely"], correct: 2 },
  { q: "Identify the proper noun: 'We visited the museum in London.'", options: ["A) Visited", "B) Museum", "C) In", "D) London"], correct: 3 },
  { q: "What is the resolution of a story?", options: ["A) The beginning", "B) The climax", "C) The end where loose ends are tied", "D) The main problem"], correct: 2 },
  { q: "Which word means 'to pull out or remove'?", options: ["A) Extract", "B) Contract", "C) Attract", "D) Distract"], correct: 0 },
  { q: "Identify the pronoun: 'They went to the park.'", options: ["A) Went", "B) To", "C) Park", "D) They"], correct: 3 },
  { q: "What does the prefix 'mis-' mean?", options: ["A) Again", "B) Wrongly", "C) Before", "D) Over"], correct: 1 },
  { q: "Which of these is a fragment?", options: ["A) She ran fast.", "B) Because it rained.", "C) The sun is hot.", "D) Dogs bark."], correct: 1 },
  { q: "What is a dialogue?", options: ["A) A descriptive paragraph", "B) A conversation between characters", "C) The main conflict", "D) The author's bio"], correct: 1 },
  { q: "Choose the correct word: 'The ___ is very bright today.'", options: ["A) Son", "B) Sun", "C) Sin", "D) San"], correct: 1 },
  { q: "What does the root 'aud' mean?", options: ["A) See", "B) Hear", "C) Write", "D) Speak"], correct: 1 },
  { q: "Identify the conjunction: 'I like apples and oranges.'", options: ["A) I", "B) Like", "C) And", "D) Apples"], correct: 2 },
  { q: "What is alliteration?", options: ["A) Words that rhyme", "B) Words starting with the same sound", "C) Exaggerated statements", "D) Comparing two things"], correct: 1 },
  { q: "Which word is a synonym for 'furious'?", options: ["A) Happy", "B) Angry", "C) Sad", "D) Tired"], correct: 1 },
  { q: "Identify the declarative sentence:", options: ["A) Stop right there!", "B) Did you eat?", "C) The sky is blue.", "D) What a great day!"], correct: 2 },
];

export default function QuizPage() {
  // Store the user's selected answer index for each question
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const handleSelect = (qIndex: number, optIndex: number) => {
    if (answers[qIndex] !== undefined) return; // Prevent changing answer once selected
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const score = Object.keys(answers).filter(
    (qIndex) => answers[Number(qIndex)] === QUESTIONS[Number(qIndex)].correct
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-800">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Grade 6 <span className="text-teal-600">ELA Assessment</span>
          </h1>
          <div className="bg-white inline-block px-6 py-3 rounded-full shadow-sm border border-slate-200">
            <p className="font-bold text-slate-600">
              Questions Answered: <span className="text-teal-600">{Object.keys(answers).length}</span> / 40
            </p>
            {Object.keys(answers).length > 0 && (
              <p className="text-sm font-medium mt-1">
                Current Score: {score} Correct
              </p>
            )}
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-8">
          {QUESTIONS.map((item, qIndex) => {
            const hasAnswered = answers[qIndex] !== undefined;
            const selectedOpt = answers[qIndex];
            const isCorrect = selectedOpt === item.correct;

            return (
              <motion.div 
                key={qIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200"
              >
                <div className="flex gap-4 items-start mb-6">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-teal-100 text-teal-700 font-bold rounded-full text-sm">
                    {qIndex + 1}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 mt-1 leading-snug">
                    {item.q}
                  </h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 pl-0 md:pl-12">
                  {item.options.map((opt, optIndex) => {
                    let buttonClass = "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100";
                    
                    if (hasAnswered) {
                      if (optIndex === item.correct) {
                        // The correct answer always highlights green after selection
                        buttonClass = "bg-green-100 border-green-500 text-green-800 ring-2 ring-green-500/20";
                      } else if (optIndex === selectedOpt && !isCorrect) {
                        // The wrong answer selected by user highlights red
                        buttonClass = "bg-red-100 border-red-500 text-red-800 ring-2 ring-red-500/20";
                      } else {
                        // Other unselected wrong answers get muted
                        buttonClass = "bg-slate-50 border-slate-200 text-slate-400 opacity-50";
                      }
                    }

                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleSelect(qIndex, optIndex)}
                        disabled={hasAnswered}
                        className={`text-left px-5 py-4 rounded-xl border font-medium transition-all duration-200 ${buttonClass} ${!hasAnswered ? "active:scale-95 cursor-pointer" : "cursor-default"}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Message */}
                {hasAnswered && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className={`mt-6 pl-0 md:pl-12 font-bold text-sm flex items-center gap-2 ${isCorrect ? "text-green-600" : "text-red-500"}`}
                  >
                    {isCorrect ? (
                      <><span>🎉</span> Brilliant! That is correct.</>
                    ) : (
                      <><span>💡</span> Not quite! The correct answer is {item.options[item.correct].split(")")[0]}.</>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {Object.keys(answers).length === 40 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 p-8 bg-teal-600 rounded-3xl text-center text-white shadow-xl"
          >
            <h2 className="text-3xl font-black mb-2">Quiz Complete!</h2>
            <p className="text-teal-100 text-lg">You scored {score} out of 40.</p>
          </motion.div>
        )}
      </div>
    </main>
  );
}