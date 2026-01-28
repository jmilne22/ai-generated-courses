/**
 * Go Grind - P5R Exam System
 * Periodic exams test Go knowledge via timed multiple-choice.
 */
(function() {
    'use strict';

    var EXAM_QUESTIONS = [
        { topic: 'Variables', question: 'What does := do in Go?', answers: ['Declares and assigns a variable', 'Compares two values', 'Creates a constant', 'Assigns to existing variable'], correct: 0, difficulty: 1 },
        { topic: 'Variables', question: 'Where can you use := in Go?', answers: ['Only inside functions', 'Anywhere in the file', 'Only at package level', 'Only in main()'], correct: 0, difficulty: 1 },
        { topic: 'Variables', question: 'What is the zero value of a string in Go?', answers: ['Empty string ""', 'nil', 'null', 'undefined'], correct: 0, difficulty: 1 },
        { topic: 'Variables', question: 'What is the zero value of an int in Go?', answers: ['0', 'nil', 'null', '-1'], correct: 0, difficulty: 1 },
        { topic: 'Variables', question: 'Which keyword declares a variable at package level?', answers: ['var', 'let', 'const', 'dim'], correct: 0, difficulty: 1 },
        { topic: 'Types', question: 'What type is a rune in Go?', answers: ['int32', 'uint8', 'string', 'char'], correct: 0, difficulty: 2 },
        { topic: 'Types', question: 'What is a byte an alias for in Go?', answers: ['uint8', 'int8', 'int32', 'string'], correct: 0, difficulty: 2 },
        { topic: 'Types', question: 'Go is a _____ typed language.', answers: ['Statically', 'Dynamically', 'Weakly', 'Loosely'], correct: 0, difficulty: 1 },
        { topic: 'Types', question: 'How do you convert a string to a slice of runes?', answers: ['[]rune(s)', 'rune(s)', 'string.runes(s)', 'chars(s)'], correct: 0, difficulty: 2 },
        { topic: 'Functions', question: 'How many values can a Go function return?', answers: ['Multiple', 'Only one', 'Only two', 'Zero'], correct: 0, difficulty: 1 },
        { topic: 'Functions', question: 'What is the entry point function in Go called?', answers: ['main', 'init', 'start', 'run'], correct: 0, difficulty: 1 },
        { topic: 'Functions', question: 'What package must the entry point be in?', answers: ['package main', 'package app', 'package start', 'package root'], correct: 0, difficulty: 1 },
        { topic: 'Functions', question: 'What happens to unused variables in Go?', answers: ['Compilation error', 'Warning only', 'Silently ignored', 'Runtime error'], correct: 0, difficulty: 1 },
        { topic: 'Loops', question: 'How many loop keywords does Go have?', answers: ['One (for)', 'Two (for, while)', 'Three (for, while, do)', 'Four'], correct: 0, difficulty: 1 },
        { topic: 'Loops', question: 'What does "for range" give you for a slice?', answers: ['Index and value', 'Only value', 'Only index', 'Length and value'], correct: 0, difficulty: 1 },
        { topic: 'Loops', question: 'How do you write a while loop in Go?', answers: ['for condition { }', 'while condition { }', 'do { } while condition', 'loop condition { }'], correct: 0, difficulty: 1 },
        { topic: 'Loops', question: 'What does "for { }" create?', answers: ['An infinite loop', 'A syntax error', 'A single iteration', 'An empty function'], correct: 0, difficulty: 1 },
        { topic: 'Slices', question: 'How do you add an element to a slice?', answers: ['append(slice, elem)', 'slice.add(elem)', 'slice.push(elem)', 'slice += elem'], correct: 0, difficulty: 1 },
        { topic: 'Slices', question: 'What does len(slice) return?', answers: ['Number of elements', 'Capacity', 'Memory size', 'Max index'], correct: 0, difficulty: 1 },
        { topic: 'Slices', question: 'What is the zero value of a slice?', answers: ['nil', '[]', '0', 'empty'], correct: 0, difficulty: 2 },
        { topic: 'Slices', question: 'What does nums[1:3] return for [10,20,30,40]?', answers: ['[20, 30]', '[10, 20, 30]', '[20, 30, 40]', '[10, 20]'], correct: 0, difficulty: 2 },
        { topic: 'Slices', question: 'Are slices passed by value or reference in Go?', answers: ['By reference (they share underlying array)', 'By value (always copied)', 'Depends on size', 'Neither'], correct: 0, difficulty: 2 },
        { topic: 'Maps', question: 'What happens when you access a missing key in a map?', answers: ['Returns zero value', 'Panics', 'Returns nil', 'Compilation error'], correct: 0, difficulty: 1 },
        { topic: 'Maps', question: 'What is the "comma ok" pattern?', answers: ['val, ok := m[key] - checks if key exists', 'Checks for nil values', 'Error handling pattern', 'Multiple return values'], correct: 0, difficulty: 1 },
        { topic: 'Maps', question: 'How do you delete a key from a map?', answers: ['delete(m, key)', 'm.delete(key)', 'del m[key]', 'remove(m, key)'], correct: 0, difficulty: 2 },
        { topic: 'Maps', question: 'Can you iterate over a map in guaranteed order?', answers: ['No, order is random', 'Yes, alphabetical', 'Yes, insertion order', 'Yes, numerical order'], correct: 0, difficulty: 2 },
        { topic: 'Two Pointers', question: 'When do you use the two-pointer technique?', answers: ['Working from both ends toward middle', 'Only with linked lists', 'Only with maps', 'Only with strings'], correct: 0, difficulty: 2 },
        { topic: 'Two Pointers', question: 'What is the time complexity of two-pointer palindrome check?', answers: ['O(n)', 'O(n\u00B2)', 'O(log n)', 'O(1)'], correct: 0, difficulty: 2 },
        { topic: 'Sliding Window', question: 'When should you use a sliding window?', answers: ['Finding optimal contiguous subarray', 'Sorting an array', 'Binary tree traversal', 'Graph problems'], correct: 0, difficulty: 2 },
        { topic: 'Sliding Window', question: 'In a fixed-size sliding window, what do you do at each step?', answers: ['Add new element, remove old element', 'Sort the window', 'Recalculate everything', 'Reverse the window'], correct: 0, difficulty: 2 },
        { topic: 'Binary Search', question: 'What is the time complexity of binary search?', answers: ['O(log n)', 'O(n)', 'O(n\u00B2)', 'O(1)'], correct: 0, difficulty: 2 },
        { topic: 'Binary Search', question: 'What is required for binary search to work?', answers: ['Sorted input', 'Unique elements', 'Integer values', 'Even number of elements'], correct: 0, difficulty: 1 },
        { topic: 'Recursion', question: 'What must every recursive function have?', answers: ['A base case', 'A loop', 'A map', 'A pointer'], correct: 0, difficulty: 1 },
        { topic: 'Recursion', question: 'What happens without a base case in recursion?', answers: ['Stack overflow', 'Returns zero', 'Infinite loop', 'Compilation error'], correct: 0, difficulty: 1 },
        { topic: 'Stack', question: 'What order does a stack follow?', answers: ['Last In, First Out (LIFO)', 'First In, First Out (FIFO)', 'Random access', 'Sorted order'], correct: 0, difficulty: 1 },
        { topic: 'Stack', question: 'How do you implement a stack in Go?', answers: ['Use a slice with append and pop', 'Use a linked list only', 'Use a map', 'Use a channel'], correct: 0, difficulty: 2 },
        { topic: 'Complexity', question: 'What is O(1) also called?', answers: ['Constant time', 'Linear time', 'Logarithmic time', 'Quadratic time'], correct: 0, difficulty: 1 },
        { topic: 'Complexity', question: 'Which is faster: O(n) or O(n\u00B2)?', answers: ['O(n)', 'O(n\u00B2)', 'Same speed', 'Depends on input'], correct: 0, difficulty: 1 },
        { topic: 'Complexity', question: 'Using a map for lookup is typically what complexity?', answers: ['O(1) average', 'O(n)', 'O(log n)', 'O(n\u00B2)'], correct: 0, difficulty: 2 },
        { topic: 'Map Tracking', question: 'Why use a map instead of nested loops to find duplicates?', answers: ['O(n) instead of O(n\u00B2)', 'Maps use less memory', 'Maps are easier to read', 'Nested loops don\'t work'], correct: 0, difficulty: 2 },
        { topic: 'Map Tracking', question: 'In Two Sum, what do you store in the map?', answers: ['Number \u2192 its index', 'Index \u2192 number', 'Number \u2192 count', 'Nothing'], correct: 0, difficulty: 2 },
        { topic: 'Errors', question: 'How does Go handle errors?', answers: ['Multiple return values (value, error)', 'Try/catch blocks', 'Exceptions', 'Error codes only'], correct: 0, difficulty: 1 },
        { topic: 'Errors', question: 'What is nil in the context of errors?', answers: ['No error occurred', 'Unknown error', 'Fatal error', 'Timeout'], correct: 0, difficulty: 1 },
        { topic: 'Strings', question: 'Are strings mutable or immutable in Go?', answers: ['Immutable', 'Mutable', 'Depends on length', 'Depends on scope'], correct: 0, difficulty: 2 },
        { topic: 'Strings', question: 'What does strings.Fields("hello world") return?', answers: ['["hello", "world"]', '"hello world"', '["h","e","l","l","o"...]', '2'], correct: 0, difficulty: 2 },
        { topic: 'Strings', question: 'How do you efficiently build a string from many parts?', answers: ['strings.Builder', 'Concatenation with +', 'fmt.Sprintf in a loop', 'bytes.Buffer only'], correct: 0, difficulty: 3 },
        { topic: 'Gotchas', question: 'What does fmt.Println(len("\uD83C\uDF89")) print?', answers: ['4 (bytes, not characters)', '1', '2', 'Error'], correct: 0, difficulty: 3 },
        { topic: 'Gotchas', question: 'What happens if you use := with an already declared variable?', answers: ['Error, unless at least one var on the left is new', 'Overwrites the variable', 'Creates a new variable', 'Always works fine'], correct: 0, difficulty: 3 },
        { topic: 'Gotchas', question: 'What does _ (underscore) mean in Go?', answers: ['Discard/ignore that value', 'Private variable', 'Null value', 'Wildcard'], correct: 0, difficulty: 1 }
    ];

    var EXAMS = [
        { id: 'midterm_1', name: 'Midterm Exam 1', subtitle: 'Go Basics', questionsCount: 5, timePerQuestion: 20, requiredExercises: 5, statBoost: 'knowledge', topics: ['Variables', 'Types', 'Functions', 'Loops'] },
        { id: 'midterm_2', name: 'Midterm Exam 2', subtitle: 'Collections', questionsCount: 7, timePerQuestion: 18, requiredExercises: 15, statBoost: 'knowledge', topics: ['Slices', 'Maps', 'Loops', 'Strings'] },
        { id: 'final_1', name: 'Final Exam', subtitle: 'Algorithms & Patterns', questionsCount: 10, timePerQuestion: 15, requiredExercises: 30, statBoost: 'knowledge', topics: ['Two Pointers', 'Sliding Window', 'Binary Search', 'Recursion', 'Stack', 'Map Tracking', 'Complexity'] },
        { id: 'midterm_3', name: 'Midterm Exam 3', subtitle: 'Advanced Patterns', questionsCount: 8, timePerQuestion: 15, requiredExercises: 50, statBoost: 'proficiency', topics: ['Complexity', 'Map Tracking', 'Errors', 'Gotchas', 'Strings'] },
        { id: 'final_2', name: 'Final Exam 2', subtitle: 'Mastery', questionsCount: 12, timePerQuestion: 12, requiredExercises: 80, statBoost: 'proficiency', topics: null }
    ];

    function selectQuestions(exam) {
        var pool = EXAM_QUESTIONS.filter(function(q) {
            if (exam.topics === null) return true;
            return exam.topics.indexOf(q.topic) !== -1;
        });
        for (var i = pool.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
        }
        return pool.slice(0, exam.questionsCount).map(function(q) {
            var indices = [0, 1, 2, 3];
            for (var i = indices.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = indices[i]; indices[i] = indices[j]; indices[j] = tmp;
            }
            return {
                topic: q.topic, question: q.question,
                answers: indices.map(function(idx) { return q.answers[idx]; }),
                correct: indices.indexOf(q.correct), difficulty: q.difficulty
            };
        });
    }

    function calcExamGrade(correct, total) {
        var pct = correct / total;
        if (pct >= 0.95) return { grade: 'S', label: 'Top of class!', xpBonus: 100 };
        if (pct >= 0.85) return { grade: 'A', label: 'Excellent!', xpBonus: 75 };
        if (pct >= 0.70) return { grade: 'B', label: 'Good work.', xpBonus: 50 };
        if (pct >= 0.50) return { grade: 'C', label: 'Could be better.', xpBonus: 25 };
        return { grade: 'F', label: 'Study harder...', xpBonus: 10 };
    }

    function startExam(examDef) {
        var questions = selectQuestions(examDef);
        var currentQ = 0;
        var answers = [];
        var timer = null;

        if (window.GameAudio) window.GameAudio.playMenuSelect();

        var overlay = document.createElement('div');
        overlay.className = 'exam-overlay';
        overlay.innerHTML = '<div class="exam-container"></div>';
        document.body.appendChild(overlay);
        var container = overlay.querySelector('.exam-container');

        function renderQuestion() {
            var q = questions[currentQ];
            var html = '<div class="exam-header"><div class="exam-title">' + examDef.name + '</div>' +
                '<div class="exam-progress">Question ' + (currentQ + 1) + ' / ' + questions.length + '</div></div>' +
                '<div class="exam-timer-bar"><div class="exam-timer-fill" id="exam-timer-fill"></div></div>' +
                '<div class="exam-topic">' + q.topic + '</div>' +
                '<div class="exam-question">' + q.question + '</div>' +
                '<div class="exam-answers">';
            q.answers.forEach(function(ans, i) {
                html += '<button class="exam-answer-btn" data-index="' + i + '">' +
                    '<span class="exam-answer-letter">' + String.fromCharCode(65 + i) + '</span>' +
                    '<span class="exam-answer-text">' + ans + '</span></button>';
            });
            html += '</div>';
            container.innerHTML = html;
            container.style.animation = 'none';
            container.offsetHeight;
            container.style.animation = 'exam-slide-in 0.3s ease-out';

            container.querySelectorAll('.exam-answer-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    clearInterval(timer);
                    handleAnswer(parseInt(this.getAttribute('data-index')));
                });
            });

            clearInterval(timer);
            var startTime = Date.now();
            var fill = document.getElementById('exam-timer-fill');
            timer = setInterval(function() {
                var elapsed = (Date.now() - startTime) / 1000;
                var pct = Math.max(0, 100 - (elapsed / examDef.timePerQuestion * 100));
                if (fill) fill.style.width = pct + '%';
                if (pct <= 20 && fill) fill.style.background = 'var(--red)';
                if (elapsed >= examDef.timePerQuestion) {
                    clearInterval(timer);
                    handleAnswer(-1);
                }
            }, 50);
        }

        function handleAnswer(selected) {
            var q = questions[currentQ];
            var isCorrect = selected === q.correct;
            answers.push({ selected: selected, correct: q.correct, isCorrect: isCorrect });

            container.querySelectorAll('.exam-answer-btn').forEach(function(btn) {
                btn.style.pointerEvents = 'none';
                var idx = parseInt(btn.getAttribute('data-index'));
                if (idx === q.correct) btn.classList.add('correct');
                else if (idx === selected && !isCorrect) btn.classList.add('wrong');
            });

            if (isCorrect && window.GameAudio) window.GameAudio.playMenuSelect();

            setTimeout(function() {
                currentQ++;
                if (currentQ < questions.length) renderQuestion();
                else { showResults(examDef, answers, questions); overlay.remove(); }
            }, 1200);
        }

        renderQuestion();
    }

    function showResults(examDef, answers, questions) {
        var correct = answers.filter(function(a) { return a.isCorrect; }).length;
        var total = questions.length;
        var gradeInfo = calcExamGrade(correct, total);

        if (window.GameState) {
            window.GameState.saveExamResult(examDef.id, {
                grade: gradeInfo.grade, correct: correct, total: total,
                xpBonus: gradeInfo.xpBonus, completedAt: new Date().toISOString()
            });
            var player = window.GameState.getState().player;
            player.totalXP += gradeInfo.xpBonus;
            if (examDef.statBoost) {
                var boost = gradeInfo.grade === 'S' ? 3 : gradeInfo.grade === 'A' ? 2 : 1;
                player.stats[examDef.statBoost] = (player.stats[examDef.statBoost] || 0) + boost;
            }
            while (player.totalXP >= window.GameState.xpForLevel(player.level)) {
                player.totalXP; // already counted cumulatively
                var prevXP = 0;
                for (var i = 1; i < player.level; i++) prevXP += window.GameState.xpForLevel(i);
                if (player.totalXP - prevXP >= window.GameState.xpForLevel(player.level)) {
                    player.level++;
                } else break;
            }
            window.GameState.save();
        }

        if (window.GameAudio) window.GameAudio.playGrade(gradeInfo.grade);

        var overlay = document.createElement('div');
        overlay.className = 'exam-results-overlay';
        var html = '<div class="exam-results-card">' +
            '<div class="exam-results-header">EXAM RESULTS</div>' +
            '<div class="exam-results-name">' + examDef.name + '</div>' +
            '<div class="exam-results-subtitle">' + examDef.subtitle + '</div>' +
            '<div class="exam-results-grade grade-' + gradeInfo.grade + '">' + gradeInfo.grade + '</div>' +
            '<div class="exam-results-label">' + gradeInfo.label + '</div>' +
            '<div class="exam-results-score">' + correct + ' / ' + total + ' correct</div>' +
            '<div class="exam-results-xp">+' + gradeInfo.xpBonus + ' XP</div>';

        html += '<div class="exam-results-breakdown">';
        questions.forEach(function(q, i) {
            var a = answers[i];
            var icon = a.isCorrect ? '<span style="color:var(--green)">&#10003;</span>' : '<span style="color:var(--red)">&#10007;</span>';
            html += '<div class="exam-result-row"><span class="exam-result-icon">' + icon + '</span>' +
                '<span class="exam-result-q">' + q.question + '</span>';
            if (!a.isCorrect) html += '<span class="exam-result-correct">Answer: ' + q.answers[q.correct] + '</span>';
            html += '</div>';
        });
        html += '</div>';

        if (examDef.statBoost) {
            var boost = gradeInfo.grade === 'S' ? 3 : gradeInfo.grade === 'A' ? 2 : 1;
            html += '<div class="exam-results-stat">' + examDef.statBoost.charAt(0).toUpperCase() + examDef.statBoost.slice(1) + ' +' + boost + '</div>';
        }

        html += '<button class="exam-dismiss-btn" type="button">Continue</button></div>';
        overlay.innerHTML = html;
        document.body.appendChild(overlay);

        overlay.querySelector('.exam-dismiss-btn').addEventListener('click', function() {
            overlay.remove();
            if (window.App) window.App.updatePlayerCard();
        });
    }

    function renderExamsView() {
        var view = document.getElementById('view-exams');
        if (!view || !window.GameState) return;

        var completedCount = window.GameState.getCompletedCount();
        var examResults = window.GameState.getExams();

        var html = '<div class="section-title" style="margin-top:0">Exam Schedule</div>';
        html += '<div class="exam-schedule">';

        EXAMS.forEach(function(exam) {
            var available = completedCount >= exam.requiredExercises;
            var result = examResults[exam.id];
            var cls = 'exam-schedule-item';
            if (!available) cls += ' locked';
            else if (result) cls += ' completed';

            html += '<div class="' + cls + '" data-exam-id="' + exam.id + '">';
            if (result) {
                html += '<div class="exam-schedule-grade grade-' + result.grade + '">' + result.grade + '</div>';
            } else {
                html += '<div class="exam-schedule-grade" style="color:var(--text-dim)">&mdash;</div>';
            }
            html += '<div class="exam-schedule-name">' + exam.name + '<br><span style="font-size:0.7rem;color:var(--text-dim)">' + exam.subtitle + '</span></div>';
            if (!available) {
                html += '<div class="exam-schedule-info">' + exam.requiredExercises + ' exercises to unlock</div>';
            } else if (result) {
                html += '<div class="exam-schedule-info">' + result.correct + '/' + result.total + ' &bull; +' + result.xpBonus + ' XP</div>';
            } else {
                html += '<div class="exam-schedule-info" style="color:var(--red)">' + exam.questionsCount + ' questions &bull; TAKE EXAM</div>';
            }
            html += '</div>';
        });

        html += '</div>';
        view.innerHTML = html;

        // Bind exam clicks
        view.querySelectorAll('.exam-schedule-item:not(.locked):not(.completed)').forEach(function(el) {
            el.addEventListener('click', function() {
                var examId = el.dataset.examId;
                var exam = EXAMS.find(function(e) { return e.id === examId; });
                if (exam) startExam(exam);
            });
        });
    }

    window.GameExam = {
        renderExamsView: renderExamsView,
        startExam: startExam,
        EXAMS: EXAMS
    };
})();
