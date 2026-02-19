// ILM.NET Main Application
class ILMNET {
    constructor() {
        this.user = null;
        this.token = localStorage.getItem('token');
        this.theme = 'theme-adult';
        this.init();
    }

    async init() {
        console.log('🚀 Initializing ILM.NET...');
        
        if (this.token) {
            await this.verifyToken();
        } else {
            this.showLoginScreen();
        }

        this.setupEventListeners();
        
        setTimeout(() => {
            document.querySelector('.loading-screen').style.display = 'none';
        }, 1000);
    }

    async verifyToken() {
        try {
            const response = await fetch('/api/auth/verify', {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.user = data.user;
                this.applyTheme(this.user.age);
                this.showDashboard();
            } else {
                this.token = null;
                localStorage.removeItem('token');
                this.showLoginScreen();
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            this.showLoginScreen();
        }
    }

    applyTheme(age) {
        if (age < 13) this.theme = 'theme-child';
        else if (age < 20) this.theme = 'theme-teen';
        else if (age < 36) this.theme = 'theme-young-adult';
        else if (age < 65) this.theme = 'theme-adult';
        else this.theme = 'theme-senior';
        
        document.body.classList.add(this.theme);
    }

    showLoginScreen() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="login-container">
                <div class="login-box">
                    <h1>ILM.NET</h1>
                    <p class="subtitle">Islamic Learning Network</p>
                    
                    <div class="login-tabs">
                        <button class="tab-btn active" data-tab="login">Login</button>
                        <button class="tab-btn" data-tab="register">Register</button>
                    </div>
                    
                    <div id="loginForm" class="form-container active">
                        <input type="text" id="loginUsername" placeholder="Username" class="input-field">
                        <input type="password" id="loginPassword" placeholder="Password" class="input-field">
                        <button id="loginBtn" class="btn-primary">Login</button>
                        <div class="social-login">
                            <button class="btn-google"><i class="fab fa-google"></i> Google</button>
                            <button class="btn-facebook"><i class="fab fa-facebook"></i> Facebook</button>
                        </div>
                    </div>
                    
                    <div id="registerForm" class="form-container">
                        <input type="text" id="regUsername" placeholder="Username" class="input-field">
                        <input type="number" id="regAge" placeholder="Age" class="input-field">
                        <input type="email" id="regEmail" placeholder="Email" class="input-field">
                        <input type="password" id="regPassword" placeholder="Password" class="input-field">
                        <input type="password" id="regConfirm" placeholder="Confirm Password" class="input-field">
                        <button id="registerBtn" class="btn-primary">Register</button>
                    </div>
                </div>
            </div>
        `;
        
        this.setupAuthListeners();
    }

    showDashboard() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="dashboard">
                <header class="dashboard-header">
                    <div class="logo">ILM.NET</div>
                    <div class="user-menu">
                        <span>Welcome, ${this.user?.username}</span>
                        <button id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</button>
                    </div>
                </header>
                
                <div class="main-content">
                    <h1>Islamic Learning Dashboard</h1>
                    <p>Continue your journey of knowledge</p>
                    
                    <!-- Five Pillars Section -->
                    <div class="section">
                        <h2 class="section-title"><i class="fas fa-star"></i> The Five Pillars of Islam</h2>
                        <div class="pillars-grid" id="pillarsContainer">
                            ${this.renderPillars()}
                        </div>
                    </div>
                    
                    <!-- Learning Tools Section -->
                    <div class="section">
                        <h2 class="section-title"><i class="fas fa-tools"></i> Learning Tools</h2>
                        <div class="tools-grid" id="toolsContainer">
                            ${this.renderTools()}
                        </div>
                    </div>
                    
                    <!-- Aqidah Section -->
                    <div class="section">
                        <h2 class="section-title"><i class="fas fa-book-open"></i> Theology (Aqidah)</h2>
                        <div class="aqidah-grid" id="aqidahContainer">
                            ${this.renderAqidah()}
                        </div>
                    </div>
                    
                    <!-- Ethics Section -->
                    <div class="section">
                        <h2 class="section-title"><i class="fas fa-balance-scale"></i> Ethics & Social Justice</h2>
                        <div class="ethics-grid" id="ethicsContainer">
                            ${this.renderEthics()}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
    }

    renderPillars() {
        const pillars = [
            { name: 'Shahada', arabic: 'الشهادة', icon: 'fa-star-and-crescent', color: '#0c3b2e' },
            { name: 'Salat', arabic: 'الصلاة', icon: 'fa-pray', color: '#1a5c48' },
            { name: 'Zakat', arabic: 'الزكاة', icon: 'fa-hand-holding-heart', color: '#d4af37' },
            { name: 'Sawm', arabic: 'الصوم', icon: 'fa-cloud-sun', color: '#b8860b' },
            { name: 'Hajj', arabic: 'الحج', icon: 'fa-kaaba', color: '#8b4513' }
        ];
        
        return pillars.map(pillar => `
            <div class="pillar-card" style="border-color: ${pillar.color}">
                <div class="pillar-icon"><i class="fas ${pillar.icon}"></i></div>
                <div class="pillar-info">
                    <h3>${pillar.name}</h3>
                    <div class="pillar-arabic">${pillar.arabic}</div>
                </div>
                <button class="pillar-btn" onclick="app.showPillarDetails('${pillar.name}')">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `).join('');
    }

    renderTools() {
        const tools = [
            { name: 'Qur\'an', icon: 'fa-quran', color: '#0c3b2e' },
            { name: 'Hadith', icon: 'fa-book', color: '#1a5c48' },
            { name: 'Duas', icon: 'fa-praying-hands', color: '#d4af37' },
            { name: 'Prayer Times', icon: 'fa-clock', color: '#b8860b' },
            { name: 'Tasbih', icon: 'fa-pray', color: '#8b4513' }
        ];
        
        return tools.map(tool => `
            <div class="tool-card" style="background: ${tool.color}20; border-color: ${tool.color}">
                <i class="fas ${tool.icon} tool-icon" style="color: ${tool.color}"></i>
                <span>${tool.name}</span>
            </div>
        `).join('');
    }

    renderAqidah() {
        const aqidah = [
            { name: 'Belief in Allah', icon: 'fa-sun' },
            { name: 'Belief in Angels', icon: 'fa-dove' },
            { name: 'Belief in Divine Books', icon: 'fa-book-open' },
            { name: 'Belief in Prophets', icon: 'fa-user-check' },
            { name: 'Day of Judgment', icon: 'fa-scale-balanced' },
            { name: 'Divine Decree', icon: 'fa-hand-fist' }
        ];
        
        return aqidah.map(item => `
            <div class="content-card">
                <i class="fas ${item.icon} content-icon"></i>
                <h3>${item.name}</h3>
                <button class="learn-btn">Learn More</button>
            </div>
        `).join('');
    }

    renderEthics() {
        const ethics = [
            { name: 'Equality', icon: 'fa-equals' },
            { name: 'Justice (Adl)', icon: 'fa-scale-balanced' },
            { name: 'Human Rights', icon: 'fa-handshake' }
        ];
        
        return ethics.map(item => `
            <div class="content-card">
                <i class="fas ${item.icon} content-icon"></i>
                <h3>${item.name}</h3>
                <button class="learn-btn">Learn More</button>
            </div>
        `).join('');
    }

    showPillarDetails(pillarName) {
        alert(`Opening ${pillarName} details - This will show full explanation with Quranic verses and importance.`);
    }

    setupAuthListeners() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.form-container').forEach(f => f.classList.remove('active'));
                document.getElementById(btn.dataset.tab + 'Form').classList.add('active');
            });
        });
        
        document.getElementById('loginBtn')?.addEventListener('click', () => this.login());
        document.getElementById('registerBtn')?.addEventListener('click', () => this.register());
    }

    async login() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.token = data.token;
                this.user = data.user;
                localStorage.setItem('token', this.token);
                this.applyTheme(this.user.age);
                this.showDashboard();
            } else {
                alert('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }
    }

    async register() {
        const userData = {
            username: document.getElementById('regUsername').value,
            age: document.getElementById('regAge').value,
            email: document.getElementById('regEmail').value,
            password: document.getElementById('regPassword').value
        };
        
        if (userData.password !== document.getElementById('regConfirm').value) {
            alert('Passwords do not match!');
            return;
        }
        
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            
            if (response.ok) {
                alert('Registration successful! Please login.');
                document.querySelector('[data-tab="login"]').click();
            } else {
                const error = await response.json();
                alert(error.message || 'Registration failed.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        }
    }

    logout() {
        this.user = null;
        this.token = null;
        localStorage.removeItem('token');
        this.showLoginScreen();
    }

    setupEventListeners() {}
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new ILMNET();
});
