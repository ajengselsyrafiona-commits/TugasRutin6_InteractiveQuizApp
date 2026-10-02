// ===== DATABASE SOAL =====
const questionBank = [
    {
        category: "teknologi",
        question: "Apa kepanjangan dari HTML?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
        answer: 0
    },
    {
        category: "teknologi",
        question: "Bahasa pemrograman apa yang digunakan untuk styling halaman web?",
        options: ["JavaScript", "Python", "CSS", "Java"],
        answer: 2
    },
    {
        category: "teknologi",
        question: "Siapa pendiri Microsoft?",
        options: ["Steve Jobs", "Bill Gates", "Elon Musk", "Mark Zuckerberg"],
        answer: 1
    },
    {
        category: "sains",
        question: "Apa rumus kimia air?",
        options: ["CO2", "H2O", "NaCl", "O2"],
        answer: 1
    },
    {
        category: "sains",
        question: "Planet terbesar di tata surya kita adalah?",
        options: ["Mars", "Saturnus", "Jupiter", "Neptunus"],
        answer: 2
    },
    {
        category: "sains",
        question: "Berapa kecepatan cahaya (kira-kira)?",
        options: ["300.000 km/s", "150.000 km/s", "500.000 km/s", "1.000.000 km/s"],
        answer: 0
    },
    {
        category: "sejarah",
        question: "Kapan Indonesia merdeka?",
        options: ["17 Agustus 1945", "1 Juni 1945", "28 Oktober 1928", "10 November 1945"],
        answer: 0
    },
    {
        category: "sejarah",
        question: "Siapa presiden pertama Indonesia?",
        options: ["Soeharto", "B.J. Habibie", "Ir. Soekarno", "Megawati"],
        answer: 2
    },
    {
        category: "geografi",
        question: "Apa ibu kota Jepang?",
        options: ["Osaka", "Kyoto", "Tokyo", "Yokohama"],
        answer: 2
    },
    {
        category: "geografi",
        question: "Gunung tertinggi di Indonesia adalah?",
        options: ["Gunung Merapi", "Gunung Semeru", "Puncak Jaya", "Gunung Rinjani"],
        answer: 2
    }
];

// ===== STATE =====
let currentQuestions = [];
let currentIndex = 0;
let score = 0;

// ===== TUNGGU DOM SIAP =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM siap!');

    // ===== AMBIL SEMUA ELEMEN =====
    const startBtn = document.getElementById('startBtn');
    const nextBtn = document.getElementById('nextBtn');
    const restartBtn = document.getElementById('restartBtn');
    const homeBtn = document.getElementById('homeBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const categorySelect = document.getElementById('categorySelect');
    const highScoreDisplay = document.getElementById('highScoreDisplay');

    // Cek apakah semua elemen ada
    console.log('startBtn:', startBtn);
    console.log('nextBtn:', nextBtn);
    console.log('darkModeToggle:', darkModeToggle);

    // ===== FUNGSI NAVIGASI =====
    function showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    // ===== FUNGSI HIGH SCORE =====
    function getHighScore() {
        return parseInt(localStorage.getItem('quizHighScore')) || 0;
    }

    function saveHighScore(newScore) {
        const currentHigh = getHighScore();
        if (newScore > currentHigh) {
            localStorage.setItem('quizHighScore', newScore);
            return true;
        }
        return false;
    }

    function updateHighScoreDisplay() {
        if (highScoreDisplay) {
            highScoreDisplay.textContent = getHighScore();
        }
    }

    // ===== FUNGSI DARK MODE =====
    function toggleDarkMode() {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        if (darkModeToggle) {
            darkModeToggle.textContent = isLight ? '☀️' : '🌙';
        }
        localStorage.setItem('darkMode', isLight ? 'light' : 'dark');
        console.log('🌙 Dark mode:', isLight ? 'Light' : 'Dark');
    }

    function loadDarkModePreference() {
        const preference = localStorage.getItem('darkMode');
        if (preference === 'light') {
            document.body.classList.add('light-mode');
            if (darkModeToggle) {
                darkModeToggle.textContent = '☀️';
            }
        }
    }

    // ===== FUNGSI PERSIAPAN SOAL =====
    function prepareQuestions(category) {
        let filtered;
        if (category === 'all') {
            filtered = [...questionBank].sort(() => Math.random() - 0.5);
        } else {
            filtered = questionBank
                .filter(q => q.category === category)
                .sort(() => Math.random() - 0.5);
        }
        currentQuestions = filtered.slice(0, 5);
    }

    // ===== FUNGSI RENDER SOAL =====
    function renderQuestion() {
        const question = currentQuestions[currentIndex];

        document.getElementById('questionText').textContent = question.question;
        document.getElementById('questionCounter').textContent = `Soal ${currentIndex + 1} dari 5`;
        document.getElementById('scoreDisplay').textContent = `Skor: ${score}`;

        const container = document.getElementById('optionsContainer');
        container.innerHTML = '';

        const letters = ['A', 'B', 'C', 'D'];
        question.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<span class="option-letter">${letters[index]}</span><span>${option}</span>`;
            btn.addEventListener('click', function() {
                selectAnswer(index, question.answer);
            });
            container.appendChild(btn);
        });

        // Sembunyikan feedback dan next button
        document.getElementById('feedback').classList.add('hidden');
        nextBtn.classList.add('hidden');
    }

    // ===== FUNGSI PILIH JAWABAN =====
    function selectAnswer(selected, correct) {
        const buttons = document.querySelectorAll('.option-btn');
        
        // Disable semua tombol
        buttons.forEach(btn => {
            btn.style.pointerEvents = 'none';
        });

        if (selected === correct) {
            buttons[selected].classList.add('correct');
            score++;
            document.getElementById('feedback').innerHTML = '✅ Benar!';
            document.getElementById('feedback').className = 'feedback correct';
        } else {
            buttons[selected].classList.add('wrong');
            buttons[correct].classList.add('correct');
            document.getElementById('feedback').innerHTML = '❌ Salah! Jawaban yang benar ditandai hijau.';
            document.getElementById('feedback').className = 'feedback wrong';
        }

        document.getElementById('feedback').classList.remove('hidden');
        nextBtn.classList.remove('hidden');

        // Update skor
        document.getElementById('scoreDisplay').textContent = `Skor: ${score}`;

        // Ubah teks tombol next jika soal terakhir
        if (currentIndex === currentQuestions.length - 1) {
            nextBtn.textContent = ' Lihat Hasil';
        } else {
            nextBtn.textContent = 'Soal Berikutnya ➡️';
        }

        console.log('Jawaban dipilih:', selected, 'Benar:', correct);
    }

    // ===== FUNGSI SOAL BERIKUTNYA =====
    function nextQuestion() {
        console.log('️ Next question! Index:', currentIndex);
        currentIndex++;
        
        if (currentIndex < currentQuestions.length) {
            renderQuestion();
        } else {
            showResults();
        }
    }

    // ===== FUNGSI TAMPILKAN HASIL =====
    function showResults() {
        const isNewHighScore = saveHighScore(score);
        const highScore = getHighScore();

        document.getElementById('finalScore').textContent = score;
        document.getElementById('correctCount').textContent = score;
        document.getElementById('wrongCount').textContent = 5 - score;
        document.getElementById('resultHighScore').textContent = highScore;

        const percentage = (score / 5) * 100;
        let message = '';
        if (percentage === 100) message = '🎯 Sempurna! Kamu luar biasa!';
        else if (percentage >= 80) message = ' Hebat! Hampir sempurna!';
        else if (percentage >= 60) message = '👍 Bagus! Terus belajar ya!';
        else if (percentage >= 40) message = '💪 Lumayan! Coba lagi!';
        else message = '📚 Jangan menyerah! Ayo belajar lagi!';

        if (isNewHighScore) {
            message += ' 🏆 Rekor baru!';
        }

        document.getElementById('resultMessage').textContent = message;
        showScreen('resultScreen');
    }

    // ===== EVENT LISTENER: TOMBOL START =====
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            console.log('🚀 Tombol Start diklik!');
            const category = categorySelect ? categorySelect.value : 'all';
            prepareQuestions(category);
            currentIndex = 0;
            score = 0;
            showScreen('quizScreen');
            renderQuestion();
        });
    } else {
        console.error('❌ startBtn tidak ditemukan!');
    }

    // ===== EVENT LISTENER: TOMBOL NEXT =====
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            console.log('➡️ Tombol Next diklik!');
            nextQuestion();
        });
    } else {
        console.error('❌ nextBtn tidak ditemukan!');
    }

    // ===== EVENT LISTENER: TOMBOL RESTART =====
    if (restartBtn) {
        restartBtn.addEventListener('click', function() {
            console.log('🔄 Tombol Restart diklik!');
            const category = categorySelect ? categorySelect.value : 'all';
            prepareQuestions(category);
            currentIndex = 0;
            score = 0;
            showScreen('quizScreen');
            renderQuestion();
        });
    }

    // ===== EVENT LISTENER: TOMBOL HOME =====
    if (homeBtn) {
        homeBtn.addEventListener('click', function() {
            console.log('🏠 Tombol Home diklik!');
            updateHighScoreDisplay();
            showScreen('startScreen');
        });
    }

    // ===== EVENT LISTENER: DARK MODE =====
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            console.log('🌙 Tombol Dark Mode diklik!');
            toggleDarkMode();
        });
    } else {
        console.error('❌ darkModeToggle tidak ditemukan!');
    }

    // ===== INISIALISASI =====
    loadDarkModePreference();
    updateHighScoreDisplay();
    showScreen('startScreen');

    console.log('✅ Semua event listener terpasang!');
});