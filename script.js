function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '{}');
}

function setUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

async function loadUsersFromJSON() {
  if (!localStorage.getItem('users')) {
    try {
      const response = await fetch('users.json'); // ✅ Fetch users.json
      const data = await response.json();
      localStorage.setItem('users', JSON.stringify(data));
      console.log('Users loaded from users.json');
    } catch (error) {
      console.error('Error loading users from JSON:', error);
    }
  } 
}

loadUsersFromJSON();

function signup() {
  const username = document.getElementById('signup-username')?.value;
  const gmail = document.getElementById('signup-gmail')?.value;
  const password = document.getElementById('signup-password')?.value;
  const country = document.getElementById('signup-country')?.value;

  if (!username || !gmail || !password || !country) {
    showMessage('Please fill in all fields.');
    return;
  }

  const users = getUsers();
  if (users[username]) {
    showMessage('Username already exists.');
    return;
  }

  users[username] = { gmail, password, country, wins: 0, losses: 0, draws: 0 };
  setUsers(users);
  localStorage.setItem('currentUser', username);
  window.location.href = 'menu.html';
}

function login() {
  const username = document.getElementById('login-username')?.value;
  const password = document.getElementById('login-password')?.value;

  if (!username || !password) {
    showMessage('Please fill in all fields.');
    return;
  }

  const users = getUsers();
  if (users[username] && users[username].password === password) {
    localStorage.setItem('currentUser', username);
    window.location.href = 'menu.html';
  }
}

function showMessage(msg) {
  const msgEl = document.getElementById('auth-msg');
  if (msgEl) msgEl.textContent = msg;
}

// Menu page: show username and logout
if (document.getElementById('currentUser')) {
  const username = localStorage.getItem('currentUser');
  document.getElementById('currentUser').textContent = username || 'Guest';
}

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// Profile page: load and show user info
if (document.getElementById('username')) {
  const username = localStorage.getItem('currentUser');
  const users = getUsers();
  if (!username || !users[username]) {
    window.location.href = 'login.html';
  } else {
    const user = users[username];
    document.getElementById('username').textContent = username;
    document.getElementById('gmail').textContent = user.gmail;
    document.getElementById('country').textContent = user.country;
    document.getElementById('wins').textContent = user.wins;
    document.getElementById('losses').textContent = user.losses;
    document.getElementById('draws').textContent = user.draws;
  }
}

// Game page logic
if (document.getElementById('choices')) {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode'); // 'practice' or 'random'
  const modeText = document.getElementById('mode-text');
  const resultDiv = document.getElementById('result');
  let userChoice = null;

  if (!localStorage.getItem('currentUser')) {
    alert('Please login first.');
    window.location.href = 'login.html';
  }

  if (mode === 'practice') {
    modeText.textContent = 'Play vs Yourself (Practice Mode)';
  } else if (mode === 'random') {
    modeText.textContent = 'Play vs Random Player';
  } else {
    modeText.textContent = 'Unknown mode, redirecting to menu...';
    setTimeout(() => window.location.href = 'menu.html', 2000);
  }

  function pickRandom() {
    const choices = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function decideWinner(user, opponent) {
    if (user === opponent) return 'Draw';
    if (
      (user === 'rock' && opponent === 'scissors') ||
      (user === 'paper' && opponent === 'rock') ||
      (user === 'scissors' && opponent === 'paper')
    ) return 'You Win!';
    return 'You Lose!';
  }

  function updateUserRecord(result) {
    const username = localStorage.getItem('currentUser');
    const users = getUsers();
    if (!users[username]) return;

    if (result === 'You Win!') users[username].wins++;
    else if (result === 'You Lose!') users[username].losses++;
    else if (result === 'Draw') users[username].draws++;

    setUsers(users);
  }

  document.getElementById('choices').addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;
    userChoice = e.target.getAttribute('data-choice');
    let opponentChoice;

    if (mode === 'practice') {
      opponentChoice = userChoice; // mirror for practice
    } else {
      opponentChoice = pickRandom();
    }

    const outcome = decideWinner(userChoice, opponentChoice);

    resultDiv.innerHTML = `
      You chose: <b>${userChoice}</b><br />
      Opponent chose: <b>${opponentChoice}</b><br />
      Result: <b>${outcome}</b>
    `;

    updateUserRecord(outcome);
  });
}

// Auth page: load current user if exists
if (document.getElementById('currentUser')) {
  const username = localStorage.getItem('currentUser');
  if (username) {
    document.getElementById('currentUser').textContent = `Welcome, ${username}!`;
  } else {
    document.getElementById('currentUser').textContent = 'Welcome, Guest!';
  }
}

if (document.getElementById('logout-btn')) {
  document.getElementById('logout-btn').addEventListener('click', logout);
}

if (document.getElementById('signup-btn')) {
  document.getElementById('signup-btn').addEventListener('click', signup);
}

if (document.getElementById('login-btn')) {
  document.getElementById('login-btn').addEventListener('click', login);
}

if (document.getElementById('auth-msg')) {
  document.getElementById('auth-msg').textContent = '';
}

if (document.getElementById('mode-text')) {
  document.getElementById('mode-text').textContent = '';
}

if (document.getElementById('result')) {
  document.getElementById('result').innerHTML = '';
}

// Profile page: show current user
if (document.getElementById('currentUser')) {
  const username = localStorage.getItem('currentUser');
  if (username) {
    document.getElementById('currentUser').textContent = `Current User: ${username}`;
  } else {
    document.getElementById('currentUser').textContent = 'No user logged in';
  }
}

if (document.getElementById('country')) {
  const username = localStorage.getItem('currentUser');
  const users = getUsers();
  if (username && users[username]) {
    document.getElementById('country').textContent = users[username].country;
  } else {
    document.getElementById('country').textContent = 'N/A';
  }
}

if (document.getElementById('wins')) {
  const username = localStorage.getItem('currentUser');
  const users = getUsers();
  if (username && users[username]) {
    document.getElementById('wins').textContent = users[username].wins;
  } else {
    document.getElementById('wins').textContent = '0';
  }
}

if (document.getElementById('losses')) {
  const username = localStorage.getItem('currentUser');
  const users = getUsers();
  if (username && users[username]) {
    document.getElementById('losses').textContent = users[username].losses;
  } else {
    document.getElementById('losses').textContent = '0';
  }
}

if (document.getElementById('draws')) {
  const username = localStorage.getItem('currentUser');
  const users = getUsers();
  if (username && users[username]) {
    document.getElementById('draws').textContent = users[username].draws;
  } else {
    document.getElementById('draws').textContent = '0';
  }
}

if (document.getElementById('signup-username')) {
  document.getElementById('signup-username').addEventListener('input', () => {
    showMessage('');
  });
}

if (document.getElementById('signup-gmail')) {
  document.getElementById('signup-gmail').addEventListener('input', () => {
    showMessage('');
  });
}

if (document.getElementById('signup-password')) {
  document.getElementById('signup-password').addEventListener('input', () => {
    showMessage('');
  });
}

if (document.getElementById('signup-country')) {
  document.getElementById('signup-country').addEventListener('input', () => {
    showMessage('');
  });
}

if (document.getElementById('login-username')) {
  document.getElementById('login-username').addEventListener('input', () => {
    showMessage('');
  });
}

if (document.getElementById('login-password')) {
  document.getElementById('login-password').addEventListener('input', () => {
    showMessage('');
  });
}

if (document.getElementById('auth-msg')) {
  document.getElementById('auth-msg').textContent = '';
}

if (document.getElementById('mode-text')) {
  document.getElementById('mode-text').textContent = '';
}

if (document.getElementById('result')) {
  document.getElementById('result').innerHTML = '';
}

if (document.getElementById('choices')) {
  document.getElementById('choices').innerHTML = `
    <button data-choice="rock">Rock</button>
    <button data-choice="paper">Paper</button>
    <button data-choice="scissors">Scissors</button>
  `;
}

if (document.getElementById('choices')) {
  document.getElementById('choices').addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
      const userChoice = e.target.getAttribute('data-choice');
      // Handle the user's choice
      console.log(`User chose: ${userChoice}`);
    }
  });
}

if (document.getElementById('currentUser')) {
  const username = localStorage.getItem('currentUser');
  document.getElementById('currentUser').textContent = username || 'Guest';
}




