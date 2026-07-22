
// Initialize localStorage
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify({}));
}

let currentUser = null;

// Auth Functions
function showMessage(message, type, elementId = 'authMessage') {
    const messageDiv = document.getElementById(elementId);
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
    }, 3000);
}

function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');

    // Clear all form fields
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('regUsername').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('regConfirmPassword').value = '';

    // Clear any messages
    document.getElementById('authMessage').textContent = '';
    document.getElementById('authMessage').className = '';
}

function showRegister() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');

    // Clear all form fields
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('regUsername').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('regConfirmPassword').value = '';

    // Clear any messages
    document.getElementById('authMessage').textContent = '';
    document.getElementById('authMessage').className = '';
}

function register() {
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const confirmPassword = document.getElementById('regConfirmPassword').value.trim();

    if (!username || !password) {
        showMessage('Username and password cannot be empty!', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('Passwords do not match!', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users'));

    if (users[username]) {
        showMessage('Username already exists!', 'error');
        return;
    }

    users[username] = {
        password: password,
        data: {
            meals: {},
            water: 0,
            exercises: {},
            sleep: 0,
            mood: '',
            moodIcon: '',
            steps: 0,
            goals: {
                water: 2.0,
                caloriesBurned: 300,
                exerciseMinutes: 30,
                sleepHours: 8,
                steps: 10000
            },
            userInfo: {},
            history: []
        }
    };

    localStorage.setItem('users', JSON.stringify(users));
    showMessage('Registration successful! You can now login.', 'success');

    // Clear registration form
    document.getElementById('regUsername').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('regConfirmPassword').value = '';

    setTimeout(() => {
        showLogin();
    }, 1500);
}

function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!username || !password) {
        showMessage('Please enter username and password!', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users'));

    if (users[username] && users[username].password === password) {
        currentUser = username;
        sessionStorage.setItem('currentUser', username);
        document.getElementById('authPage').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        document.getElementById('currentUserName').textContent = `Welcome, ${username}!`;
        loadDashboard();
    } else {
        showMessage('Invalid username or password!', 'error');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        sessionStorage.removeItem('currentUser');
        document.getElementById('authPage').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');

        // Reset to dashboard and first nav button
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById('dashboard').classList.add('active');
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.nav-btn')[0].classList.add('active');

        showLogin();
    }
}

// Data Management
function getUserData() {
    const users = JSON.parse(localStorage.getItem('users'));
    return users[currentUser].data;
}

function saveUserData(data) {
    const users = JSON.parse(localStorage.getItem('users'));
    users[currentUser].data = data;
    localStorage.setItem('users', JSON.stringify(users));
}

// Navigation
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected page
    document.getElementById(pageName).classList.add('active');

    // Add active class to clicked button
    if (event && event.target) {
        event.target.classList.add('active');
    }

    // Clear page message
    document.getElementById('pageMessage').textContent = '';

    // Load page-specific data
    switch (pageName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'meals':
            loadMeals();
            break;
        case 'water':
            loadWater();
            break;
        case 'exercise':
            loadExercise();
            break;
        case 'sleep':
            loadSleep();
            break;
        case 'mood':
            loadMood();
            break;
        case 'steps':
            loadSteps();
            break;
        case 'bmi':
            loadBMI();
            break;
        case 'goals':
            loadGoals();
            break;
        case 'summary':
            loadSummary();
            break;
        case 'history':
            loadHistory();
            break;
    }
}

// Dashboard Functions
function loadDashboard() {
    const userData = getUserData();

    document.getElementById('dashMeals').textContent = Object.keys(userData.meals).length;
    document.getElementById('dashWater').textContent = userData.water.toFixed(1) + 'L';
    document.getElementById('dashExercise').textContent = Object.keys(userData.exercises).length;
    document.getElementById('dashSleep').textContent = userData.sleep.toFixed(1) + 'h';
    document.getElementById('dashSteps').textContent = userData.steps;
    document.getElementById('dashMood').textContent = userData.mood || '-';
}

// Meal Functions
function addMeal() {
    const name = document.getElementById('mealName').value.trim();
    const category = document.getElementById('mealCategory').value;
    const calories = parseFloat(document.getElementById('mealCalories').value) || 0;
    const protein = parseFloat(document.getElementById('mealProtein').value) || 0;
    const carbs = parseFloat(document.getElementById('mealCarbs').value) || 0;
    const fat = parseFloat(document.getElementById('mealFat').value) || 0;

    if (!name) {
        showMessage('Please enter a meal name!', 'error', 'pageMessage');
        return;
    }

    const userData = getUserData();

    if (userData.meals[name]) {
        showMessage('A meal with this name already exists!', 'error', 'pageMessage');
        return;
    }

    userData.meals[name] = { calories, protein, carbs, fat, category };
    saveUserData(userData);

    showMessage(`Meal "${name}" added successfully!`, 'success', 'pageMessage');

    // Clear form
    document.getElementById('mealName').value = '';
    document.getElementById('mealCalories').value = '';
    document.getElementById('mealProtein').value = '';
    document.getElementById('mealCarbs').value = '';
    document.getElementById('mealFat').value = '';

    loadMeals();
}

function deleteMeal(name) {
    if (confirm(`Delete "${name}"?`)) {
        const userData = getUserData();
        delete userData.meals[name];
        saveUserData(userData);
        showMessage(`Meal "${name}" deleted!`, 'success', 'pageMessage');
        loadMeals();
    }
}

function loadMeals() {
    const userData = getUserData();
    const mealsList = document.getElementById('mealsList');

    if (Object.keys(userData.meals).length === 0) {
        mealsList.innerHTML = '<div class="empty-state"><div class="empty-icon">🍽️</div><p>No meals logged yet</p></div>';
        updateMealSummary(0, 0, 0, 0);
        return;
    }

    let totalCal = 0, totalProt = 0, totalCarb = 0, totalFat = 0;
    let html = '';

    for (const [name, meal] of Object.entries(userData.meals)) {
        totalCal += meal.calories;
        totalProt += meal.protein;
        totalCarb += meal.carbs;
        totalFat += meal.fat;

        html += `
                    <div class="card">
                        <div class="card-header">
                            <span class="card-title">${name}</span>
                            <div>
                                <span class="badge">${meal.category.charAt(0).toUpperCase() + meal.category.slice(1)}</span>
                                <button class="btn btn-danger btn-small" style="margin-left: 10px;" onclick="deleteMeal('${name}')">Delete</button>
                            </div>
                        </div>
                        <div class="form-grid">
                            <div style="text-align: center;">
                                <div style="font-size: 1.5em; font-weight: bold; color: #2563eb;">${meal.calories.toFixed(1)}</div>
                                <div style="color: #666;">Calories</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 1.5em; font-weight: bold; color: #2563eb;">${meal.protein.toFixed(1)}g</div>
                                <div style="color: #666;">Protein</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 1.5em; font-weight: bold; color: #2563eb;">${meal.carbs.toFixed(1)}g</div>
                                <div style="color: #666;">Carbs</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 1.5em; font-weight: bold; color: #2563eb;">${meal.fat.toFixed(1)}g</div>
                                <div style="color: #666;">Fat</div>
                            </div>
                        </div>
                    </div>
                `;
    }

    mealsList.innerHTML = html;
    updateMealSummary(totalCal, totalProt, totalCarb, totalFat);
}

function updateMealSummary(cal, prot, carb, fat) {
    document.getElementById('totalCalories').textContent = cal.toFixed(1);
    document.getElementById('totalProtein').textContent = prot.toFixed(1) + 'g';
    document.getElementById('totalCarbs').textContent = carb.toFixed(1) + 'g';
    document.getElementById('totalFat').textContent = fat.toFixed(1) + 'g';
    
}

// Water Functions
function addWater(amount) {
    const userData = getUserData();
    userData.water += amount;
    saveUserData(userData);

    showMessage(`Added ${amount.toFixed(2)}L of water!`, 'success', 'pageMessage');
    loadWater();

    if (userData.water >= userData.goals.water) {
        setTimeout(() => {
            showMessage('🎉 Water goal achieved!', 'warning', 'pageMessage');
        }, 500);
    }
}

function addCustomWater() {
    const amount = parseFloat(document.getElementById('customWater').value);
    if (!amount || amount <= 0) {
        showMessage('Please enter a valid amount!', 'error', 'pageMessage');
        return;
    }
    addWater(amount);
    document.getElementById('customWater').value = '';
}

function loadWater() {
    const userData = getUserData();
    const current = userData.water;
    const goal = userData.goals.water;

    document.getElementById('waterIntake').textContent = current.toFixed(1) + ' L';
    document.getElementById('waterGoal').textContent = goal.toFixed(1);

    const percentage = Math.min((current / goal) * 100, 100);
    const progressBar = document.getElementById('waterProgress');
    progressBar.style.width = percentage + '%';
    progressBar.textContent = percentage.toFixed(0) + '%';
}

// Exercise Functions
function addExercise() {
    const name = document.getElementById('exerciseName').value.trim();
    const type = document.getElementById('exerciseType').value;
    const duration = parseFloat(document.getElementById('exerciseDuration').value) || 0;
    const calories = parseFloat(document.getElementById('exerciseCalories').value) || 0;

    if (!name) {
        showMessage('Please enter exercise name!', 'error', 'pageMessage');
        return;
    }

    const userData = getUserData();
    userData.exercises[name] = { type, duration, calories };
    saveUserData(userData);

    showMessage(`Exercise "${name}" added!`, 'success', 'pageMessage');

    document.getElementById('exerciseName').value = '';
    document.getElementById('exerciseDuration').value = '';
    document.getElementById('exerciseCalories').value = '';

    loadExercise();
}

function deleteExercise(name) {
    if (confirm(`Delete "${name}"?`)) {
        const userData = getUserData();
        delete userData.exercises[name];
        saveUserData(userData);
        showMessage(`Exercise "${name}" deleted!`, 'success', 'pageMessage');
        loadExercise();
    }
}

function loadExercise() {
    const userData = getUserData();
    const exerciseList = document.getElementById('exerciseList');

    if (Object.keys(userData.exercises).length === 0) {
        exerciseList.innerHTML = '<div class="empty-state"><div class="empty-icon">💪</div><p>No exercises logged yet</p></div>';
        document.getElementById('totalDuration').textContent = '0';
        document.getElementById('totalBurned').textContent = '0';
        return;
    }

    let totalDur = 0, totalCal = 0;
    let html = '';

    for (const [name, ex] of Object.entries(userData.exercises)) {
        totalDur += ex.duration;
        totalCal += ex.calories;

        html += `
                    <div class="card">
                        <div class="card-header">
                            <span class="card-title">${name}</span>
                            <div>
                                <span class="badge">${ex.type.charAt(0).toUpperCase() + ex.type.slice(1)}</span>
                                <button class="btn btn-danger btn-small" style="margin-left: 10px;" onclick="deleteExercise('${name}')">Delete</button>
                            </div>
                        </div>
                        <div class="form-grid">
                            <div style="text-align: center;">
                                <div style="font-size: 1.5em; font-weight: bold; color: #2563eb;">${ex.duration}</div>
                                <div style="color: #666;">Minutes</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 1.5em; font-weight: bold; color: #2563eb;">${ex.calories}</div>
                                <div style="color: #666;">Calories</div>
                            </div>
                        </div>
                    </div>
                `;
    }

    exerciseList.innerHTML = html;
    document.getElementById('totalDuration').textContent = totalDur.toFixed(0);
    document.getElementById('totalBurned').textContent = totalCal.toFixed(0);
}

// Sleep Functions
function addSleep() {
    const hours = parseFloat(document.getElementById('sleepInput').value);

    if (!hours || hours < 0 || hours > 24) {
        showMessage('Please enter valid sleep hours (0-24)!', 'error', 'pageMessage');
        return;
    }

    const userData = getUserData();
    userData.sleep += hours;
    saveUserData(userData);

    showMessage(`Added ${hours} hours of sleep!`, 'success', 'pageMessage');
    document.getElementById('sleepInput').value = '';
    loadSleep();
}

function loadSleep() {
    const userData = getUserData();
    const current = userData.sleep;
    const goal = userData.goals.sleepHours;

    document.getElementById('sleepHours').textContent = current.toFixed(1) + ' h';
    document.getElementById('sleepGoal').textContent = goal.toFixed(1);

    const percentage = Math.min((current / goal) * 100, 100);
    const progressBar = document.getElementById('sleepProgress');
    progressBar.style.width = percentage + '%';
    progressBar.textContent = percentage.toFixed(0) + '%';

    // Assessment
    let assessment = '';
    if (current >= 7 && current <= 9) {
        assessment = '<div class="message success">✅ Optimal sleep duration! Great job!</div>';
    } else if (current < 6) {
        assessment = '<div class="message error">⚠️ Insufficient sleep. Try to get more rest!</div>';
    } else if (current > 10) {
        assessment = '<div class="message warning">⚠️ Excessive sleep. Consider adjusting your schedule.</div>';
    } else {
        assessment = '<div class="message info">ℹ️ Good sleep duration.</div>';
    }

    document.getElementById('sleepAssessment').innerHTML = assessment;
}

// Mood Functions
function setMood(mood, icon) {
    const userData = getUserData();
    userData.mood = mood;
    userData.moodIcon = icon;
    saveUserData(userData);

    showMessage(`Mood set to ${mood}!`, 'success', 'pageMessage');
    loadMood();
}

function loadMood() {
    const userData = getUserData();
    document.getElementById('currentMoodIcon').textContent = userData.moodIcon || '-';
    document.getElementById('currentMoodText').textContent = userData.mood || 'Not set';
}

// Steps Functions
function addSteps(amount) {
    const userData = getUserData();
    userData.steps += amount;
    saveUserData(userData);

    showMessage(`Added ${amount} steps!`, 'success', 'pageMessage');
    loadSteps();

    if (userData.steps >= userData.goals.steps) {
        setTimeout(() => {
            showMessage('🎉 Steps goal achieved!', 'warning', 'pageMessage');
        }, 500);
    }
}

function addCustomSteps() {
    const amount = parseInt(document.getElementById('customSteps').value);
    if (!amount || amount <= 0) {
        showMessage('Please enter valid steps!', 'error', 'pageMessage');
        return;
    }
    addSteps(amount);
    document.getElementById('customSteps').value = '';
}

function loadSteps() {
    const userData = getUserData();
    const current = userData.steps;
    const goal = userData.goals.steps;

    document.getElementById('stepsCount').textContent = current;
    document.getElementById('stepsGoal').textContent = goal;

    const percentage = Math.min((current / goal) * 100, 100);
    const progressBar = document.getElementById('stepsProgress');
    progressBar.style.width = percentage + '%';
    progressBar.textContent = percentage.toFixed(0) + '%';
}

// BMI Functions
function toggleHeightInput() {
    const unit = document.getElementById('heightUnit').value;
    if (unit === 'meters') {
        document.getElementById('heightMetersGroup').classList.remove('hidden');
        document.getElementById('heightFeetGroup').classList.add('hidden');
    } else {
        document.getElementById('heightMetersGroup').classList.add('hidden');
        document.getElementById('heightFeetGroup').classList.remove('hidden');
    }
}

function calculateBMI() {
    const age = parseInt(document.getElementById('bmiAge').value);
    const weight = parseFloat(document.getElementById('bmiWeight').value);
    const unit = document.getElementById('heightUnit').value;

    let heightM;
    if (unit === 'meters') {
        heightM = parseFloat(document.getElementById('bmiHeightM').value);
    } else {
        const heightFt = parseFloat(document.getElementById('bmiHeightFt').value);
        heightM = heightFt * 0.3048;
    }

    if (!age || !weight || !heightM || weight <= 0 || heightM <= 0) {
        showMessage('Please enter valid values!', 'error', 'pageMessage');
        return;
    }

    const bmi = weight / (heightM * heightM);
    let category, color;

    if (bmi < 18.5) {
        category = 'Underweight';
        color = '#f5576c';
    } else if (bmi < 25) {
        category = 'Normal weight';
        color = '#28a745';
    } else if (bmi < 30) {
        category = 'Overweight';
        color = '#ffc107';
    } else {
        category = 'Obese';
        color = '#dc3545';
    }

    const userData = getUserData();
    userData.userInfo = { age, weight, heightM, bmi, category };
    saveUserData(userData);

    const resultHTML = `
                <div class="card" style="background: ${color}; color: white; border: none; margin-top: 20px;">
                    <h3 style="margin-bottom: 20px;">Your BMI Results</h3>
                    <div style="text-align: center; margin: 20px 0;">
                        <div style="font-size: 4em; font-weight: bold;">${bmi.toFixed(1)}</div>
                        <div style="font-size: 1.5em; margin-top: 10px;">${category}</div>
                    </div>
                    <div style="margin-top: 20px;">
                        <p><strong>Age:</strong> ${age} years</p>
                        <p><strong>Weight:</strong> ${weight.toFixed(1)} kg</p>
                        <p><strong>Height:</strong> ${heightM.toFixed(2)} m</p>
                    </div>
                </div>
            `;

    document.getElementById('bmiResult').innerHTML = resultHTML;
    showMessage('BMI calculated successfully!', 'success', 'pageMessage');
}

function loadBMI() {
    const userData = getUserData();
    if (userData.userInfo && userData.userInfo.bmi) {
        const info = userData.userInfo;
        let color;
        if (info.bmi < 18.5) color = '#f5576c';
        else if (info.bmi < 25) color = '#28a745';
        else if (info.bmi < 30) color = '#ffc107';
        else color = '#dc3545';

        const resultHTML = `
                    <div class="card" style="background: ${color}; color: white; border: none; margin-top: 20px;">
                        <h3 style="margin-bottom: 20px;">Your Current BMI</h3>
                        <div style="text-align: center; margin: 20px 0;">
                            <div style="font-size: 4em; font-weight: bold;">${info.bmi.toFixed(1)}</div>
                            <div style="font-size: 1.5em; margin-top: 10px;">${info.category}</div>
                        </div>
                        <div style="margin-top: 20px;">
                            <p><strong>Age:</strong> ${info.age} years</p>
                            <p><strong>Weight:</strong> ${info.weight.toFixed(1)} kg</p>
                            <p><strong>Height:</strong> ${info.heightM.toFixed(2)} m</p>
                        </div>
                    </div>
                `;
        document.getElementById('bmiResult').innerHTML = resultHTML;
    }
}

// Goals Functions
function saveGoals() {
    const userData = getUserData();

    userData.goals.water = parseFloat(document.getElementById('goalWater').value) || userData.goals.water;
    userData.goals.caloriesBurned = parseFloat(document.getElementById('goalCalories').value) || userData.goals.caloriesBurned;
    userData.goals.exerciseMinutes = parseFloat(document.getElementById('goalExercise').value) || userData.goals.exerciseMinutes;
    userData.goals.sleepHours = parseFloat(document.getElementById('goalSleep').value) || userData.goals.sleepHours;
    userData.goals.steps = parseInt(document.getElementById('goalSteps').value) || userData.goals.steps;

    saveUserData(userData);
    showMessage('Goals saved successfully!', 'success', 'pageMessage');
    loadGoals();
}

function loadGoals() {
    const userData = getUserData();
    const goals = userData.goals;

    document.getElementById('goalWater').value = goals.water;
    document.getElementById('goalCalories').value = goals.caloriesBurned;
    document.getElementById('goalExercise').value = goals.exerciseMinutes;
    document.getElementById('goalSleep').value = goals.sleepHours;
    document.getElementById('goalSteps').value = goals.steps;

    const goalsHTML = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${goals.water}L</div>
                        <div class="stat-label">Water Goal</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${goals.caloriesBurned}</div>
                        <div class="stat-label">Calories to Burn</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${goals.exerciseMinutes}min</div>
                        <div class="stat-label">Exercise Minutes</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${goals.sleepHours}h</div>
                        <div class="stat-label">Sleep Hours</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${goals.steps}</div>
                        <div class="stat-label">Daily Steps</div>
                    </div>
                </div>
            `;

    document.getElementById('currentGoals').innerHTML = goalsHTML;
}

// Summary Functions
function loadSummary() {
    const userData = getUserData();

    // Calculate totals
    let totalCal = 0, totalProt = 0, totalCarb = 0, totalFat = 0;
    for (const meal of Object.values(userData.meals)) {
        totalCal += meal.calories;
        totalProt += meal.protein;
        totalCarb += meal.carbs;
        totalFat += meal.fat;
    }

    let totalDur = 0, totalBurned = 0;
    for (const ex of Object.values(userData.exercises)) {
        totalDur += ex.duration;
        totalBurned += ex.calories;
    }

    // Check goals
    let goalsAchieved = 0;
    const goalChecks = [];

    if (userData.water >= userData.goals.water) {
        goalsAchieved++;
        goalChecks.push('<div class="message success">✅ Water intake goal achieved!</div>');
    } else {
        goalChecks.push('<div class="message error">❌ Water intake goal not achieved</div>');
    }

    if (totalDur >= userData.goals.exerciseMinutes) {
        goalsAchieved++;
        goalChecks.push('<div class="message success">✅ Exercise minutes goal achieved!</div>');
    } else {
        goalChecks.push('<div class="message error">❌ Exercise minutes goal not achieved</div>');
    }

    if (totalBurned >= userData.goals.caloriesBurned) {
        goalsAchieved++;
        goalChecks.push('<div class="message success">✅ Calories burned goal achieved!</div>');
    } else {
        goalChecks.push('<div class="message error">❌ Calories burned goal not achieved</div>');
    }

    if (userData.sleep >= userData.goals.sleepHours) {
        goalsAchieved++;
        goalChecks.push('<div class="message success">✅ Sleep hours goal achieved!</div>');
    } else {
        goalChecks.push('<div class="message error">❌ Sleep hours goal not achieved</div>');
    }

    if (userData.steps >= userData.goals.steps) {
        goalsAchieved++;
        goalChecks.push('<div class="message success">✅ Steps goal achieved!</div>');
    } else {
        goalChecks.push('<div class="message error">❌ Steps goal not achieved</div>');
    }

    const summaryHTML = `
                <div class="card" style="background: linear-gradient(135deg, #2563eb 0%, #64748b 100%); color: white; border: none;">
                    <h3 style="margin-bottom: 20px;">Goals Achievement</h3>
                    <div style="text-align: center;">
                        <div style="font-size: 4em; font-weight: bold;">${goalsAchieved}/5</div>
                        <div style="font-size: 1.2em;">Goals Achieved Today</div>
                    </div>
                </div>

                <h3 style="margin: 30px 0 15px;">Nutrition Summary</h3>
                <div class="card">
                    <div class="stats-grid">
                        <div style="text-align: center;">
                            <div style="font-size: 2em; font-weight: bold; color: #2563eb;">${totalCal.toFixed(1)}</div>
                            <div>Total Calories</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2em; font-weight: bold; color: #2563eb;">${totalProt.toFixed(1)}g</div>
                            <div>Total Protein</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2em; font-weight: bold; color: #2563eb;">${totalCarb.toFixed(1)}g</div>
                            <div>Total Carbs</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2em; font-weight: bold; color: #2563eb;">${totalFat.toFixed(1)}g</div>
                            <div>Total Fat</div>
                        </div>
                    </div>
                    <p style="margin-top: 15px; color: #666;">Meals logged: ${Object.keys(userData.meals).length}</p>
                </div>

                <h3 style="margin: 30px 0 15px;">Hydration & Activity</h3>
                <div class="card">
                    <p><strong>Water Intake:</strong> ${userData.water.toFixed(1)}L / ${userData.goals.water}L</p>
                    <p><strong>Exercise Duration:</strong> ${totalDur.toFixed(0)} min / ${userData.goals.exerciseMinutes} min</p>
                    <p><strong>Calories Burned:</strong> ${totalBurned.toFixed(0)} / ${userData.goals.caloriesBurned}</p>
                    <p><strong>Steps:</strong> ${userData.steps} / ${userData.goals.steps}</p>
                </div>

                <h3 style="margin: 30px 0 15px;">Sleep & Wellness</h3>
                <div class="card">
                    <p><strong>Sleep Hours:</strong> ${userData.sleep.toFixed(1)}h / ${userData.goals.sleepHours}h</p>
                    <p><strong>Mood:</strong> ${userData.mood || 'Not recorded'} ${userData.moodIcon || ''}</p>
                    ${userData.userInfo.bmi ? `<p><strong>BMI:</strong> ${userData.userInfo.bmi.toFixed(1)} (${userData.userInfo.category})</p>` : ''}
                </div>

                <h3 style="margin: 30px 0 15px;">Goal Status</h3>
                ${goalChecks.join('')}
            `;

    document.getElementById('summaryContent').innerHTML = summaryHTML;
}

// History Functions
function saveToHistory() {
    const userData = getUserData();
    const date = new Date().toLocaleString();

    // Calculate totals
    let totalCal = 0, totalProt = 0, totalCarb = 0, totalFat = 0;
    for (const meal of Object.values(userData.meals)) {
        totalCal += meal.calories;
        totalProt += meal.protein;
        totalCarb += meal.carbs;
        totalFat += meal.fat;
    }

    let totalDur = 0, totalBurned = 0;
    for (const ex of Object.values(userData.exercises)) {
        totalDur += ex.duration;
        totalBurned += ex.calories;
    }

    let goalsAchieved = 0;
    if (userData.water >= userData.goals.water) goalsAchieved++;
    if (totalDur >= userData.goals.exerciseMinutes) goalsAchieved++;
    if (totalBurned >= userData.goals.caloriesBurned) goalsAchieved++;
    if (userData.sleep >= userData.goals.sleepHours) goalsAchieved++;
    if (userData.steps >= userData.goals.steps) goalsAchieved++;

    const historyEntry = {
        date: date,
        meals: Object.keys(userData.meals).length,
        totalCalories: totalCal,
        totalProtein: totalProt,
        totalCarbs: totalCarb,
        totalFat: totalFat,
        water: userData.water,
        exercises: Object.keys(userData.exercises).length,
        exerciseDuration: totalDur,
        caloriesBurned: totalBurned,
        sleep: userData.sleep,
        steps: userData.steps,
        mood: userData.mood,
        goalsAchieved: goalsAchieved
    };

    userData.history.unshift(historyEntry);
    saveUserData(userData);

    showMessage('Today\'s data saved to history!', 'success', 'pageMessage');
    loadHistory();
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all history? This cannot be undone!')) {
        const userData = getUserData();
        userData.history = [];
        saveUserData(userData);
        showMessage('History cleared!', 'success', 'pageMessage');
        loadHistory();
    }
}

function loadHistory() {
    const userData = getUserData();
    const historyContent = document.getElementById('historyContent');

    if (userData.history.length === 0) {
        historyContent.innerHTML = '<div class="empty-state"><div class="empty-icon">📅</div><p>No history records yet</p></div>';
        return;
    }

    let html = '';
    for (const entry of userData.history) {
        html += `
                    <div class="history-entry">
                        <div class="history-date">📅 ${entry.date}</div>
                        
                        <div class="history-section">
                            <h4>Nutrition</h4>
                            <p>Meals: ${entry.meals} | Calories: ${entry.totalCalories.toFixed(1)} kcal | Protein: ${entry.totalProtein.toFixed(1)}g | Carbs: ${entry.totalCarbs.toFixed(1)}g | Fat: ${entry.totalFat.toFixed(1)}g</p>
                        </div>
                        
                        <div class="history-section">
                            <h4>Hydration & Activity</h4>
                            <p>Water: ${entry.water.toFixed(1)}L | Exercises: ${entry.exercises} | Duration: ${entry.exerciseDuration.toFixed(0)} min | Burned: ${entry.caloriesBurned.toFixed(0)} kcal | Steps: ${entry.steps}</p>
                        </div>
                        
                        <div class="history-section">
                            <h4>Sleep & Wellness</h4>
                            <p>Sleep: ${entry.sleep.toFixed(1)}h | Mood: ${entry.mood || 'Not recorded'}</p>
                        </div>
                        
                        <div class="history-section">
                            <h4>Goals Achievement</h4>
                            <p><strong>${entry.goalsAchieved}/5</strong> goals achieved</p>
                        </div>
                    </div>
                `;
    }

    historyContent.innerHTML = html;
}

// Enter key handlers
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.id === 'loginUsername' || activeElement.id === 'loginPassword') {
            login();
        } else if (activeElement.id === 'regUsername' || activeElement.id === 'regPassword' || activeElement.id === 'regConfirmPassword') {
            register();
        } else if (activeElement.id === 'customWater') {
            addCustomWater();
        } else if (activeElement.id === 'customSteps') {
            addCustomSteps();
        }
    }
});
// Check if user was logged in before refresh
window.addEventListener('DOMContentLoaded', function () {
    const savedUser = sessionStorage.getItem('currentUser');

    if (savedUser) {
        const users = JSON.parse(localStorage.getItem('users'));

        if (users[savedUser]) {
            // User exists, log them in automatically
            currentUser = savedUser;
            document.getElementById('authPage').classList.add('hidden');
            document.getElementById('mainApp').classList.remove('hidden');
            document.getElementById('currentUserName').textContent = `Welcome, ${savedUser}!`;
            loadDashboard();
        } else {
            // User was deleted, clear the sticky note
            sessionStorage.removeItem('currentUser');
        }
    }
});
