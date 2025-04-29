/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
 import { useNavigate } from "react-router-dom";
 import { FaArrowLeft, FaPlus, FaCheck, FaTimes, FaEdit, FaTrash, FaYoutube } from 'react-icons/fa';
 import "../styles/LessonsPage.css";
 
 const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
 
 const DEFAULT_LESSONS = [
  { id: "whole-numbers", title: "Whole Numbers", description: "These are numbers you use to count things, like 0, 1, 2, 3 — no parts, just whole things." },
  { id: "fractions", title: "Fractions", description: "Fractions are when you split something into equal parts, like cutting a pizza into slices." },
  { id: "measurements", title: "Measurements", description: "We use measurements to find out how long, heavy, or full something is — like measuring your height or water in a bottle." },
  { id: "decimals", title: "Decimals", description: " Decimals are numbers with dots that show small parts, like how money shows cents (₱1.25 = one peso and 25 centavos)." },
  ];

 const LessonsPage = ({ userRole }) => {
   const navigate = useNavigate();
   const [lessons, setLessons] = useState([]);
  //  const [enabledLessonId, setEnabledLessonId] = useState(null); 
  //  const [lessonDifficulties, setLessonDifficulties] = useState({});
   const [selectedLesson, setSelectedLesson] = useState(null);
   const [currentRole, setCurrentRole] = useState(userRole);
   const [expandedLesson, setExpandedLesson] = useState(null);
   const [newKeypoint, setNewKeypoint] = useState("");
   const [newQuestion, setNewQuestion] = useState({ question: "", choices: ["", "", ""], correctAnswer: "" });
   const [studentAnswers, setStudentAnswers] = useState({});
   const [editingQuestionId, setEditingQuestionId] = useState(null);
   const [editedQuestion, setEditedQuestion] = useState({ question: "", choices: ["", "", ""], correctAnswer: "" });
   const [editingKeypointId, setEditingKeypointId] = useState(null);
   const [editedKeypoint, setEditedKeypoint] = useState("");
   const [answerFeedback, setAnswerFeedback] = useState({});
   const [attemptCount, setAttemptCount] = useState(0);
   const [lessonCompleted, setLessonCompleted] = useState(false);
 
   useEffect(() => {
     setCurrentRole(userRole);
   }, [userRole]);
 
    const fetchLessons = async () => {
        try {
          const response = await fetch(`${API_URL}/lessons`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });
          const data = await response.json();
          setLessons(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Error fetching lessons:", error);
        }
    };
    
    useEffect(() => {
      fetchLessons();
    }, [currentRole]);

    useEffect(() => {
      const storedLessonId = localStorage.getItem("selectedLessonId");
      if (storedLessonId) {
        const matchedLesson = lessons.find((l) => l.id === storedLessonId);
        if (matchedLesson) {
          handleViewLesson(matchedLesson);
        }
      }
    }, [lessons]);
    
  const toggleLessonExpand = (lessonId) => {
     setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
   };
 
   const handleViewLesson = async (lesson) => {
    try {
      localStorage.setItem("selectedLessonId", lesson.id);
      setLessonCompleted(false); // 🔥 Always reset first when viewing any lesson
  
      const res = await fetch(`${API_URL}/lessons/${lesson.id}`);
      const fullLesson = await res.json();
      setSelectedLesson({
        id: lesson.id,
        ...fullLesson,
      });
  
      const school_id = JSON.parse(localStorage.getItem("userProfile"))?.school_id;
      const scoreRes = await fetch(`${API_URL}/lessons/${lesson.id}/${school_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
            const scoreData = await scoreRes.json();
  
      if (scoreData && scoreData.answers && Object.keys(scoreData.answers).length > 0) {
        setAttemptCount(scoreData.attempts || 0);
  
        const restoredAnswers = {};
        fullLesson.questions.forEach((q) => {
          restoredAnswers[q.id] = scoreData.answers[q.id] || "";
        });
        setStudentAnswers(restoredAnswers);
        
        setTimeout(() => {
          setStudentAnswers(restoredAnswers);
        }, 100);

        if (scoreData.score === fullLesson.questions.length || scoreData.attempts >= 3) {
          setLessonCompleted(true);
  
          const feedback = {};
          fullLesson.questions.forEach((q) => {
            if (scoreData.answers[q.id]) {
              feedback[q.id] = (scoreData.answers[q.id].trim().toLowerCase() === q.correctAnswer.trim().toLowerCase())
                ? "✅ Correct!"
                : "❌ Incorrect";
            }
          });
          setAnswerFeedback(feedback);
        }
      } else {
        // 🔥 If no answers yet, reset state to fresh
        setStudentAnswers({});
        setAttemptCount(0);
        setAnswerFeedback({});
      }
  
    } catch (error) {
      console.error("Failed to load lesson or score:", error);
    }
  };  
  
   const handleAddKeypoint = async () => {
     if (!newKeypoint.trim()) return;
     try {
       const res = await fetch(`${API_URL}/lessons/${selectedLesson.id}/keypoints`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         Authorization: `Bearer ${localStorage.getItem("authToken")}`,
         body: JSON.stringify({ content: newKeypoint }),
       });
       const added = await res.json();
       setSelectedLesson((prev) => ({
        ...prev,
        keypoints: [...(prev.keypoints || []), { id: added.id, content: added.content }],
      }));      
       setNewKeypoint("");
     } catch (err) {
       console.error("Failed to add keypoint:", err);
     }
   };
 
   const handleEditKeypoint = async (id, updatedContent) => {
     try {
      await fetch(`${API_URL}/lessons/${selectedLesson.id}/keypoints/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ content: updatedContent }),
      });
       setSelectedLesson((prev) => ({
        ...prev,
        keypoints: prev.keypoints.map((kp) =>
          kp.id === id ? { ...kp, content: updatedContent } : kp
        ),
      }));    
      alert("Key Point updated successfully!");      
     } catch (err) {
       console.error('Edit failed:', err);
     }
   };
 
   const handleDeleteKeypoint = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this key point?");
    if (!confirmDelete) return;

    try {
      await fetch(`${API_URL}/lessons/${selectedLesson.id}/keypoints/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

     setSelectedLesson((prev) => ({
      ...prev,
      keypoints: prev.keypoints.filter((kp) => kp.id !== id),
    }));

    alert("🗑️ Key Point deleted successfully!");
    } catch (err) {
      console.error("❌ Failed to delete keypoint:", err);
      alert("❌ Failed to delete keypoint. Please try again.");
    }
  };
  
 
  const handleEditQuestion = async (id) => {
    try {
      const payload = {
        question: editedQuestion.question,
        choices: editedQuestion.choices,
        correctAnswer: editedQuestion.correctAnswer,
      };
  
      const response = await fetch(`${API_URL}/lessons/${selectedLesson.id}/questions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) throw new Error("Failed to update question");
  
      const refreshedLesson = await fetch(`${API_URL}/lessons/${selectedLesson.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
  
      const refreshedData = await refreshedLesson.json();
        setSelectedLesson((prev) => ({
        ...prev,
        questions: refreshedData.questions || [],
      }));
  
      setEditingQuestionId(null);
  
      alert("Question updated successfully!");
  
    } catch (error) {
      console.error("Edit failed:", error);
    }
  };
  
  
   const handleAddQuestion = async () => {
     const { question, choices, correctAnswer } = newQuestion;
     if (!question || choices.some((c) => !c) || !correctAnswer) return;
 
     try {
       const res = await fetch(`${API_URL}/lessons/${selectedLesson.id}/questions`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         Authorization: `Bearer ${localStorage.getItem("authToken")}`,
         body: JSON.stringify({ question, choices, correctAnswer }),
       });
       const added = await res.json();
       setSelectedLesson((prev) => ({
        ...prev,
        questions: [...(prev.questions || []), { id: added.id, question: added.question, choices: added.choices, correctAnswer: added.correctAnswer }],
      }));     
      
       setNewQuestion({ question: "", choices: ["", "", ""], correctAnswer: "" });
     } catch (err) {
       console.error("Failed to add question:", err);
     }
   };

   const handleDeleteQuestion = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this question?");
    if (!confirmDelete) return;

    try {
      await fetch(`${API_URL}/lessons/${selectedLesson.id}/questions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",   
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,  
        },
      });
  
      setSelectedLesson((prev) => ({
        ...prev,
        questions: prev.questions.filter((q) => q.id !== id),
      }));
    
      alert("Question deleted successfully!");
      
    } catch (err) {
      console.error("Failed to delete question:", err);
    }
  };
  
   const handleAnswerChange = (questionId, answer) => {
     setStudentAnswers((prev) => ({ ...prev, [questionId]: answer }));
   };
 
   const handleSubmitAnswers = async () => {
    if (lessonCompleted) return;
    try {
      const school_id = JSON.parse(localStorage.getItem("userProfile"))?.school_id;
      const answers = studentAnswers;
      const feedback = {};
      let score = 0;

      selectedLesson.questions.forEach((q) => {
        const selected = answers[q.id];
        if (selected && selected.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase()) {
          feedback[q.id] = "✅ Correct!";
          score++;
        } else {
          feedback[q.id] = "❌ Incorrect";
        }
      });
  
      setAnswerFeedback(feedback);
  
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);
  
      await fetch(`${API_URL}/lessons/${selectedLesson.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          answers: answers,
          school_id,
          attempts: newAttemptCount,
        }),
      });

      if (score === selectedLesson.questions.length || newAttemptCount >= 3) {
        setLessonCompleted(true);
        alert(`🎉 Lesson completed! You scored ${score}/${selectedLesson.questions.length}`);
      } else {
        alert(`Attempt ${newAttemptCount}: You got ${score} correct. Try again.`);
      }
    } catch (error) {
      console.error("Failed to submit answers:", error);
    }
  };

  //      old code inside the handleSubmitAnswers just incase.
  //      if (score === selectedLesson.questions.length || attemptCount + 1 >= 3) {
  //        setLessonCompleted(true);
  //        await fetch(`${API_URL}/lessons/${selectedLesson.id}/submit`, {
  //          method: "POST",
  //          headers: {
  //            "Content-Type": "application/json",
  //            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  //          },
  //          body: JSON.stringify({
  //            answers: studentAnswers,
  //            school_id,
  //          }),
  //        });
  //        alert(`Lesson completed! You scored ${score}/${selectedLesson.questions.length}${
  //          attemptCount + 1 >= 3 && score < selectedLesson.questions.length ? " (3 attempts used)" : ""
  //        }`);
  //      } else {
  //        alert(`Attempt ${attemptCount + 1}: You got ${score} correct. Try again.`);
  //      }
  //    } catch (error) {
  //      console.error("Failed to submit answers:", error);
  //    }
  //  };

  const toggleLessonEnable = async (lessonId, isEnabled) => {
    try {
      await fetch(`${API_URL}/lessons/${lessonId}/enable`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        body: JSON.stringify({ isEnabled }),
      });
    } catch (error) {
      console.error("Failed to toggle lesson enable", error);
    }
  };

  const handleEnableClick = async (lessonId, isCurrentlyEnabled) => {
    const newEnabledStatus = !isCurrentlyEnabled;
    await toggleLessonEnable(lessonId, newEnabledStatus);
    fetchLessons();
  };

  const changeLessonDifficulty = async (lessonId, difficulty) => {
    try {
      await fetch(`${API_URL}/lessons/${lessonId}/difficulty`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        body: JSON.stringify({ difficulty }),
      });
    } catch (error) {
      console.error("Failed to change lesson difficulty", error);
    }
  };

  const handleDifficultyClick = async (lessonId, newDifficulty) => {
    await changeLessonDifficulty(lessonId, newDifficulty);
    fetchLessons();
  };

  const renderLessonList = () => {
    const filteredLessons = currentRole === "student"
    ? lessons.filter((lesson) => lesson.isEnabled)
    : lessons;

    return(
     <div className="lesson-list-container">
       <div className="back-button-wrapper">
         <button className="back-button" onClick={() => navigate('/main-page')}>
           <FaArrowLeft className="back-icon" />
           <span className="back-text">Back to Dashboard</span>
         </button>
       </div>
 
       <div className="page-header">
         <h1 className="page-title">Math Lessons</h1>
         <p className="page-subtitle">Explore interactive math lessons designed for 4th graders</p>
       </div>
 
       <div className="lesson-grid">
       {filteredLessons.map((lesson) => (
        <div key={lesson.id} className="lesson-card" 
            onClick={() => toggleLessonExpand(lesson.id)}>
             <div className="card-icon">
               <span className="math-icon">🧮</span>
             </div>
             <h3>{lesson.title}</h3>
              {expandedLesson === lesson.id && (
                <div className="lesson-summary expanded">
                  <p className="lesson-description-preview">{lesson.description}</p>
                  {(userRole === "teacher" || userRole === "admin") && (
              <>
                <div className="card-top-row">
                <button
                  className={`enable-btn ${lesson.isEnabled ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnableClick(lesson.id, lesson.isEnabled);
                  }}
                >
                  {lesson.isEnabled ? "Enabled" : "Enable"}
                </button>
                </div>

                <div className="difficulty-buttons">
                  {["beginner", "advanced"].map((level) => (
                    <button
                      key={level}
                      className={`difficulty-btn ${
                        lesson.difficulty === level ? "active" : ""
                      }`}
                      disabled={!lesson.isEnabled}
                      onClick={async (e) => {
                        e.stopPropagation();
                        await handleDifficultyClick(lesson.id, level);  // ✅ using function
                      }}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
            </div>
              </>
          )}
            <button 
              className="view-button" 
              onClick={(e) => { 
                e.stopPropagation(); 
                handleViewLesson(lesson); 
              }}
              >
              Start Learning →
            </button>
                </div>
              )}
           </div>
         ))}
       </div>
     </div>
    );
  };

   const renderLessonDetail = () => {
     if (!selectedLesson) return null;
     const isTeacherOrAdmin = currentRole === "teacher" || currentRole === "admin";
     const isStudent = currentRole === "student";
 
     return (
       <div className="modal-overlay">
         <div className="modal-container">
           <div className="modal-header">
           <button 
              className="modal-back"
              onClick={() => {
                setSelectedLesson(null);
                localStorage.removeItem("selectedLessonId");
              }}
            >
              <FaArrowLeft /> Back to Lessons
            </button>
             <h2 className="modal-title">{selectedLesson.title}</h2>
          </div>
           <div className="modal-body">
             <div className="lesson-content-container">
               <p className="lesson-description">{selectedLesson.description}</p>
 
               {selectedLesson.video_url && (
                 <div className="lesson-video-container">
                   <iframe
                     className="lesson-video"
                     src={selectedLesson.video_url.replace("watch?v=", "embed/")}
                     title="Lesson Video"
                     allowFullScreen
                   ></iframe>
                 </div>
               )}
 
               <div className="lesson-sections">
                 <div className="keypoints-section">
                   <h3 className="section-title">
                     <span>📝</span> Key Points
                   </h3>
                   <ul className="keypoints-list">
                     {selectedLesson.keypoints?.map((point) => (
                       <li key={point.id} className="keypoint-item">
                         {editingKeypointId === point.id ? (
                           <div className="edit-form">
                             <input
                               type="text"
                               value={editedKeypoint}
                               onChange={(e) => setEditedKeypoint(e.target.value)}
                               className="edit-input"
                             />
                             <div className="edit-buttons">
                               <button
                                 className="save-btn"
                                 onClick={async () => {
                                    await handleEditKeypoint(point.id, editedKeypoint);
                                    setEditingKeypointId(null);
                                  }}
                               >
                                 <FaCheck /> Save
                               </button>
                               <button
                                 className="cancel-btn"
                                 onClick={() => setEditingKeypointId(null)}
                               >
                                 <FaTimes /> Cancel
                               </button>
                             </div>
                           </div>
                         ) : (
                           <div className="keypoint-content">
                             <div className="keypoint-text">{point.content}</div>
                             {isTeacherOrAdmin && (
                               <div className="keypoint-actions">
                                 <button
                                   className="edit-btn"
                                   onClick={() => {
                                     setEditingKeypointId(point.id);
                                     setEditedKeypoint(point.content);
                                   }}
                                 >
                                   <FaEdit /> Edit
                                 </button>
                                 <button 
                                   className="delete-btn" 
                                   onClick={() => handleDeleteKeypoint(point.id)}
                                 >
                                   <FaTrash /> Delete
                                 </button>
                               </div>
                             )}
                           </div>
                         )}
                       </li>
                     ))}
                   </ul>
 
                   {isTeacherOrAdmin && (
                     <div className="add-keypoint-form">
                       <input
                         type="text"
                         placeholder="Add new key point..."
                         className="form-input"
                         value={newKeypoint}
                         onChange={(e) => setNewKeypoint(e.target.value)}
                       />
                       <button className="submit-btn" onClick={handleAddKeypoint}>
                         <FaPlus /> Add Key Point
                       </button>
                     </div>
                   )}
                 </div>
 
                 <div className="questions-section">
                   <h3 className="section-title">
                    <span>❓</span> 
                    Questions
                   </h3>
                   <ul className="questions-list">
                     {selectedLesson.questions?.map((q) => (
                       <li key={q.id} className="question-item">
                         {editingQuestionId === q.id ? (
                           <div className="edit-question-form">
                             <input
                               type="text"
                               className="question-input"
                               value={editedQuestion.question}
                               onChange={(e) =>
                                 setEditedQuestion({ ...editedQuestion, question: e.target.value })
                               }
                               placeholder="Question"
                             />
                             {editedQuestion.choices.map((choice, i) => (
                               <input
                                 key={i}
                                 type="text"
                                 className="choice-input"
                                 value={choice}
                                 onChange={(e) => {
                                   const updated = [...editedQuestion.choices];
                                   updated[i] = e.target.value;
                                   setEditedQuestion({ ...editedQuestion, choices: updated });
                                 }}
                                 placeholder={`Option ${i+1}`}
                               />
                             ))}
                             <input
                               type="text"
                               className="correct-answer-input"
                               value={editedQuestion.correctAnswer}
                               onChange={(e) =>
                                 setEditedQuestion({ ...editedQuestion, correctAnswer: e.target.value })
                               }
                               placeholder="Correct Answer"
                             />
                             <div className="edit-buttons">
                               <button
                                 className="save-btn"
                                 onClick={() => handleEditQuestion(q.id)}
                               >
                                 <FaCheck /> Save
                               </button>
                               <button
                                 className="cancel-btn"
                                 onClick={() => setEditingQuestionId(null)}
                               >
                                 <FaTimes /> Cancel
                               </button>
                             </div>
                           </div>
                         ) : (
                           <div className="question-content">
                             <div className="question-text">{q.question}</div>
                             <ul className="choices-list">
                               {q.choices?.map((choice, i) => (
                                 <li key={i} className="choice-item">
                                   {isStudent ? (
                                     <label className="choice-label">
                                       <input
                                         type="radio"
                                         name={`question-${q.id}`}
                                         value={choice}
                                         checked={studentAnswers[q.id] === choice}
                                         onChange={() => handleAnswerChange(q.id, choice)}
                                         disabled={lessonCompleted}
                                         className="choice-radio"
                                       />
                                       <span className="choice-text">{choice}</span>
                                     </label>
                                   ) : (
                                     <span className="choice-text">{choice}</span>
                                   )}
                                 </li>
                               ))}
                             </ul>
 
                             {isStudent && answerFeedback[q.id] && (
                               <div className={`feedback ${answerFeedback[q.id].includes("Correct") ? "correct" : "incorrect"}`}>
                                 {answerFeedback[q.id]}
                               </div>
                             )}
 
                             {isTeacherOrAdmin && (
                               <div className="question-actions">
                                 <button
                                   className="edit-btn"
                                   onClick={() => {
                                     setEditingQuestionId(q.id);
                                     setEditedQuestion({
                                       question: q.question || "",
                                       choices: Array.isArray(q.choices)
                                         ? q.choices
                                         : typeof q.choices === "string"
                                         ? q.choices.split(",")
                                         : ["", "", ""],
                                       correctAnswer: q.correctAnswer || "",
                                     });
                                   }}
                                 >
                                   <FaEdit /> Edit
                                 </button>
                                 <button
                                   className="delete-btn"
                                   onClick={() => handleDeleteQuestion(q.id)}
                                 >
                                   <FaTrash /> Delete
                                 </button>
                               </div>
                             )}
                           </div>
                         )}
                       </li>
                     ))}
                   </ul>
 
                   {isTeacherOrAdmin && (
                     <div className="add-question-form">
                       <h4>Add New Question</h4>
                       <input
                         type="text"
                         placeholder="Question"
                         className="form-input"
                         value={newQuestion.question}
                         onChange={(e) =>
                           setNewQuestion({ ...newQuestion, question: e.target.value })
                         }
                       />
                       {newQuestion.choices.map((choice, i) => (
                         <input
                           key={i}
                           type="text"
                           placeholder={`Option ${i + 1}`}
                           className="form-input"
                           value={choice}
                           onChange={(e) => {
                             const updated = [...newQuestion.choices];
                             updated[i] = e.target.value;
                             setNewQuestion({ ...newQuestion, choices: updated });
                           }}
                         />
                       ))}
                       <input
                         type="text"
                         placeholder="Correct Answer"
                         className="form-input"
                         value={newQuestion.correctAnswer}
                         onChange={(e) =>
                           setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })
                         }
                       />
                       <button className="submit-btn" onClick={handleAddQuestion}>
                         <FaPlus /> Add Question
                       </button>
                     </div>
                   )}
                 </div>
               </div>
             </div>
 
             {isStudent && !lessonCompleted && (
               <button className="submit-answers-btn" onClick={handleSubmitAnswers}>
                 <FaCheck /> Submit Answers ({attemptCount}/3 attempts)
               </button>
             )}
 
             {isStudent && lessonCompleted && (
              <div className="completion-actions">
               <div className="completion-message">
                 🎉 You've completed this lesson! Great job!
               </div>
               <button
                className="go-to-game-btn"
                onClick={() => navigate(`/game?lesson=${selectedLesson.id}&difficulty=${selectedLesson.difficulty}`)}
                >
                🎮 Go to {selectedLesson.title} Game ({selectedLesson.difficulty})
              </button>

              </div>
             )}
           </div>
         </div>
       </div>
     );
   };
 
   return (
    <div className="lessons-page">
      {renderLessonList()}
      {selectedLesson && renderLessonDetail()}
    </div>
  );
};
 
export default LessonsPage;