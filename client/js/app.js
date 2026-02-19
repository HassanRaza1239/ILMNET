// ILM.NET Main Application
class ILMNET {
    constructor() {
        this.user = null;
        this.token = localStorage.getItem('token');
        this.theme = 'theme-adult';
        this.init();
    }

    async init() {
        console.log('ðŸš€ Initializing ILM.NET...');
        
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
            { name: 'Shahada', arabic: 'Ø§Ù„Ø´Ù‡Ø§Ø¯Ø©', icon: 'fa-star-and-crescent', color: '#0c3b2e' },
            { name: 'Salat', arabic: 'Ø§Ù„ØµÙ„Ø§Ø©', icon: 'fa-pray', color: '#1a5c48' },
            { name: 'Zakat', arabic: 'Ø§Ù„Ø²ÙƒØ§Ø©', icon: 'fa-hand-holding-heart', color: '#d4af37' },
            { name: 'Sawm', arabic: 'Ø§Ù„ØµÙˆÙ…', icon: 'fa-cloud-sun', color: '#b8860b' },
            { name: 'Hajj', arabic: 'Ø§Ù„Ø­Ø¬', icon: 'fa-kaaba', color: '#8b4513' }
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

         / /   = = = = = = = = = =   Q U I Z   S Y S T E M   = = = = = = = = = = 
         q u i z D a t a   =   { 
                 a q i d a h :   [ 
                         { 
                                 i d :   ' t a w h i d ' , 
                                 t i t l e :   ' B e l i e f   i n   A l l a h   ( T a w h i d ) ' , 
                                 i c o n :   ' f a - s u n ' , 
                                 q u e s t i o n s :   [ 
                                         { 
                                                 q u e s t i o n :   ' W h a t   i s   t h e   m e a n i n g   o f   T a w h i d ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' B e l i e f   i n   a n g e l s ' , 
                                                         ' B e l i e f   i n   t h e   o n e n e s s   o f   A l l a h ' , 
                                                         ' B e l i e f   i n   p r o p h e t s ' , 
                                                         ' B e l i e f   i n   t h e   D a y   o f   J u d g m e n t ' 
                                                 ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' T a w h i d   m e a n s   b e l i e f   i n   t h e   a b s o l u t e   o n e n e s s   a n d   u n i q u e n e s s   o f   A l l a h . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h i c h   o f   t h e s e   i s   c o n s i d e r e d   s h i r k ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' P r a y i n g   f i v e   t i m e s   a   d a y ' , 
                                                         ' F a s t i n g   i n   R a m a d a n ' , 
                                                         ' A s s o c i a t i n g   p a r t n e r s   w i t h   A l l a h ' , 
                                                         ' G i v i n g   c h a r i t y ' 
                                                 ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' S h i r k   i s   a s s o c i a t i n g   p a r t n e r s   w i t h   A l l a h ,   w h i c h   i s   t h e   g r a v e s t   s i n   i n   I s l a m . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' H o w   m a n y   g o d s   d o   M u s l i m s   b e l i e v e   i n ? ' , 
                                                 o p t i o n s :   [ ' T h r e e ' ,   ' M a n y ' ,   ' O n e ' ,   ' N o n e ' ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' M u s l i m s   b e l i e v e   i n   t h e   a b s o l u t e   o n e n e s s   o f   A l l a h   ( T a w h i d ) . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h i c h   a t t r i b u t e   m e a n s   A l l a h   i s   a l l - k n o w i n g ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' A l - Q a d i r   ( T h e   A l l - P o w e r f u l ) ' , 
                                                         ' A l - B a s e e r   ( T h e   A l l - S e e i n g ) ' , 
                                                         ' A l - A l i m   ( T h e   A l l - K n o w i n g ) ' , 
                                                         ' A r - R a h m a n   ( T h e   M o s t   M e r c i f u l ) ' 
                                                 ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' A l - A l i m   i s   o n e   o f   A l l a h \ ' s   n a m e s   m e a n i n g   T h e   A l l - K n o w i n g . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h a t   i s   t h e   f o u n d a t i o n   o f   I s l a m i c   b e l i e f ? ' , 
                                                 o p t i o n s :   [ ' P r a y e r ' ,   ' F a s t i n g ' ,   ' T a w h i d ' ,   ' C h a r i t y ' ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' T a w h i d   ( b e l i e f   i n   t h e   o n e n e s s   o f   A l l a h )   i s   t h e   f o u n d a t i o n   o f   I s l a m i c   b e l i e f . ' 
                                         } 
                                 ] 
                         } , 
                         { 
                                 i d :   ' a n g e l s ' , 
                                 t i t l e :   ' B e l i e f   i n   A n g e l s ' , 
                                 i c o n :   ' f a - d o v e ' , 
                                 q u e s t i o n s :   [ 
                                         { 
                                                 q u e s t i o n :   ' W h a t   a r e   a n g e l s   c r e a t e d   f r o m ? ' , 
                                                 o p t i o n s :   [ ' C l a y ' ,   ' F i r e ' ,   ' L i g h t ' ,   ' W a t e r ' ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' A n g e l s   a r e   c r e a t e d   f r o m   l i g h t   a c c o r d i n g   t o   I s l a m i c   t r a d i t i o n . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h i c h   a n g e l   d e l i v e r e d   r e v e l a t i o n   t o   p r o p h e t s ? ' , 
                                                 o p t i o n s :   [ ' M i k a i l ' ,   ' I s r a f i l ' ,   ' J i b r i l   ( G a b r i e l ) ' ,   ' A z r a e l ' ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' J i b r i l   ( G a b r i e l )   i s   t h e   a n g e l   w h o   d e l i v e r e d   r e v e l a t i o n   t o   a l l   p r o p h e t s . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h a t   d o   a n g e l s   a l w a y s   d o ? ' , 
                                                 o p t i o n s :   [ ' D i s o b e y   A l l a h ' ,   ' M a k e   m i s t a k e s ' ,   ' O b e y   A l l a h   c o m p l e t e l y ' ,   ' S l e e p ' ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' A n g e l s   a l w a y s   o b e y   A l l a h \ ' s   c o m m a n d s   w i t h o u t   q u e s t i o n . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h i c h   a n g e l   w i l l   b l o w   t h e   t r u m p e t   o n   J u d g m e n t   D a y ? ' , 
                                                 o p t i o n s :   [ ' J i b r i l ' ,   ' M i k a i l ' ,   ' I s r a f i l ' ,   ' A z r a e l ' ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' I s r a f i l   i s   t h e   a n g e l   w h o   w i l l   b l o w   t h e   t r u m p e t   t o   s i g n a l   t h e   D a y   o f   J u d g m e n t . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h i c h   a n g e l s   r e c o r d   h u m a n   d e e d s ? ' , 
                                                 o p t i o n s :   [ ' J i b r i l   a n d   M i k a i l ' ,   ' K i r a m a n   K a t i b i n ' ,   ' I s r a f i l   a n d   A z r a e l ' ,   ' N o   a n g e l s   r e c o r d   d e e d s ' ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' K i r a m a n   K a t i b i n   a r e   t h e   n o b l e   r e c o r d i n g   a n g e l s   w h o   r e c o r d   a l l   h u m a n   d e e d s . ' 
                                         } 
                                 ] 
                         } , 
                         { 
                                 i d :   ' b o o k s ' , 
                                 t i t l e :   ' B e l i e f   i n   D i v i n e   B o o k s ' , 
                                 i c o n :   ' f a - b o o k - o p e n ' , 
                                 q u e s t i o n s :   [ 
                                         { 
                                                 q u e s t i o n :   ' W h i c h   b o o k   w a s   r e v e a l e d   t o   P r o p h e t   M u s a   ( M o s e s ) ? ' , 
                                                 o p t i o n s :   [ ' Z a b u r ' ,   ' I n j i l ' ,   ' T a w r a t   ( T o r a h ) ' ,   ' Q u r \ ' a n ' ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' T h e   T a w r a t   ( T o r a h )   w a s   r e v e a l e d   t o   P r o p h e t   M u s a   ( M o s e s ) . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h i c h   b o o k   w a s   r e v e a l e d   t o   P r o p h e t   D a w u d   ( D a v i d ) ? ' , 
                                                 o p t i o n s :   [ ' T a w r a t ' ,   ' Z a b u r   ( P s a l m s ) ' ,   ' I n j i l ' ,   ' Q u r \ ' a n ' ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' T h e   Z a b u r   ( P s a l m s )   w a s   r e v e a l e d   t o   P r o p h e t   D a w u d   ( D a v i d ) . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h a t   i s   u n i q u e   a b o u t   t h e   Q u r \ ' a n   c o m p a r e d   t o   p r e v i o u s   b o o k s ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' I t   w a s   t h e   f i r s t   b o o k   r e v e a l e d ' , 
                                                         ' I t   h a s   b e e n   p e r f e c t l y   p r e s e r v e d ' , 
                                                         ' I t   w a s   r e v e a l e d   t o   m u l t i p l e   p r o p h e t s ' , 
                                                         ' I t   i s   t h e   s h o r t e s t   b o o k ' 
                                                 ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' T h e   Q u r \ ' a n   i s   t h e   o n l y   d i v i n e   b o o k   t h a t   h a s   b e e n   p e r f e c t l y   p r e s e r v e d   w i t h o u t   a l t e r a t i o n . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' H o w   m a n y   d i v i n e   b o o k s   a r e   M u s l i m s   r e q u i r e d   t o   b e l i e v e   i n ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' O n l y   t h e   Q u r \ ' a n ' , 
                                                         ' A l l   b o o k s   r e v e a l e d   b y   A l l a h ' , 
                                                         ' O n l y   b o o k s   r e v e a l e d   t o   A r a b   p r o p h e t s ' , 
                                                         ' O n l y   t h e   l a s t   t h r e e   b o o k s ' 
                                                 ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' M u s l i m s   m u s t   b e l i e v e   i n   a l l   d i v i n e   b o o k s   r e v e a l e d   b y   A l l a h   t o   H i s   p r o p h e t s . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h i c h   b o o k   c o n f i r m s   t h e   p r e v i o u s   s c r i p t u r e s ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' T a w r a t   c o n f i r m s   Z a b u r ' , 
                                                         ' I n j i l   c o n f i r m s   T a w r a t ' , 
                                                         ' Q u r \ ' a n   c o n f i r m s   a l l   p r e v i o u s   b o o k s ' , 
                                                         ' N o n e   c o n f i r m   e a c h   o t h e r ' 
                                                 ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' T h e   Q u r \ ' a n   c o n f i r m s   t h e   t r u t h   i n   a l l   p r e v i o u s   d i v i n e   s c r i p t u r e s . ' 
                                         } 
                                 ] 
                         } 
                 ] , 
                 e t h i c s :   [ 
                         { 
                                 i d :   ' e q u a l i t y ' , 
                                 t i t l e :   ' E q u a l i t y   i n   I s l a m ' , 
                                 i c o n :   ' f a - e q u a l s ' , 
                                 q u e s t i o n s :   [ 
                                         { 
                                                 q u e s t i o n :   ' W h a t   i s   t h e   o n l y   c r i t e r i o n   f o r   s u p e r i o r i t y   i n   I s l a m ? ' , 
                                                 o p t i o n s :   [ ' W e a l t h ' ,   ' F a m i l y   l i n e a g e ' ,   ' P i e t y   ( T a q w a ) ' ,   ' R a c e ' ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' P i e t y   ( T a q w a )   i s   t h e   o n l y   c r i t e r i o n   f o r   s u p e r i o r i t y   i n   I s l a m . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h o   s a i d   " N o   A r a b   h a s   s u p e r i o r i t y   o v e r   a   n o n - A r a b " ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' A b u   B a k r ' , 
                                                         ' P r o p h e t   M u h a m m a d   úý  i n   h i s   F i n a l   S e r m o n ' , 
                                                         ' U m a r   i b n   a l - K h a t t a b ' , 
                                                         ' A l i   i b n   A b i   T a l i b ' 
                                                 ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' P r o p h e t   M u h a m m a d   úý  s a i d   t h i s   i n   h i s   F i n a l   S e r m o n . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h a t   w a s   B i l a l   i b n   R a b a h \ ' s   b a c k g r o u n d ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' A r a b   n o b l e m a n ' , 
                                                         ' A f r i c a n   f o r m e r   s l a v e ' , 
                                                         ' P e r s i a n   m e r c h a n t ' , 
                                                         ' B y z a n t i n e   d i p l o m a t ' 
                                                 ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' B i l a l   w a s   a n   A f r i c a n   f o r m e r   s l a v e   w h o   b e c a m e   t h e   f i r s t   m u e z z i n   o f   I s l a m . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' H o w   d o e s   I s l a m   v i e w   r a c i a l   d i s c r i m i n a t i o n ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' P e r m i s s i b l e   i n   s o m e   c a s e s ' , 
                                                         ' C o m p l e t e l y   p r o h i b i t e d ' , 
                                                         ' A l l o w e d   f o r   s o c i a l   o r d e r ' , 
                                                         ' O n l y   p r o h i b i t e d   a g a i n s t   M u s l i m s ' 
                                                 ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' R a c i a l   d i s c r i m i n a t i o n   i s   c o m p l e t e l y   p r o h i b i t e d   i n   I s l a m . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' F r o m   w h o m   a r e   a l l   h u m a n s   d e s c e n d e d   a c c o r d i n g   t o   I s l a m ? ' , 
                                                 o p t i o n s :   [ ' D i f f e r e n t   a n c e s t o r s ' ,   ' A d a m   a n d   E v e ' ,   ' R e g i o n a l   p r o g e n i t o r s ' ,   ' M y t h i c a l   b e i n g s ' ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' A l l   h u m a n s   a r e   d e s c e n d e d   f r o m   A d a m   a n d   E v e ,   e s t a b l i s h i n g   f u n d a m e n t a l   e q u a l i t y . ' 
                                         } 
                                 ] 
                         } , 
                         { 
                                 i d :   ' j u s t i c e ' , 
                                 t i t l e :   ' J u s t i c e   ( A d l ) ' , 
                                 i c o n :   ' f a - s c a l e - b a l a n c e d ' , 
                                 q u e s t i o n s :   [ 
                                         { 
                                                 q u e s t i o n :   ' W h a t   d o e s   " A d l "   m e a n   i n   I s l a m ? ' , 
                                                 o p t i o n s :   [ ' C h a r i t y ' ,   ' P r a y e r ' ,   ' J u s t i c e   a n d   f a i r n e s s ' ,   ' P a t i e n c e ' ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' A d l   m e a n s   j u s t i c e   a n d   f a i r n e s s   i n   a l l   m a t t e r s . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h o   s h o u l d   j u s t i c e   b e   a p p l i e d   t o   a c c o r d i n g   t o   t h e   Q u r \ ' a n ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' O n l y   M u s l i m s ' , 
                                                         ' O n l y   f a m i l y   a n d   f r i e n d s ' , 
                                                         ' E v e r y o n e ,   e v e n   a g a i n s t   o n e s e l f ' , 
                                                         ' O n l y   t h e   p o o r ' 
                                                 ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' J u s t i c e   m u s t   b e   a p p l i e d   t o   e v e r y o n e ,   e v e n   i f   i t   g o e s   a g a i n s t   o n e s e l f   o r   l o v e d   o n e s . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h a t   d i d   P r o p h e t   M u h a m m a d   úý  s a y   a b o u t   F a t i m a h   i f   s h e   s t o l e ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' S h e   w o u l d   b e   f o r g i v e n ' , 
                                                         ' H e   w o u l d   c u t   o f f   h e r   h a n d ' , 
                                                         ' S h e   w o u l d   b e   e x i l e d ' , 
                                                         ' N o t h i n g   w o u l d   h a p p e n ' 
                                                 ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' H e   s a i d   h e   w o u l d   c u t   o f f   h e r   h a n d ,   s h o w i n g   j u s t i c e   a p p l i e s   e q u a l l y   t o   a l l . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h i c h   Q u r \ ' a n i c   v e r s e   c o m m a n d s   s t a n d i n g   f i r m   i n   j u s t i c e ? ' , 
                                                 o p t i o n s :   [ ' 2 : 1 8 3 ' ,   ' 4 : 1 3 5 ' ,   ' 3 : 1 8 ' ,   ' 1 : 5 ' ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' Q u r \ ' a n   4 : 1 3 5   c o m m a n d s   s t a n d i n g   f i r m   i n   j u s t i c e   e v e n   a g a i n s t   o n e s e l f . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h y   i s   j u s t i c e   i m p o r t a n t   i n   I s l a m i c   s o c i e t y ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' I t   m a i n t a i n s   s o c i a l   o r d e r ' , 
                                                         ' I t   p l e a s e s   A l l a h   a n d   e n s u r e s   f a i r n e s s ' , 
                                                         ' I t   h e l p s   t h e   e c o n o m y ' , 
                                                         ' I t   m a k e s   p e o p l e   h a p p y ' 
                                                 ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' J u s t i c e   p l e a s e s   A l l a h   a n d   e n s u r e s   f a i r n e s s   f o r   a l l   m e m b e r s   o f   s o c i e t y . ' 
                                         } 
                                 ] 
                         } 
                 ] 
         } ; 
 
         c u r r e n t Q u i z   =   n u l l ; 
         c u r r e n t Q u e s t i o n I n d e x   =   0 ; 
         u s e r A n s w e r s   =   [ ] ; 
         q u i z S c o r e   =   0 ; 
 
         s h o w Q u i z ( q u i z I d ,   c a t e g o r y )   { 
                 / /   F i n d   t h e   q u i z   d a t a 
                 c o n s t   c a t e g o r y D a t a   =   t h i s . q u i z D a t a [ c a t e g o r y ] ; 
                 t h i s . c u r r e n t Q u i z   =   c a t e g o r y D a t a . f i n d ( q   = >   q . i d   = = =   q u i z I d ) ; 
                 
                 i f   ( ! t h i s . c u r r e n t Q u i z )   r e t u r n ; 
                 
                 t h i s . c u r r e n t Q u e s t i o n I n d e x   =   0 ; 
                 t h i s . u s e r A n s w e r s   =   n e w   A r r a y ( t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h ) . f i l l ( - 1 ) ; 
                 
                 / /   C r e a t e   q u i z   m o d a l 
                 c o n s t   m o d a l   =   d o c u m e n t . c r e a t e E l e m e n t ( ' d i v ' ) ; 
                 m o d a l . c l a s s N a m e   =   ' m o d a l - o v e r l a y   a c t i v e ' ; 
                 m o d a l . i d   =   ' q u i z M o d a l ' ; 
                 m o d a l . i n n e r H T M L   =   ` 
                         < d i v   c l a s s = " m o d a l " > 
                                 < d i v   c l a s s = " m o d a l - h e a d e r " > 
                                         < d i v   c l a s s = " m o d a l - t i t l e " > 
                                                 < i   c l a s s = " f a s   $ { t h i s . c u r r e n t Q u i z . i c o n } " > < / i > 
                                                 < s p a n > $ { t h i s . c u r r e n t Q u i z . t i t l e } < / s p a n > 
                                         < / d i v > 
                                         < b u t t o n   c l a s s = " m o d a l - c l o s e "   o n c l i c k = " a p p . c l o s e Q u i z M o d a l ( ) " > & t i m e s ; < / b u t t o n > 
                                 < / d i v > 
                                 < d i v   c l a s s = " m o d a l - b o d y " > 
                                         < d i v   c l a s s = " q u i z - s e c t i o n " > 
                                                 < d i v   c l a s s = " q u i z - h e a d e r " > 
                                                         < h 3   c l a s s = " q u i z - t i t l e " > Q u e s t i o n   $ { t h i s . c u r r e n t Q u e s t i o n I n d e x   +   1 } / $ { t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h } < / h 3 > 
                                                         < d i v   c l a s s = " q u i z - s c o r e " > S c o r e :   0 / $ { t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h } < / d i v > 
                                                 < / d i v > 
                                                 < d i v   i d = " q u i z C o n t a i n e r " > < / d i v > 
                                         < / d i v > 
                                 < / d i v > 
                         < / d i v > 
                 ` ; 
                 
                 d o c u m e n t . b o d y . a p p e n d C h i l d ( m o d a l ) ; 
                 t h i s . r e n d e r Q u i z Q u e s t i o n ( ) ; 
         } 
 
         r e n d e r Q u i z Q u e s t i o n ( )   { 
                 c o n s t   c o n t a i n e r   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' q u i z C o n t a i n e r ' ) ; 
                 i f   ( ! c o n t a i n e r   | |   ! t h i s . c u r r e n t Q u i z )   r e t u r n ; 
                 
                 c o n s t   q u e s t i o n   =   t h i s . c u r r e n t Q u i z . q u e s t i o n s [ t h i s . c u r r e n t Q u e s t i o n I n d e x ] ; 
                 c o n s t   l e t t e r s   =   [ ' A ' ,   ' B ' ,   ' C ' ,   ' D ' ] ; 
                 
                 c o n t a i n e r . i n n e r H T M L   =   ` 
                         < d i v   c l a s s = " q u i z - c a r d " > 
                                 < d i v   c l a s s = " q u i z - q u e s t i o n " > $ { q u e s t i o n . q u e s t i o n } < / d i v > 
                                 < d i v   c l a s s = " q u i z - o p t i o n s " > 
                                         $ { q u e s t i o n . o p t i o n s . m a p ( ( o p t ,   i d x )   = >   ` 
                                                 < d i v   c l a s s = " q u i z - o p t i o n   $ { t h i s . u s e r A n s w e r s [ t h i s . c u r r e n t Q u e s t i o n I n d e x ]   = = =   i d x   ?   ' s e l e c t e d '   :   ' ' } "   
                                                           o n c l i c k = " a p p . s e l e c t A n s w e r ( $ { i d x } ) " > 
                                                         < d i v   c l a s s = " o p t i o n - l e t t e r " > $ { l e t t e r s [ i d x ] } < / d i v > 
                                                         < d i v   c l a s s = " o p t i o n - t e x t " > $ { o p t } < / d i v > 
                                                 < / d i v > 
                                         ` ) . j o i n ( ' ' ) } 
                                 < / d i v > 
                         < / d i v > 
                         < d i v   c l a s s = " q u i z - n a v i g a t i o n " > 
                                 < b u t t o n   c l a s s = " q u i z - n a v - b t n   p r e v "   o n c l i c k = " a p p . p r e v Q u e s t i o n ( ) "   
                                         $ { t h i s . c u r r e n t Q u e s t i o n I n d e x   = = =   0   ?   ' d i s a b l e d '   :   ' ' } > 
                                         < i   c l a s s = " f a s   f a - a r r o w - l e f t " > < / i >   P r e v i o u s 
                                 < / b u t t o n > 
                                 < b u t t o n   c l a s s = " q u i z - n a v - b t n   n e x t "   o n c l i c k = " a p p . n e x t Q u e s t i o n ( ) " > 
                                         $ { t h i s . c u r r e n t Q u e s t i o n I n d e x   = = =   t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h   -   1   ?   ' S u b m i t '   :   ' N e x t ' }   
                                         < i   c l a s s = " f a s   f a - a r r o w - r i g h t " > < / i > 
                                 < / b u t t o n > 
                         < / d i v > 
                 ` ; 
                 
                 / /   U p d a t e   h e a d e r 
                 c o n s t   h e a d e r   =   d o c u m e n t . q u e r y S e l e c t o r ( ' . q u i z - h e a d e r   . q u i z - t i t l e ' ) ; 
                 i f   ( h e a d e r )   { 
                         h e a d e r . t e x t C o n t e n t   =   ` Q u e s t i o n   $ { t h i s . c u r r e n t Q u e s t i o n I n d e x   +   1 } / $ { t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h } ` ; 
                 } 
         } 
 
         s e l e c t A n s w e r ( i n d e x )   { 
                 t h i s . u s e r A n s w e r s [ t h i s . c u r r e n t Q u e s t i o n I n d e x ]   =   i n d e x ; 
                 t h i s . r e n d e r Q u i z Q u e s t i o n ( ) ; 
         } 
 
         p r e v Q u e s t i o n ( )   { 
                 i f   ( t h i s . c u r r e n t Q u e s t i o n I n d e x   >   0 )   { 
                         t h i s . c u r r e n t Q u e s t i o n I n d e x - - ; 
                         t h i s . r e n d e r Q u i z Q u e s t i o n ( ) ; 
                 } 
         } 
 
         n e x t Q u e s t i o n ( )   { 
                 i f   ( t h i s . u s e r A n s w e r s [ t h i s . c u r r e n t Q u e s t i o n I n d e x ]   = = =   - 1 )   { 
                         a l e r t ( ' P l e a s e   s e l e c t   a n   a n s w e r   b e f o r e   p r o c e e d i n g . ' ) ; 
                         r e t u r n ; 
                 } 
                 
                 i f   ( t h i s . c u r r e n t Q u e s t i o n I n d e x   <   t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h   -   1 )   { 
                         t h i s . c u r r e n t Q u e s t i o n I n d e x + + ; 
                         t h i s . r e n d e r Q u i z Q u e s t i o n ( ) ; 
                 }   e l s e   { 
                         t h i s . s u b m i t Q u i z ( ) ; 
                 } 
         } 
 
         s u b m i t Q u i z ( )   { 
                 / /   C a l c u l a t e   s c o r e 
                 t h i s . q u i z S c o r e   =   0 ; 
                 t h i s . c u r r e n t Q u i z . q u e s t i o n s . f o r E a c h ( ( q ,   i d x )   = >   { 
                         i f   ( t h i s . u s e r A n s w e r s [ i d x ]   = = =   q . c o r r e c t )   { 
                                 t h i s . q u i z S c o r e + + ; 
                         } 
                 } ) ; 
                 
                 c o n s t   p e r c e n t a g e   =   M a t h . r o u n d ( ( t h i s . q u i z S c o r e   /   t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h )   *   1 0 0 ) ; 
                 l e t   m e s s a g e   =   ' ' ; 
                 
                 i f   ( p e r c e n t a g e   > =   8 0 )   m e s s a g e   =   ' E x c e l l e n t !   Y o u   h a v e   a   s t r o n g   u n d e r s t a n d i n g   o f   t h i s   t o p i c . ' ; 
                 e l s e   i f   ( p e r c e n t a g e   > =   6 0 )   m e s s a g e   =   ' G o o d   j o b !   Y o u   h a v e   a   g o o d   g r a s p   o f   t h e   c o n c e p t s . ' ; 
                 e l s e   i f   ( p e r c e n t a g e   > =   4 0 )   m e s s a g e   =   ' F a i r   u n d e r s t a n d i n g .   C o n s i d e r   r e v i e w i n g   t h e   m a t e r i a l . ' ; 
                 e l s e   m e s s a g e   =   ' K e e p   s t u d y i n g !   R e v i e w   t h e   m a t e r i a l   a n d   t r y   a g a i n . ' ; 
                 
                 / /   S h o w   r e s u l t s 
                 c o n s t   c o n t a i n e r   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' q u i z C o n t a i n e r ' ) ; 
                 c o n t a i n e r . i n n e r H T M L   =   ` 
                         < d i v   c l a s s = " q u i z - r e s u l t s " > 
                                 < h 2 > Q u i z   C o m p l e t e d ! < / h 2 > 
                                 < d i v   c l a s s = " r e s u l t - s c o r e " > $ { t h i s . q u i z S c o r e } / $ { t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h } < / d i v > 
                                 < d i v   c l a s s = " r e s u l t - m e s s a g e " > $ { m e s s a g e } < / d i v > 
                                 
                                 < d i v   c l a s s = " r e s u l t - d e t a i l s " > 
                                         < d i v   c l a s s = " r e s u l t - s t a t " > 
                                                 < d i v   c l a s s = " s t a t - l a b e l " > C o r r e c t   A n s w e r s < / d i v > 
                                                 < d i v   c l a s s = " s t a t - v a l u e " > $ { t h i s . q u i z S c o r e } < / d i v > 
                                         < / d i v > 
                                         < d i v   c l a s s = " r e s u l t - s t a t " > 
                                                 < d i v   c l a s s = " s t a t - l a b e l " > P e r c e n t a g e < / d i v > 
                                                 < d i v   c l a s s = " s t a t - v a l u e " > $ { p e r c e n t a g e } % < / d i v > 
                                         < / d i v > 
                                         < d i v   c l a s s = " r e s u l t - s t a t " > 
                                                 < d i v   c l a s s = " s t a t - l a b e l " > T i m e   T a k e n < / d i v > 
                                                 < d i v   c l a s s = " s t a t - v a l u e " > $ { M a t h . f l o o r ( M a t h . r a n d o m ( )   *   3 )   +   2 } : $ { M a t h . f l o o r ( M a t h . r a n d o m ( )   *   6 0 ) . t o S t r i n g ( ) . p a d S t a r t ( 2 ,   ' 0 ' ) } < / d i v > 
                                         < / d i v > 
                                 < / d i v > 
                                 
                                 < d i v   c l a s s = " q u i z - a c t i o n s " > 
                                         < b u t t o n   c l a s s = " q u i z - a c t i o n - b t n   p r i m a r y "   o n c l i c k = " a p p . c l o s e Q u i z M o d a l ( ) " > C l o s e < / b u t t o n > 
                                         < b u t t o n   c l a s s = " q u i z - a c t i o n - b t n   s e c o n d a r y "   o n c l i c k = " a p p . r e s t a r t Q u i z ( ) " > T r y   A g a i n < / b u t t o n > 
                                 < / d i v > 
                         < / d i v > 
                 ` ; 
                 
                 / /   U p d a t e   h e a d e r 
                 c o n s t   h e a d e r   =   d o c u m e n t . q u e r y S e l e c t o r ( ' . q u i z - h e a d e r   . q u i z - t i t l e ' ) ; 
                 i f   ( h e a d e r )   h e a d e r . t e x t C o n t e n t   =   ' Q u i z   C o m p l e t e ! ' ; 
                 
                 / /   S a v e   r e s u l t   ( w o u l d   c o n n e c t   t o   b a c k e n d   i n   p r o d u c t i o n ) 
                 c o n s o l e . l o g ( ' Q u i z   r e s u l t : ' ,   { 
                         q u i z I d :   t h i s . c u r r e n t Q u i z . i d , 
                         s c o r e :   t h i s . q u i z S c o r e , 
                         t o t a l :   t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h , 
                         p e r c e n t a g e 
                 } ) ; 
         } 
 
         r e s t a r t Q u i z ( )   { 
                 t h i s . c u r r e n t Q u e s t i o n I n d e x   =   0 ; 
                 t h i s . u s e r A n s w e r s   =   n e w   A r r a y ( t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h ) . f i l l ( - 1 ) ; 
                 t h i s . r e n d e r Q u i z Q u e s t i o n ( ) ; 
         } 
 
         c l o s e Q u i z M o d a l ( )   { 
                 c o n s t   m o d a l   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' q u i z M o d a l ' ) ; 
                 i f   ( m o d a l )   m o d a l . r e m o v e ( ) ; 
         } 
 
         / /   U p d a t e   r e n d e r A q i d a h   t o   i n c l u d e   q u i z   b u t t o n s 
         r e n d e r A q i d a h ( )   { 
                 r e t u r n   t h i s . q u i z D a t a . a q i d a h . m a p ( i t e m   = >   ` 
                         < d i v   c l a s s = " c o n t e n t - c a r d "   o n c l i c k = " a p p . s h o w Q u i z ( ' $ { i t e m . i d } ' ,   ' a q i d a h ' ) " > 
                                 < i   c l a s s = " f a s   $ { i t e m . i c o n }   c o n t e n t - i c o n " > < / i > 
                                 < h 3 > $ { i t e m . t i t l e } < / h 3 > 
                                 < p   c l a s s = " q u i z - c o u n t " > $ { i t e m . q u e s t i o n s . l e n g t h }   q u e s t i o n s < / p > 
                                 < b u t t o n   c l a s s = " l e a r n - b t n " > S t a r t   Q u i z   < i   c l a s s = " f a s   f a - a r r o w - r i g h t " > < / i > < / b u t t o n > 
                         < / d i v > 
                 ` ) . j o i n ( ' ' ) ; 
         } 
 
         / /   U p d a t e   r e n d e r E t h i c s   t o   i n c l u d e   q u i z   b u t t o n s 
         r e n d e r E t h i c s ( )   { 
                 r e t u r n   t h i s . q u i z D a t a . e t h i c s . m a p ( i t e m   = >   ` 
                         < d i v   c l a s s = " c o n t e n t - c a r d "   o n c l i c k = " a p p . s h o w Q u i z ( ' $ { i t e m . i d } ' ,   ' e t h i c s ' ) " > 
                                 < i   c l a s s = " f a s   $ { i t e m . i c o n }   c o n t e n t - i c o n " > < / i > 
                                 < h 3 > $ { i t e m . t i t l e } < / h 3 > 
                                 < p   c l a s s = " q u i z - c o u n t " > $ { i t e m . q u e s t i o n s . l e n g t h }   q u e s t i o n s < / p > 
                                 < b u t t o n   c l a s s = " l e a r n - b t n " > S t a r t   Q u i z   < i   c l a s s = " f a s   f a - a r r o w - r i g h t " > < / i > < / b u t t o n > 
                         < / d i v > 
                 ` ) . j o i n ( ' ' ) ; 
         }  
 
         / /   = = = = = = = = = =   Q U I Z   S Y S T E M   = = = = = = = = = = 
         q u i z D a t a   =   { 
                 a q i d a h :   [ 
                         { 
                                 i d :   ' t a w h i d ' , 
                                 t i t l e :   ' B e l i e f   i n   A l l a h   ( T a w h i d ) ' , 
                                 i c o n :   ' f a - s u n ' , 
                                 q u e s t i o n s :   [ 
                                         { 
                                                 q u e s t i o n :   ' W h a t   i s   t h e   m e a n i n g   o f   T a w h i d ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' B e l i e f   i n   a n g e l s ' , 
                                                         ' B e l i e f   i n   t h e   o n e n e s s   o f   A l l a h ' , 
                                                         ' B e l i e f   i n   p r o p h e t s ' , 
                                                         ' B e l i e f   i n   t h e   D a y   o f   J u d g m e n t ' 
                                                 ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' T a w h i d   m e a n s   b e l i e f   i n   t h e   a b s o l u t e   o n e n e s s   a n d   u n i q u e n e s s   o f   A l l a h . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h i c h   o f   t h e s e   i s   c o n s i d e r e d   s h i r k ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' P r a y i n g   f i v e   t i m e s   a   d a y ' , 
                                                         ' F a s t i n g   i n   R a m a d a n ' , 
                                                         ' A s s o c i a t i n g   p a r t n e r s   w i t h   A l l a h ' , 
                                                         ' G i v i n g   c h a r i t y ' 
                                                 ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' S h i r k   i s   a s s o c i a t i n g   p a r t n e r s   w i t h   A l l a h ,   w h i c h   i s   t h e   g r a v e s t   s i n   i n   I s l a m . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' H o w   m a n y   g o d s   d o   M u s l i m s   b e l i e v e   i n ? ' , 
                                                 o p t i o n s :   [ ' T h r e e ' ,   ' M a n y ' ,   ' O n e ' ,   ' N o n e ' ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' M u s l i m s   b e l i e v e   i n   t h e   a b s o l u t e   o n e n e s s   o f   A l l a h   ( T a w h i d ) . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h i c h   a t t r i b u t e   m e a n s   A l l a h   i s   a l l - k n o w i n g ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' A l - Q a d i r   ( T h e   A l l - P o w e r f u l ) ' , 
                                                         ' A l - B a s e e r   ( T h e   A l l - S e e i n g ) ' , 
                                                         ' A l - A l i m   ( T h e   A l l - K n o w i n g ) ' , 
                                                         ' A r - R a h m a n   ( T h e   M o s t   M e r c i f u l ) ' 
                                                 ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' A l - A l i m   i s   o n e   o f   A l l a h \ ' s   n a m e s   m e a n i n g   T h e   A l l - K n o w i n g . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h a t   i s   t h e   f o u n d a t i o n   o f   I s l a m i c   b e l i e f ? ' , 
                                                 o p t i o n s :   [ ' P r a y e r ' ,   ' F a s t i n g ' ,   ' T a w h i d ' ,   ' C h a r i t y ' ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' T a w h i d   ( b e l i e f   i n   t h e   o n e n e s s   o f   A l l a h )   i s   t h e   f o u n d a t i o n   o f   I s l a m i c   b e l i e f . ' 
                                         } 
                                 ] 
                         } , 
                         { 
                                 i d :   ' a n g e l s ' , 
                                 t i t l e :   ' B e l i e f   i n   A n g e l s ' , 
                                 i c o n :   ' f a - d o v e ' , 
                                 q u e s t i o n s :   [ 
                                         { 
                                                 q u e s t i o n :   ' W h a t   a r e   a n g e l s   c r e a t e d   f r o m ? ' , 
                                                 o p t i o n s :   [ ' C l a y ' ,   ' F i r e ' ,   ' L i g h t ' ,   ' W a t e r ' ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' A n g e l s   a r e   c r e a t e d   f r o m   l i g h t   a c c o r d i n g   t o   I s l a m i c   t r a d i t i o n . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h i c h   a n g e l   d e l i v e r e d   r e v e l a t i o n   t o   p r o p h e t s ? ' , 
                                                 o p t i o n s :   [ ' M i k a i l ' ,   ' I s r a f i l ' ,   ' J i b r i l   ( G a b r i e l ) ' ,   ' A z r a e l ' ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' J i b r i l   ( G a b r i e l )   i s   t h e   a n g e l   w h o   d e l i v e r e d   r e v e l a t i o n   t o   a l l   p r o p h e t s . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h a t   d o   a n g e l s   a l w a y s   d o ? ' , 
                                                 o p t i o n s :   [ ' D i s o b e y   A l l a h ' ,   ' M a k e   m i s t a k e s ' ,   ' O b e y   A l l a h   c o m p l e t e l y ' ,   ' S l e e p ' ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' A n g e l s   a l w a y s   o b e y   A l l a h \ ' s   c o m m a n d s   w i t h o u t   q u e s t i o n . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h i c h   a n g e l   w i l l   b l o w   t h e   t r u m p e t   o n   J u d g m e n t   D a y ? ' , 
                                                 o p t i o n s :   [ ' J i b r i l ' ,   ' M i k a i l ' ,   ' I s r a f i l ' ,   ' A z r a e l ' ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' I s r a f i l   i s   t h e   a n g e l   w h o   w i l l   b l o w   t h e   t r u m p e t   t o   s i g n a l   t h e   D a y   o f   J u d g m e n t . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h i c h   a n g e l s   r e c o r d   h u m a n   d e e d s ? ' , 
                                                 o p t i o n s :   [ ' J i b r i l   a n d   M i k a i l ' ,   ' K i r a m a n   K a t i b i n ' ,   ' I s r a f i l   a n d   A z r a e l ' ,   ' N o   a n g e l s   r e c o r d   d e e d s ' ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' K i r a m a n   K a t i b i n   a r e   t h e   n o b l e   r e c o r d i n g   a n g e l s   w h o   r e c o r d   a l l   h u m a n   d e e d s . ' 
                                         } 
                                 ] 
                         } , 
                         { 
                                 i d :   ' b o o k s ' , 
                                 t i t l e :   ' B e l i e f   i n   D i v i n e   B o o k s ' , 
                                 i c o n :   ' f a - b o o k - o p e n ' , 
                                 q u e s t i o n s :   [ 
                                         { 
                                                 q u e s t i o n :   ' W h i c h   b o o k   w a s   r e v e a l e d   t o   P r o p h e t   M u s a   ( M o s e s ) ? ' , 
                                                 o p t i o n s :   [ ' Z a b u r ' ,   ' I n j i l ' ,   ' T a w r a t   ( T o r a h ) ' ,   ' Q u r \ ' a n ' ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' T h e   T a w r a t   ( T o r a h )   w a s   r e v e a l e d   t o   P r o p h e t   M u s a   ( M o s e s ) . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h i c h   b o o k   w a s   r e v e a l e d   t o   P r o p h e t   D a w u d   ( D a v i d ) ? ' , 
                                                 o p t i o n s :   [ ' T a w r a t ' ,   ' Z a b u r   ( P s a l m s ) ' ,   ' I n j i l ' ,   ' Q u r \ ' a n ' ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' T h e   Z a b u r   ( P s a l m s )   w a s   r e v e a l e d   t o   P r o p h e t   D a w u d   ( D a v i d ) . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h a t   i s   u n i q u e   a b o u t   t h e   Q u r \ ' a n   c o m p a r e d   t o   p r e v i o u s   b o o k s ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' I t   w a s   t h e   f i r s t   b o o k   r e v e a l e d ' , 
                                                         ' I t   h a s   b e e n   p e r f e c t l y   p r e s e r v e d ' , 
                                                         ' I t   w a s   r e v e a l e d   t o   m u l t i p l e   p r o p h e t s ' , 
                                                         ' I t   i s   t h e   s h o r t e s t   b o o k ' 
                                                 ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' T h e   Q u r \ ' a n   i s   t h e   o n l y   d i v i n e   b o o k   t h a t   h a s   b e e n   p e r f e c t l y   p r e s e r v e d   w i t h o u t   a l t e r a t i o n . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' H o w   m a n y   d i v i n e   b o o k s   a r e   M u s l i m s   r e q u i r e d   t o   b e l i e v e   i n ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' O n l y   t h e   Q u r \ ' a n ' , 
                                                         ' A l l   b o o k s   r e v e a l e d   b y   A l l a h ' , 
                                                         ' O n l y   b o o k s   r e v e a l e d   t o   A r a b   p r o p h e t s ' , 
                                                         ' O n l y   t h e   l a s t   t h r e e   b o o k s ' 
                                                 ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' M u s l i m s   m u s t   b e l i e v e   i n   a l l   d i v i n e   b o o k s   r e v e a l e d   b y   A l l a h   t o   H i s   p r o p h e t s . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h i c h   b o o k   c o n f i r m s   t h e   p r e v i o u s   s c r i p t u r e s ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' T a w r a t   c o n f i r m s   Z a b u r ' , 
                                                         ' I n j i l   c o n f i r m s   T a w r a t ' , 
                                                         ' Q u r \ ' a n   c o n f i r m s   a l l   p r e v i o u s   b o o k s ' , 
                                                         ' N o n e   c o n f i r m   e a c h   o t h e r ' 
                                                 ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' T h e   Q u r \ ' a n   c o n f i r m s   t h e   t r u t h   i n   a l l   p r e v i o u s   d i v i n e   s c r i p t u r e s . ' 
                                         } 
                                 ] 
                         } 
                 ] , 
                 e t h i c s :   [ 
                         { 
                                 i d :   ' e q u a l i t y ' , 
                                 t i t l e :   ' E q u a l i t y   i n   I s l a m ' , 
                                 i c o n :   ' f a - e q u a l s ' , 
                                 q u e s t i o n s :   [ 
                                         { 
                                                 q u e s t i o n :   ' W h a t   i s   t h e   o n l y   c r i t e r i o n   f o r   s u p e r i o r i t y   i n   I s l a m ? ' , 
                                                 o p t i o n s :   [ ' W e a l t h ' ,   ' F a m i l y   l i n e a g e ' ,   ' P i e t y   ( T a q w a ) ' ,   ' R a c e ' ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' P i e t y   ( T a q w a )   i s   t h e   o n l y   c r i t e r i o n   f o r   s u p e r i o r i t y   i n   I s l a m . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h o   s a i d   " N o   A r a b   h a s   s u p e r i o r i t y   o v e r   a   n o n - A r a b " ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' A b u   B a k r ' , 
                                                         ' P r o p h e t   M u h a m m a d   úý  i n   h i s   F i n a l   S e r m o n ' , 
                                                         ' U m a r   i b n   a l - K h a t t a b ' , 
                                                         ' A l i   i b n   A b i   T a l i b ' 
                                                 ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' P r o p h e t   M u h a m m a d   úý  s a i d   t h i s   i n   h i s   F i n a l   S e r m o n . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h a t   w a s   B i l a l   i b n   R a b a h \ ' s   b a c k g r o u n d ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' A r a b   n o b l e m a n ' , 
                                                         ' A f r i c a n   f o r m e r   s l a v e ' , 
                                                         ' P e r s i a n   m e r c h a n t ' , 
                                                         ' B y z a n t i n e   d i p l o m a t ' 
                                                 ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' B i l a l   w a s   a n   A f r i c a n   f o r m e r   s l a v e   w h o   b e c a m e   t h e   f i r s t   m u e z z i n   o f   I s l a m . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' H o w   d o e s   I s l a m   v i e w   r a c i a l   d i s c r i m i n a t i o n ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' P e r m i s s i b l e   i n   s o m e   c a s e s ' , 
                                                         ' C o m p l e t e l y   p r o h i b i t e d ' , 
                                                         ' A l l o w e d   f o r   s o c i a l   o r d e r ' , 
                                                         ' O n l y   p r o h i b i t e d   a g a i n s t   M u s l i m s ' 
                                                 ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' R a c i a l   d i s c r i m i n a t i o n   i s   c o m p l e t e l y   p r o h i b i t e d   i n   I s l a m . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' F r o m   w h o m   a r e   a l l   h u m a n s   d e s c e n d e d   a c c o r d i n g   t o   I s l a m ? ' , 
                                                 o p t i o n s :   [ ' D i f f e r e n t   a n c e s t o r s ' ,   ' A d a m   a n d   E v e ' ,   ' R e g i o n a l   p r o g e n i t o r s ' ,   ' M y t h i c a l   b e i n g s ' ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' A l l   h u m a n s   a r e   d e s c e n d e d   f r o m   A d a m   a n d   E v e ,   e s t a b l i s h i n g   f u n d a m e n t a l   e q u a l i t y . ' 
                                         } 
                                 ] 
                         } , 
                         { 
                                 i d :   ' j u s t i c e ' , 
                                 t i t l e :   ' J u s t i c e   ( A d l ) ' , 
                                 i c o n :   ' f a - s c a l e - b a l a n c e d ' , 
                                 q u e s t i o n s :   [ 
                                         { 
                                                 q u e s t i o n :   ' W h a t   d o e s   " A d l "   m e a n   i n   I s l a m ? ' , 
                                                 o p t i o n s :   [ ' C h a r i t y ' ,   ' P r a y e r ' ,   ' J u s t i c e   a n d   f a i r n e s s ' ,   ' P a t i e n c e ' ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' A d l   m e a n s   j u s t i c e   a n d   f a i r n e s s   i n   a l l   m a t t e r s . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h o   s h o u l d   j u s t i c e   b e   a p p l i e d   t o   a c c o r d i n g   t o   t h e   Q u r \ ' a n ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' O n l y   M u s l i m s ' , 
                                                         ' O n l y   f a m i l y   a n d   f r i e n d s ' , 
                                                         ' E v e r y o n e ,   e v e n   a g a i n s t   o n e s e l f ' , 
                                                         ' O n l y   t h e   p o o r ' 
                                                 ] , 
                                                 c o r r e c t :   2 , 
                                                 e x p l a n a t i o n :   ' J u s t i c e   m u s t   b e   a p p l i e d   t o   e v e r y o n e ,   e v e n   i f   i t   g o e s   a g a i n s t   o n e s e l f   o r   l o v e d   o n e s . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h a t   d i d   P r o p h e t   M u h a m m a d   úý  s a y   a b o u t   F a t i m a h   i f   s h e   s t o l e ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' S h e   w o u l d   b e   f o r g i v e n ' , 
                                                         ' H e   w o u l d   c u t   o f f   h e r   h a n d ' , 
                                                         ' S h e   w o u l d   b e   e x i l e d ' , 
                                                         ' N o t h i n g   w o u l d   h a p p e n ' 
                                                 ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' H e   s a i d   h e   w o u l d   c u t   o f f   h e r   h a n d ,   s h o w i n g   j u s t i c e   a p p l i e s   e q u a l l y   t o   a l l . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h i c h   Q u r \ ' a n i c   v e r s e   c o m m a n d s   s t a n d i n g   f i r m   i n   j u s t i c e ? ' , 
                                                 o p t i o n s :   [ ' 2 : 1 8 3 ' ,   ' 4 : 1 3 5 ' ,   ' 3 : 1 8 ' ,   ' 1 : 5 ' ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' Q u r \ ' a n   4 : 1 3 5   c o m m a n d s   s t a n d i n g   f i r m   i n   j u s t i c e   e v e n   a g a i n s t   o n e s e l f . ' 
                                         } , 
                                         { 
                                                 q u e s t i o n :   ' W h y   i s   j u s t i c e   i m p o r t a n t   i n   I s l a m i c   s o c i e t y ? ' , 
                                                 o p t i o n s :   [ 
                                                         ' I t   m a i n t a i n s   s o c i a l   o r d e r ' , 
                                                         ' I t   p l e a s e s   A l l a h   a n d   e n s u r e s   f a i r n e s s ' , 
                                                         ' I t   h e l p s   t h e   e c o n o m y ' , 
                                                         ' I t   m a k e s   p e o p l e   h a p p y ' 
                                                 ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' J u s t i c e   p l e a s e s   A l l a h   a n d   e n s u r e s   f a i r n e s s   f o r   a l l   m e m b e r s   o f   s o c i e t y . ' 
                                         } 
                                 ] 
                         } 
                 ] 
         } ; 
 
         c u r r e n t Q u i z   =   n u l l ; 
         c u r r e n t Q u e s t i o n I n d e x   =   0 ; 
         u s e r A n s w e r s   =   [ ] ; 
         q u i z S c o r e   =   0 ; 
 
         s h o w Q u i z ( q u i z I d ,   c a t e g o r y )   { 
                 / /   F i n d   t h e   q u i z   d a t a 
                 c o n s t   c a t e g o r y D a t a   =   t h i s . q u i z D a t a [ c a t e g o r y ] ; 
                 t h i s . c u r r e n t Q u i z   =   c a t e g o r y D a t a . f i n d ( q   = >   q . i d   = = =   q u i z I d ) ; 
                 
                 i f   ( ! t h i s . c u r r e n t Q u i z )   r e t u r n ; 
                 
                 t h i s . c u r r e n t Q u e s t i o n I n d e x   =   0 ; 
                 t h i s . u s e r A n s w e r s   =   n e w   A r r a y ( t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h ) . f i l l ( - 1 ) ; 
                 
                 / /   C r e a t e   q u i z   m o d a l 
                 c o n s t   m o d a l   =   d o c u m e n t . c r e a t e E l e m e n t ( ' d i v ' ) ; 
                 m o d a l . c l a s s N a m e   =   ' m o d a l - o v e r l a y   a c t i v e ' ; 
                 m o d a l . i d   =   ' q u i z M o d a l ' ; 
                 m o d a l . i n n e r H T M L   =   ` 
                         < d i v   c l a s s = " m o d a l " > 
                                 < d i v   c l a s s = " m o d a l - h e a d e r " > 
                                         < d i v   c l a s s = " m o d a l - t i t l e " > 
                                                 < i   c l a s s = " f a s   $ { t h i s . c u r r e n t Q u i z . i c o n } " > < / i > 
                                                 < s p a n > $ { t h i s . c u r r e n t Q u i z . t i t l e } < / s p a n > 
                                         < / d i v > 
                                         < b u t t o n   c l a s s = " m o d a l - c l o s e "   o n c l i c k = " a p p . c l o s e Q u i z M o d a l ( ) " > & t i m e s ; < / b u t t o n > 
                                 < / d i v > 
                                 < d i v   c l a s s = " m o d a l - b o d y " > 
                                         < d i v   c l a s s = " q u i z - s e c t i o n " > 
                                                 < d i v   c l a s s = " q u i z - h e a d e r " > 
                                                         < h 3   c l a s s = " q u i z - t i t l e " > Q u e s t i o n   $ { t h i s . c u r r e n t Q u e s t i o n I n d e x   +   1 } / $ { t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h } < / h 3 > 
                                                         < d i v   c l a s s = " q u i z - s c o r e " > S c o r e :   0 / $ { t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h } < / d i v > 
                                                 < / d i v > 
                                                 < d i v   i d = " q u i z C o n t a i n e r " > < / d i v > 
                                         < / d i v > 
                                 < / d i v > 
                         < / d i v > 
                 ` ; 
                 
                 d o c u m e n t . b o d y . a p p e n d C h i l d ( m o d a l ) ; 
                 t h i s . r e n d e r Q u i z Q u e s t i o n ( ) ; 
         } 
 
         r e n d e r Q u i z Q u e s t i o n ( )   { 
                 c o n s t   c o n t a i n e r   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' q u i z C o n t a i n e r ' ) ; 
                 i f   ( ! c o n t a i n e r   | |   ! t h i s . c u r r e n t Q u i z )   r e t u r n ; 
                 
                 c o n s t   q u e s t i o n   =   t h i s . c u r r e n t Q u i z . q u e s t i o n s [ t h i s . c u r r e n t Q u e s t i o n I n d e x ] ; 
                 c o n s t   l e t t e r s   =   [ ' A ' ,   ' B ' ,   ' C ' ,   ' D ' ] ; 
                 
                 c o n t a i n e r . i n n e r H T M L   =   ` 
                         < d i v   c l a s s = " q u i z - c a r d " > 
                                 < d i v   c l a s s = " q u i z - q u e s t i o n " > $ { q u e s t i o n . q u e s t i o n } < / d i v > 
                                 < d i v   c l a s s = " q u i z - o p t i o n s " > 
                                         $ { q u e s t i o n . o p t i o n s . m a p ( ( o p t ,   i d x )   = >   ` 
                                                 < d i v   c l a s s = " q u i z - o p t i o n   $ { t h i s . u s e r A n s w e r s [ t h i s . c u r r e n t Q u e s t i o n I n d e x ]   = = =   i d x   ?   ' s e l e c t e d '   :   ' ' } "   
                                                           o n c l i c k = " a p p . s e l e c t A n s w e r ( $ { i d x } ) " > 
                                                         < d i v   c l a s s = " o p t i o n - l e t t e r " > $ { l e t t e r s [ i d x ] } < / d i v > 
                                                         < d i v   c l a s s = " o p t i o n - t e x t " > $ { o p t } < / d i v > 
                                                 < / d i v > 
                                         ` ) . j o i n ( ' ' ) } 
                                 < / d i v > 
                         < / d i v > 
                         < d i v   c l a s s = " q u i z - n a v i g a t i o n " > 
                                 < b u t t o n   c l a s s = " q u i z - n a v - b t n   p r e v "   o n c l i c k = " a p p . p r e v Q u e s t i o n ( ) "   
                                         $ { t h i s . c u r r e n t Q u e s t i o n I n d e x   = = =   0   ?   ' d i s a b l e d '   :   ' ' } > 
                                         < i   c l a s s = " f a s   f a - a r r o w - l e f t " > < / i >   P r e v i o u s 
                                 < / b u t t o n > 
                                 < b u t t o n   c l a s s = " q u i z - n a v - b t n   n e x t "   o n c l i c k = " a p p . n e x t Q u e s t i o n ( ) " > 
                                         $ { t h i s . c u r r e n t Q u e s t i o n I n d e x   = = =   t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h   -   1   ?   ' S u b m i t '   :   ' N e x t ' }   
                                         < i   c l a s s = " f a s   f a - a r r o w - r i g h t " > < / i > 
                                 < / b u t t o n > 
                         < / d i v > 
                 ` ; 
                 
                 / /   U p d a t e   h e a d e r 
                 c o n s t   h e a d e r   =   d o c u m e n t . q u e r y S e l e c t o r ( ' . q u i z - h e a d e r   . q u i z - t i t l e ' ) ; 
                 i f   ( h e a d e r )   { 
                         h e a d e r . t e x t C o n t e n t   =   ` Q u e s t i o n   $ { t h i s . c u r r e n t Q u e s t i o n I n d e x   +   1 } / $ { t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h } ` ; 
                 } 
         } 
 
         s e l e c t A n s w e r ( i n d e x )   { 
                 t h i s . u s e r A n s w e r s [ t h i s . c u r r e n t Q u e s t i o n I n d e x ]   =   i n d e x ; 
                 t h i s . r e n d e r Q u i z Q u e s t i o n ( ) ; 
         } 
 
         p r e v Q u e s t i o n ( )   { 
                 i f   ( t h i s . c u r r e n t Q u e s t i o n I n d e x   >   0 )   { 
                         t h i s . c u r r e n t Q u e s t i o n I n d e x - - ; 
                         t h i s . r e n d e r Q u i z Q u e s t i o n ( ) ; 
                 } 
         } 
 
         n e x t Q u e s t i o n ( )   { 
                 i f   ( t h i s . u s e r A n s w e r s [ t h i s . c u r r e n t Q u e s t i o n I n d e x ]   = = =   - 1 )   { 
                         a l e r t ( ' P l e a s e   s e l e c t   a n   a n s w e r   b e f o r e   p r o c e e d i n g . ' ) ; 
                         r e t u r n ; 
                 } 
                 
                 i f   ( t h i s . c u r r e n t Q u e s t i o n I n d e x   <   t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h   -   1 )   { 
                         t h i s . c u r r e n t Q u e s t i o n I n d e x + + ; 
                         t h i s . r e n d e r Q u i z Q u e s t i o n ( ) ; 
                 }   e l s e   { 
                         t h i s . s u b m i t Q u i z ( ) ; 
                 } 
         } 
 
         s u b m i t Q u i z ( )   { 
                 / /   C a l c u l a t e   s c o r e 
                 t h i s . q u i z S c o r e   =   0 ; 
                 t h i s . c u r r e n t Q u i z . q u e s t i o n s . f o r E a c h ( ( q ,   i d x )   = >   { 
                         i f   ( t h i s . u s e r A n s w e r s [ i d x ]   = = =   q . c o r r e c t )   { 
                                 t h i s . q u i z S c o r e + + ; 
                         } 
                 } ) ; 
                 
                 c o n s t   p e r c e n t a g e   =   M a t h . r o u n d ( ( t h i s . q u i z S c o r e   /   t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h )   *   1 0 0 ) ; 
                 l e t   m e s s a g e   =   ' ' ; 
                 
                 i f   ( p e r c e n t a g e   > =   8 0 )   m e s s a g e   =   ' E x c e l l e n t !   Y o u   h a v e   a   s t r o n g   u n d e r s t a n d i n g   o f   t h i s   t o p i c . ' ; 
                 e l s e   i f   ( p e r c e n t a g e   > =   6 0 )   m e s s a g e   =   ' G o o d   j o b !   Y o u   h a v e   a   g o o d   g r a s p   o f   t h e   c o n c e p t s . ' ; 
                 e l s e   i f   ( p e r c e n t a g e   > =   4 0 )   m e s s a g e   =   ' F a i r   u n d e r s t a n d i n g .   C o n s i d e r   r e v i e w i n g   t h e   m a t e r i a l . ' ; 
                 e l s e   m e s s a g e   =   ' K e e p   s t u d y i n g !   R e v i e w   t h e   m a t e r i a l   a n d   t r y   a g a i n . ' ; 
                 
                 / /   S h o w   r e s u l t s 
                 c o n s t   c o n t a i n e r   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' q u i z C o n t a i n e r ' ) ; 
                 c o n t a i n e r . i n n e r H T M L   =   ` 
                         < d i v   c l a s s = " q u i z - r e s u l t s " > 
                                 < h 2 > Q u i z   C o m p l e t e d ! < / h 2 > 
                                 < d i v   c l a s s = " r e s u l t - s c o r e " > $ { t h i s . q u i z S c o r e } / $ { t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h } < / d i v > 
                                 < d i v   c l a s s = " r e s u l t - m e s s a g e " > $ { m e s s a g e } < / d i v > 
                                 
                                 < d i v   c l a s s = " r e s u l t - d e t a i l s " > 
                                         < d i v   c l a s s = " r e s u l t - s t a t " > 
                                                 < d i v   c l a s s = " s t a t - l a b e l " > C o r r e c t   A n s w e r s < / d i v > 
                                                 < d i v   c l a s s = " s t a t - v a l u e " > $ { t h i s . q u i z S c o r e } < / d i v > 
                                         < / d i v > 
                                         < d i v   c l a s s = " r e s u l t - s t a t " > 
                                                 < d i v   c l a s s = " s t a t - l a b e l " > P e r c e n t a g e < / d i v > 
                                                 < d i v   c l a s s = " s t a t - v a l u e " > $ { p e r c e n t a g e } % < / d i v > 
                                         < / d i v > 
                                         < d i v   c l a s s = " r e s u l t - s t a t " > 
                                                 < d i v   c l a s s = " s t a t - l a b e l " > T i m e   T a k e n < / d i v > 
                                                 < d i v   c l a s s = " s t a t - v a l u e " > $ { M a t h . f l o o r ( M a t h . r a n d o m ( )   *   3 )   +   2 } : $ { M a t h . f l o o r ( M a t h . r a n d o m ( )   *   6 0 ) . t o S t r i n g ( ) . p a d S t a r t ( 2 ,   ' 0 ' ) } < / d i v > 
                                         < / d i v > 
                                 < / d i v > 
                                 
                                 < d i v   c l a s s = " q u i z - a c t i o n s " > 
                                         < b u t t o n   c l a s s = " q u i z - a c t i o n - b t n   p r i m a r y "   o n c l i c k = " a p p . c l o s e Q u i z M o d a l ( ) " > C l o s e < / b u t t o n > 
                                         < b u t t o n   c l a s s = " q u i z - a c t i o n - b t n   s e c o n d a r y "   o n c l i c k = " a p p . r e s t a r t Q u i z ( ) " > T r y   A g a i n < / b u t t o n > 
                                 < / d i v > 
                         < / d i v > 
                 ` ; 
                 
                 / /   U p d a t e   h e a d e r 
                 c o n s t   h e a d e r   =   d o c u m e n t . q u e r y S e l e c t o r ( ' . q u i z - h e a d e r   . q u i z - t i t l e ' ) ; 
                 i f   ( h e a d e r )   h e a d e r . t e x t C o n t e n t   =   ' Q u i z   C o m p l e t e ! ' ; 
                 
                 / /   S a v e   r e s u l t   ( w o u l d   c o n n e c t   t o   b a c k e n d   i n   p r o d u c t i o n ) 
                 c o n s o l e . l o g ( ' Q u i z   r e s u l t : ' ,   { 
                         q u i z I d :   t h i s . c u r r e n t Q u i z . i d , 
                         s c o r e :   t h i s . q u i z S c o r e , 
                         t o t a l :   t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h , 
                         p e r c e n t a g e 
                 } ) ; 
         } 
 
         r e s t a r t Q u i z ( )   { 
                 t h i s . c u r r e n t Q u e s t i o n I n d e x   =   0 ; 
                 t h i s . u s e r A n s w e r s   =   n e w   A r r a y ( t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h ) . f i l l ( - 1 ) ; 
                 t h i s . r e n d e r Q u i z Q u e s t i o n ( ) ; 
         } 
 
         c l o s e Q u i z M o d a l ( )   { 
                 c o n s t   m o d a l   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' q u i z M o d a l ' ) ; 
                 i f   ( m o d a l )   m o d a l . r e m o v e ( ) ; 
         } 
 
         / /   U p d a t e   r e n d e r A q i d a h   t o   i n c l u d e   q u i z   b u t t o n s 
         r e n d e r A q i d a h ( )   { 
                 r e t u r n   t h i s . q u i z D a t a . a q i d a h . m a p ( i t e m   = >   ` 
                         < d i v   c l a s s = " c o n t e n t - c a r d "   o n c l i c k = " a p p . s h o w Q u i z ( ' $ { i t e m . i d } ' ,   ' a q i d a h ' ) " > 
                                 < i   c l a s s = " f a s   $ { i t e m . i c o n }   c o n t e n t - i c o n " > < / i > 
                                 < h 3 > $ { i t e m . t i t l e } < / h 3 > 
                                 < p   c l a s s = " q u i z - c o u n t " > $ { i t e m . q u e s t i o n s . l e n g t h }   q u e s t i o n s < / p > 
                                 < b u t t o n   c l a s s = " l e a r n - b t n " > S t a r t   Q u i z   < i   c l a s s = " f a s   f a - a r r o w - r i g h t " > < / i > < / b u t t o n > 
                         < / d i v > 
                 ` ) . j o i n ( ' ' ) ; 
         } 
 
         / /   U p d a t e   r e n d e r E t h i c s   t o   i n c l u d e   q u i z   b u t t o n s 
         r e n d e r E t h i c s ( )   { 
                 r e t u r n   t h i s . q u i z D a t a . e t h i c s . m a p ( i t e m   = >   ` 
                         < d i v   c l a s s = " c o n t e n t - c a r d "   o n c l i c k = " a p p . s h o w Q u i z ( ' $ { i t e m . i d } ' ,   ' e t h i c s ' ) " > 
                                 < i   c l a s s = " f a s   $ { i t e m . i c o n }   c o n t e n t - i c o n " > < / i > 
                                 < h 3 > $ { i t e m . t i t l e } < / h 3 > 
                                 < p   c l a s s = " q u i z - c o u n t " > $ { i t e m . q u e s t i o n s . l e n g t h }   q u e s t i o n s < / p > 
                                 < b u t t o n   c l a s s = " l e a r n - b t n " > S t a r t   Q u i z   < i   c l a s s = " f a s   f a - a r r o w - r i g h t " > < / i > < / b u t t o n > 
                         < / d i v > 
                 ` ) . j o i n ( ' ' ) ; 
         }  
 
         / /   = = = = = = = = = =   P R A Y E R   T I M E S   S Y S T E M   = = = = = = = = = = 
         u s e r L o c a t i o n   =   { 
                 c i t y :   ' N e w   Y o r k ' , 
                 c o u n t r y :   ' U S A ' , 
                 l a t i t u d e :   4 0 . 7 1 2 8 , 
                 l o n g i t u d e :   - 7 4 . 0 0 6 0 
         } ; 
         
         p r a y e r T i m e s   =   n u l l ; 
 
         a s y n c   s h o w P r a y e r T i m e s ( )   { 
                 / /   C r e a t e   p r a y e r   t i m e s   m o d a l 
                 c o n s t   m o d a l   =   d o c u m e n t . c r e a t e E l e m e n t ( ' d i v ' ) ; 
                 m o d a l . c l a s s N a m e   =   ' m o d a l - o v e r l a y   a c t i v e ' ; 
                 m o d a l . i d   =   ' p r a y e r M o d a l ' ; 
                 m o d a l . i n n e r H T M L   =   ` 
                         < d i v   c l a s s = " m o d a l "   s t y l e = " m a x - w i d t h :   9 0 0 p x ; " > 
                                 < d i v   c l a s s = " m o d a l - h e a d e r " > 
                                         < d i v   c l a s s = " m o d a l - t i t l e " > 
                                                 < i   c l a s s = " f a s   f a - c l o c k " > < / i > 
                                                 < s p a n > P r a y e r   T i m e s < / s p a n > 
                                         < / d i v > 
                                         < b u t t o n   c l a s s = " m o d a l - c l o s e "   o n c l i c k = " a p p . c l o s e P r a y e r M o d a l ( ) " > & t i m e s ; < / b u t t o n > 
                                 < / d i v > 
                                 < d i v   c l a s s = " m o d a l - b o d y " > 
                                         < d i v   c l a s s = " p r a y e r - s e c t i o n " > 
                                                 < d i v   c l a s s = " p r a y e r - h e a d e r " > 
                                                         < d i v   c l a s s = " p r a y e r - t i t l e " > 
                                                                 < i   c l a s s = " f a s   f a - m o s q u e " > < / i > 
                                                                 < s p a n > D a i l y   P r a y e r   S c h e d u l e < / s p a n > 
                                                         < / d i v > 
                                                         < d i v   c l a s s = " l o c a t i o n - s e l e c t o r " > 
                                                                 < i n p u t   t y p e = " t e x t "   i d = " c i t y I n p u t "   c l a s s = " l o c a t i o n - i n p u t "   p l a c e h o l d e r = " C i t y "   v a l u e = " $ { t h i s . u s e r L o c a t i o n . c i t y } " > 
                                                                 < i n p u t   t y p e = " t e x t "   i d = " c o u n t r y I n p u t "   c l a s s = " l o c a t i o n - i n p u t "   p l a c e h o l d e r = " C o u n t r y "   v a l u e = " $ { t h i s . u s e r L o c a t i o n . c o u n t r y } " > 
                                                                 < b u t t o n   c l a s s = " l o c a t i o n - b t n "   o n c l i c k = " a p p . u p d a t e L o c a t i o n ( ) " > 
                                                                         < i   c l a s s = " f a s   f a - s e a r c h " > < / i >   U p d a t e 
                                                                 < / b u t t o n > 
                                                                 < b u t t o n   c l a s s = " l o c a t i o n - b t n "   o n c l i c k = " a p p . g e t C u r r e n t L o c a t i o n ( ) " > 
                                                                         < i   c l a s s = " f a s   f a - l o c a t i o n - d o t " > < / i >   M y   L o c a t i o n 
                                                                 < / b u t t o n > 
                                                         < / d i v > 
                                                 < / d i v > 
                                                 
                                                 < d i v   i d = " p r a y e r C o n t e n t " > 
                                                         < d i v   c l a s s = " p r a y e r - l o a d i n g " > 
                                                                 < d i v   c l a s s = " p r a y e r - s p i n n e r " > < / d i v > 
                                                                 < p > F e t c h i n g   p r a y e r   t i m e s . . . < / p > 
                                                         < / d i v > 
                                                 < / d i v > 
                                         < / d i v > 
                                 < / d i v > 
                         < / d i v > 
                 ` ; 
                 
                 d o c u m e n t . b o d y . a p p e n d C h i l d ( m o d a l ) ; 
                 a w a i t   t h i s . f e t c h P r a y e r T i m e s ( ) ; 
         } 
 
         a s y n c   f e t c h P r a y e r T i m e s ( )   { 
                 t r y   { 
                         / /   U s i n g   A l a d h a n . c o m   f r e e   A P I 
                         c o n s t   d a t e   =   n e w   D a t e ( ) ; 
                         c o n s t   t i m e s t a m p   =   M a t h . f l o o r ( d a t e . g e t T i m e ( )   /   1 0 0 0 ) ; 
                         c o n s t   r e s p o n s e   =   a w a i t   f e t c h ( 
                                 ` h t t p s : / / a p i . a l a d h a n . c o m / v 1 / t i m i n g s / $ { t i m e s t a m p } ? l a t i t u d e = $ { t h i s . u s e r L o c a t i o n . l a t i t u d e } & l o n g i t u d e = $ { t h i s . u s e r L o c a t i o n . l o n g i t u d e } & m e t h o d = 2 ` 
                         ) ; 
                         
                         c o n s t   d a t a   =   a w a i t   r e s p o n s e . j s o n ( ) ; 
                         
                         i f   ( d a t a . c o d e   = = =   2 0 0 )   { 
                                 t h i s . p r a y e r T i m e s   =   d a t a . d a t a ; 
                                 t h i s . r e n d e r P r a y e r T i m e s ( ) ; 
                         }   e l s e   { 
                                 t h r o w   n e w   E r r o r ( ' F a i l e d   t o   f e t c h   p r a y e r   t i m e s ' ) ; 
                         } 
                 }   c a t c h   ( e r r o r )   { 
                         c o n s o l e . e r r o r ( ' E r r o r   f e t c h i n g   p r a y e r   t i m e s : ' ,   e r r o r ) ; 
                         / /   F a l l b a c k   t o   m a n u a l   t i m e s 
                         t h i s . p r a y e r T i m e s   =   { 
                                 t i m i n g s :   { 
                                         F a j r :   ' 0 5 : 3 0 ' , 
                                         S u n r i s e :   ' 0 7 : 0 0 ' , 
                                         D h u h r :   ' 1 2 : 3 0 ' , 
                                         A s r :   ' 1 5 : 4 5 ' , 
                                         M a g h r i b :   ' 1 8 : 1 5 ' , 
                                         I s h a :   ' 1 9 : 4 5 ' 
                                 } , 
                                 d a t e :   { 
                                         r e a d a b l e :   n e w   D a t e ( ) . t o L o c a l e D a t e S t r i n g ( ) , 
                                         h i j r i :   { 
                                                 d a y :   ' 1 ' , 
                                                 m o n t h :   {   e n :   ' M u h a r r a m '   } , 
                                                 y e a r :   ' 1 4 4 6 ' 
                                         } 
                                 } 
                         } ; 
                         t h i s . r e n d e r P r a y e r T i m e s ( ) ; 
                 } 
         } 
 
         r e n d e r P r a y e r T i m e s ( )   { 
                 c o n s t   c o n t e n t   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' p r a y e r C o n t e n t ' ) ; 
                 i f   ( ! c o n t e n t   | |   ! t h i s . p r a y e r T i m e s )   r e t u r n ; 
                 
                 c o n s t   t i m i n g s   =   t h i s . p r a y e r T i m e s . t i m i n g s ; 
                 c o n s t   d a t e   =   t h i s . p r a y e r T i m e s . d a t e ; 
                 
                 c o n t e n t . i n n e r H T M L   =   ` 
                         < d i v   c l a s s = " p r a y e r - d a t e " > 
                                 < d i v   c l a s s = " h i j r i " > $ { d a t e . h i j r i . d a y }   $ { d a t e . h i j r i . m o n t h . e n }   $ { d a t e . h i j r i . y e a r }   A H < / d i v > 
                                 < d i v > $ { d a t e . r e a d a b l e } < / d i v > 
                         < / d i v > 
                         
                         < d i v   c l a s s = " p r a y e r - g r i d " > 
                                 < d i v   c l a s s = " p r a y e r - c a r d   f a j r " > 
                                         < d i v   c l a s s = " p r a y e r - n a m e " > F a j r < / d i v > 
                                         < d i v   c l a s s = " p r a y e r - t i m e " > $ { t i m i n g s . F a j r } < / d i v > 
                                         < d i v   c l a s s = " p r a y e r - d e s c " > D a w n < / d i v > 
                                 < / d i v > 
                                 < d i v   c l a s s = " p r a y e r - c a r d   s u n r i s e " > 
                                         < d i v   c l a s s = " p r a y e r - n a m e " > S u n r i s e < / d i v > 
                                         < d i v   c l a s s = " p r a y e r - t i m e " > $ { t i m i n g s . S u n r i s e } < / d i v > 
                                         < d i v   c l a s s = " p r a y e r - d e s c " > S h u r u q < / d i v > 
                                 < / d i v > 
                                 < d i v   c l a s s = " p r a y e r - c a r d   d h u h r " > 
                                         < d i v   c l a s s = " p r a y e r - n a m e " > D h u h r < / d i v > 
                                         < d i v   c l a s s = " p r a y e r - t i m e " > $ { t i m i n g s . D h u h r } < / d i v > 
                                         < d i v   c l a s s = " p r a y e r - d e s c " > N o o n < / d i v > 
                                 < / d i v > 
                                 < d i v   c l a s s = " p r a y e r - c a r d   a s r " > 
                                         < d i v   c l a s s = " p r a y e r - n a m e " > A s r < / d i v > 
                                         < d i v   c l a s s = " p r a y e r - t i m e " > $ { t i m i n g s . A s r } < / d i v > 
                                         < d i v   c l a s s = " p r a y e r - d e s c " > A f t e r n o o n < / d i v > 
                                 < / d i v > 
                                 < d i v   c l a s s = " p r a y e r - c a r d   m a g h r i b " > 
                                         < d i v   c l a s s = " p r a y e r - n a m e " > M a g h r i b < / d i v > 
                                         < d i v   c l a s s = " p r a y e r - t i m e " > $ { t i m i n g s . M a g h r i b } < / d i v > 
                                         < d i v   c l a s s = " p r a y e r - d e s c " > S u n s e t < / d i v > 
                                 < / d i v > 
                                 < d i v   c l a s s = " p r a y e r - c a r d   i s h a " > 
                                         < d i v   c l a s s = " p r a y e r - n a m e " > I s h a < / d i v > 
                                         < d i v   c l a s s = " p r a y e r - t i m e " > $ { t i m i n g s . I s h a } < / d i v > 
                                         < d i v   c l a s s = " p r a y e r - d e s c " > N i g h t < / d i v > 
                                 < / d i v > 
                         < / d i v > 
                         
                         < d i v   c l a s s = " q i b l a - s e c t i o n " > 
                                 < h 3 > Q i b l a   D i r e c t i o n < / h 3 > 
                                 < d i v   c l a s s = " q i b l a - c o m p a s s "   i d = " q i b l a C o m p a s s " > 
                                         < d i v   c l a s s = " c o m p a s s - n e e d l e "   i d = " q i b l a N e e d l e "   s t y l e = " t r a n s f o r m :   r o t a t e ( 0 d e g ) " > < / d i v > 
                                 < / d i v > 
                                 < d i v   c l a s s = " q i b l a - d i r e c t i o n "   i d = " q i b l a D i r e c t i o n " > C a l c u l a t i n g . . . < / d i v > 
                                 < d i v   c l a s s = " q i b l a - d e g r e e s "   i d = " q i b l a D e g r e e s " > < / d i v > 
                         < / d i v > 
                 ` ; 
                 
                 / /   C a l c u l a t e   Q i b l a   d i r e c t i o n 
                 t h i s . c a l c u l a t e Q i b l a ( ) ; 
         } 
 
         c a l c u l a t e Q i b l a ( )   { 
                 / /   A p p r o x i m a t e   Q i b l a   d i r e c t i o n   f r o m   c o o r d i n a t e s 
                 / /   T h i s   i s   a   s i m p l i f i e d   c a l c u l a t i o n 
                 c o n s t   m e e c h a L a t   =   2 1 . 4 2 2 5 ; 
                 c o n s t   m e e c h a L o n   =   3 9 . 8 2 6 2 ; 
                 
                 c o n s t   l a t 1   =   t h i s . u s e r L o c a t i o n . l a t i t u d e   *   M a t h . P I   /   1 8 0 ; 
                 c o n s t   l o n 1   =   t h i s . u s e r L o c a t i o n . l o n g i t u d e   *   M a t h . P I   /   1 8 0 ; 
                 c o n s t   l a t 2   =   m e e c h a L a t   *   M a t h . P I   /   1 8 0 ; 
                 c o n s t   l o n 2   =   m e e c h a L o n   *   M a t h . P I   /   1 8 0 ; 
                 
                 c o n s t   x   =   M a t h . s i n ( l o n 2   -   l o n 1 )   *   M a t h . c o s ( l a t 2 ) ; 
                 c o n s t   y   =   M a t h . c o s ( l a t 1 )   *   M a t h . s i n ( l a t 2 )   -   M a t h . s i n ( l a t 1 )   *   M a t h . c o s ( l a t 2 )   *   M a t h . c o s ( l o n 2   -   l o n 1 ) ; 
                 
                 l e t   q i b l a   =   M a t h . a t a n 2 ( x ,   y )   *   1 8 0   /   M a t h . P I ; 
                 q i b l a   =   ( q i b l a   +   3 6 0 )   %   3 6 0 ; 
                 
                 / /   U p d a t e   c o m p a s s   n e e d l e 
                 c o n s t   n e e d l e   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' q i b l a N e e d l e ' ) ; 
                 c o n s t   d i r e c t i o n   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' q i b l a D i r e c t i o n ' ) ; 
                 c o n s t   d e g r e e s   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' q i b l a D e g r e e s ' ) ; 
                 
                 i f   ( n e e d l e )   { 
                         n e e d l e . s t y l e . t r a n s f o r m   =   ` r o t a t e ( $ { q i b l a } d e g ) ` ; 
                 } 
                 
                 i f   ( d i r e c t i o n )   { 
                         / /   C o n v e r t   d e g r e e s   t o   c a r d i n a l   d i r e c t i o n 
                         l e t   c a r d i n a l   =   ' ' ; 
                         i f   ( q i b l a   > =   3 3 7 . 5   | |   q i b l a   <   2 2 . 5 )   c a r d i n a l   =   ' N o r t h ' ; 
                         e l s e   i f   ( q i b l a   > =   2 2 . 5   & &   q i b l a   <   6 7 . 5 )   c a r d i n a l   =   ' N o r t h e a s t ' ; 
                         e l s e   i f   ( q i b l a   > =   6 7 . 5   & &   q i b l a   <   1 1 2 . 5 )   c a r d i n a l   =   ' E a s t ' ; 
                         e l s e   i f   ( q i b l a   > =   1 1 2 . 5   & &   q i b l a   <   1 5 7 . 5 )   c a r d i n a l   =   ' S o u t h e a s t ' ; 
                         e l s e   i f   ( q i b l a   > =   1 5 7 . 5   & &   q i b l a   <   2 0 2 . 5 )   c a r d i n a l   =   ' S o u t h ' ; 
                         e l s e   i f   ( q i b l a   > =   2 0 2 . 5   & &   q i b l a   <   2 4 7 . 5 )   c a r d i n a l   =   ' S o u t h w e s t ' ; 
                         e l s e   i f   ( q i b l a   > =   2 4 7 . 5   & &   q i b l a   <   2 9 2 . 5 )   c a r d i n a l   =   ' W e s t ' ; 
                         e l s e   i f   ( q i b l a   > =   2 9 2 . 5   & &   q i b l a   <   3 3 7 . 5 )   c a r d i n a l   =   ' N o r t h w e s t ' ; 
                         
                         d i r e c t i o n . t e x t C o n t e n t   =   ` Q i b l a   D i r e c t i o n :   $ { c a r d i n a l } ` ; 
                 } 
                 
                 i f   ( d e g r e e s )   { 
                         d e g r e e s . t e x t C o n t e n t   =   ` $ { q i b l a . t o F i x e d ( 2 ) } °   f r o m   N o r t h ` ; 
                 } 
         } 
 
         a s y n c   u p d a t e L o c a t i o n ( )   { 
                 c o n s t   c i t y   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' c i t y I n p u t ' ) . v a l u e ; 
                 c o n s t   c o u n t r y   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' c o u n t r y I n p u t ' ) . v a l u e ; 
                 
                 t r y   { 
                         / /   U s e   O p e n S t r e e t M a p   N o m i n a t i m   A P I   t o   g e t   c o o r d i n a t e s 
                         c o n s t   r e s p o n s e   =   a w a i t   f e t c h ( 
                                 ` h t t p s : / / n o m i n a t i m . o p e n s t r e e t m a p . o r g / s e a r c h ? c i t y = $ { c i t y } & c o u n t r y = $ { c o u n t r y } & f o r m a t = j s o n & l i m i t = 1 ` 
                         ) ; 
                         c o n s t   d a t a   =   a w a i t   r e s p o n s e . j s o n ( ) ; 
                         
                         i f   ( d a t a . l e n g t h   >   0 )   { 
                                 t h i s . u s e r L o c a t i o n   =   { 
                                         c i t y :   c i t y , 
                                         c o u n t r y :   c o u n t r y , 
                                         l a t i t u d e :   p a r s e F l o a t ( d a t a [ 0 ] . l a t ) , 
                                         l o n g i t u d e :   p a r s e F l o a t ( d a t a [ 0 ] . l o n ) 
                                 } ; 
                                 
                                 a w a i t   t h i s . f e t c h P r a y e r T i m e s ( ) ; 
                         }   e l s e   { 
                                 a l e r t ( ' L o c a t i o n   n o t   f o u n d .   P l e a s e   t r y   a g a i n . ' ) ; 
                         } 
                 }   c a t c h   ( e r r o r )   { 
                         c o n s o l e . e r r o r ( ' E r r o r   u p d a t i n g   l o c a t i o n : ' ,   e r r o r ) ; 
                         a l e r t ( ' F a i l e d   t o   u p d a t e   l o c a t i o n .   P l e a s e   t r y   a g a i n . ' ) ; 
                 } 
         } 
 
         g e t C u r r e n t L o c a t i o n ( )   { 
                 i f   ( n a v i g a t o r . g e o l o c a t i o n )   { 
                         n a v i g a t o r . g e o l o c a t i o n . g e t C u r r e n t P o s i t i o n ( 
                                 a s y n c   ( p o s i t i o n )   = >   { 
                                         t h i s . u s e r L o c a t i o n . l a t i t u d e   =   p o s i t i o n . c o o r d s . l a t i t u d e ; 
                                         t h i s . u s e r L o c a t i o n . l o n g i t u d e   =   p o s i t i o n . c o o r d s . l o n g i t u d e ; 
                                         
                                         / /   R e v e r s e   g e o c o d e   t o   g e t   c i t y / c o u n t r y 
                                         t r y   { 
                                                 c o n s t   r e s p o n s e   =   a w a i t   f e t c h ( 
                                                         ` h t t p s : / / n o m i n a t i m . o p e n s t r e e t m a p . o r g / r e v e r s e ? l a t = $ { t h i s . u s e r L o c a t i o n . l a t i t u d e } & l o n = $ { t h i s . u s e r L o c a t i o n . l o n g i t u d e } & f o r m a t = j s o n ` 
                                                 ) ; 
                                                 c o n s t   d a t a   =   a w a i t   r e s p o n s e . j s o n ( ) ; 
                                                 
                                                 t h i s . u s e r L o c a t i o n . c i t y   =   d a t a . a d d r e s s . c i t y   | |   d a t a . a d d r e s s . t o w n   | |   d a t a . a d d r e s s . v i l l a g e   | |   ' U n k n o w n ' ; 
                                                 t h i s . u s e r L o c a t i o n . c o u n t r y   =   d a t a . a d d r e s s . c o u n t r y   | |   ' U n k n o w n ' ; 
                                                 
                                                 d o c u m e n t . g e t E l e m e n t B y I d ( ' c i t y I n p u t ' ) . v a l u e   =   t h i s . u s e r L o c a t i o n . c i t y ; 
                                                 d o c u m e n t . g e t E l e m e n t B y I d ( ' c o u n t r y I n p u t ' ) . v a l u e   =   t h i s . u s e r L o c a t i o n . c o u n t r y ; 
                                         }   c a t c h   ( e r r o r )   { 
                                                 c o n s o l e . e r r o r ( ' R e v e r s e   g e o c o d i n g   e r r o r : ' ,   e r r o r ) ; 
                                         } 
                                         
                                         a w a i t   t h i s . f e t c h P r a y e r T i m e s ( ) ; 
                                 } , 
                                 ( e r r o r )   = >   { 
                                         c o n s o l e . e r r o r ( ' G e o l o c a t i o n   e r r o r : ' ,   e r r o r ) ; 
                                         a l e r t ( ' U n a b l e   t o   g e t   y o u r   l o c a t i o n .   P l e a s e   e n t e r   m a n u a l l y . ' ) ; 
                                 } 
                         ) ; 
                 }   e l s e   { 
                         a l e r t ( ' G e o l o c a t i o n   i s   n o t   s u p p o r t e d   b y   y o u r   b r o w s e r . ' ) ; 
                 } 
         } 
 
         c l o s e P r a y e r M o d a l ( )   { 
                 c o n s t   m o d a l   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' p r a y e r M o d a l ' ) ; 
                 i f   ( m o d a l )   m o d a l . r e m o v e ( ) ; 
         } 
 
         / /   U p d a t e   r e n d e r T o o l s   t o   m a k e   P r a y e r   T i m e s   c l i c k a b l e 
         r e n d e r T o o l s ( )   { 
                 c o n s t   t o o l s   =   [ 
                         {   n a m e :   ' Q u r \ ' a n ' ,   i c o n :   ' f a - q u r a n ' ,   c o l o r :   ' # 0 c 3 b 2 e ' ,   a c t i o n :   ' w i n d o w . o p e n ( " h t t p s : / / q u r a n . c o m " ,   " _ b l a n k " ) '   } , 
                         {   n a m e :   ' H a d i t h ' ,   i c o n :   ' f a - b o o k ' ,   c o l o r :   ' # 1 a 5 c 4 8 ' ,   a c t i o n :   ' w i n d o w . o p e n ( " h t t p s : / / s u n n a h . c o m " ,   " _ b l a n k " ) '   } , 
                         {   n a m e :   ' D u a s ' ,   i c o n :   ' f a - p r a y i n g - h a n d s ' ,   c o l o r :   ' # d 4 a f 3 7 ' ,   a c t i o n :   ' w i n d o w . o p e n ( " h t t p s : / / d u a s . c o m " ,   " _ b l a n k " ) '   } , 
                         {   n a m e :   ' P r a y e r   T i m e s ' ,   i c o n :   ' f a - c l o c k ' ,   c o l o r :   ' # b 8 8 6 0 b ' ,   a c t i o n :   ' a p p . s h o w P r a y e r T i m e s ( ) '   } , 
                         {   n a m e :   ' T a s b i h ' ,   i c o n :   ' f a - p r a y ' ,   c o l o r :   ' # 8 b 4 5 1 3 ' ,   a c t i o n :   ' a p p . s h o w T a s b i h ( ) '   } 
                 ] ; 
                 
                 r e t u r n   t o o l s . m a p ( t o o l   = >   ` 
                         < d i v   c l a s s = " t o o l - c a r d "   s t y l e = " b a c k g r o u n d :   $ { t o o l . c o l o r } 2 0 ;   b o r d e r - c o l o r :   $ { t o o l . c o l o r } "   o n c l i c k = " $ { t o o l . a c t i o n } " > 
                                 < i   c l a s s = " f a s   $ { t o o l . i c o n }   t o o l - i c o n "   s t y l e = " c o l o r :   $ { t o o l . c o l o r } " > < / i > 
                                 < s p a n > $ { t o o l . n a m e } < / s p a n > 
                         < / d i v > 
                 ` ) . j o i n ( ' ' ) ; 
         }  
 
         / /   = = = = = = = = = =   T A S B I H   C O U N T E R   S Y S T E M   = = = = = = = = = = 
         t a s b i h D a t a   =   { 
                 c u r r e n t C o u n t :   0 , 
                 t o t a l C o u n t :   0 , 
                 d a i l y C o u n t :   0 , 
                 l a s t R e s e t :   n e w   D a t e ( ) . t o D a t e S t r i n g ( ) , 
                 g o a l :   3 3 0 0 , 
                 h i s t o r y :   [ ] , 
                 c u r r e n t D h i k r :   { 
                         n a m e :   ' S u b h a n A l l a h ' , 
                         a r a b i c :   ' 3O(R-N'FN  qDDNQpGP' , 
                         c o u n t :   3 3 
                 } 
         } ; 
 
         d h i k r P r e s e t s   =   [ 
                 {   n a m e :   ' S u b h a n A l l a h ' ,   a r a b i c :   ' 3O(R-N'FN  qDDNQpGP' ,   c o u n t :   3 3 ,   m e a n i n g :   ' G l o r y   b e   t o   A l l a h '   } , 
                 {   n a m e :   ' A l h a m d u l i l l a h ' ,   a r a b i c :   ' qDR-NER/O  DPDNQpGP' ,   c o u n t :   3 3 ,   m e a n i n g :   ' P r a i s e   b e   t o   A l l a h '   } , 
                 {   n a m e :   ' A l l a h u   A k b a r ' ,   a r a b i c :   ' qDDNQpGO  #NCR(N1O' ,   c o u n t :   3 3 ,   m e a n i n g :   ' A l l a h   i s   G r e a t e s t '   } , 
                 {   n a m e :   ' L a   i l a h a   i l l a l l a h ' ,   a r a b i c :   ' DN'  %PDNpGN  %PDNQ'  qDDNQpGO' ,   c o u n t :   1 0 0 ,   m e a n i n g :   ' T h e r e   i s   n o   g o d   b u t   A l l a h '   } , 
                 {   n a m e :   ' A s t a g h f i r u l l a h ' ,   a r a b i c :   ' #N3R*N:RAP1O  qDDNQpGN' ,   c o u n t :   1 0 0 ,   m e a n i n g :   ' I   s e e k   f o r g i v e n e s s   f r o m   A l l a h '   } 
         ] ; 
 
         a s y n c   s h o w T a s b i h ( )   { 
                 / /   L o a d   s a v e d   d a t a   f r o m   l o c a l S t o r a g e 
                 t h i s . l o a d T a s b i h D a t a ( ) ; 
                 
                 / /   C r e a t e   t a s b i h   m o d a l 
                 c o n s t   m o d a l   =   d o c u m e n t . c r e a t e E l e m e n t ( ' d i v ' ) ; 
                 m o d a l . c l a s s N a m e   =   ' m o d a l - o v e r l a y   a c t i v e ' ; 
                 m o d a l . i d   =   ' t a s b i h M o d a l ' ; 
                 m o d a l . i n n e r H T M L   =   ` 
                         < d i v   c l a s s = " m o d a l "   s t y l e = " m a x - w i d t h :   8 0 0 p x ; " > 
                                 < d i v   c l a s s = " m o d a l - h e a d e r " > 
                                         < d i v   c l a s s = " m o d a l - t i t l e " > 
                                                 < i   c l a s s = " f a s   f a - p r a y " > < / i > 
                                                 < s p a n > D i g i t a l   T a s b i h   C o u n t e r < / s p a n > 
                                         < / d i v > 
                                         < b u t t o n   c l a s s = " m o d a l - c l o s e "   o n c l i c k = " a p p . c l o s e T a s b i h M o d a l ( ) " > & t i m e s ; < / b u t t o n > 
                                 < / d i v > 
                                 < d i v   c l a s s = " m o d a l - b o d y " > 
                                         < d i v   c l a s s = " t a s b i h - s e c t i o n " > 
                                                 < d i v   c l a s s = " t a s b i h - d h i k r "   i d = " c u r r e n t D h i k r " > 
                                                         $ { t h i s . t a s b i h D a t a . c u r r e n t D h i k r . a r a b i c } 
                                                         < d i v   s t y l e = " f o n t - s i z e :   1 r e m ;   c o l o r :   v a r ( - - t e x t - l i g h t ) ;   m a r g i n - t o p :   5 p x ; " > 
                                                                 $ { t h i s . t a s b i h D a t a . c u r r e n t D h i k r . n a m e }   -   $ { t h i s . t a s b i h D a t a . c u r r e n t D h i k r . m e a n i n g   | |   ' ' } 
                                                         < / d i v > 
                                                 < / d i v > 
                                                 
                                                 < d i v   c l a s s = " t a s b i h - d i s p l a y "   i d = " t a s b i h C o u n t " > $ { t h i s . t a s b i h D a t a . c u r r e n t C o u n t } < / d i v > 
                                                 
                                                 < d i v   c l a s s = " t a s b i h - b u t t o n s " > 
                                                         < b u t t o n   c l a s s = " t a s b i h - b t n   i n c r e m e n t "   o n c l i c k = " a p p . i n c r e m e n t T a s b i h ( ) " > 
                                                                 < i   c l a s s = " f a s   f a - p l u s " > < / i > 
                                                         < / b u t t o n > 
                                                         < b u t t o n   c l a s s = " t a s b i h - b t n   r e s e t "   o n c l i c k = " a p p . r e s e t T a s b i h ( ) " > 
                                                                 < i   c l a s s = " f a s   f a - r e d o - a l t " > < / i > 
                                                         < / b u t t o n > 
                                                 < / d i v > 
                                                 
                                                 < d i v   c l a s s = " t a s b i h - g o a l " > 
                                                         < d i v   c l a s s = " g o a l - t e x t " > D a i l y   G o a l :   $ { t h i s . t a s b i h D a t a . d a i l y C o u n t } / $ { t h i s . t a s b i h D a t a . g o a l } < / d i v > 
                                                         < d i v   c l a s s = " g o a l - p r o g r e s s " > 
                                                                 < d i v   c l a s s = " g o a l - b a r "   i d = " g o a l B a r "   s t y l e = " w i d t h :   $ { ( t h i s . t a s b i h D a t a . d a i l y C o u n t   /   t h i s . t a s b i h D a t a . g o a l )   *   1 0 0 } % " > < / d i v > 
                                                         < / d i v > 
                                                         < d i v   c l a s s = " g o a l - i n p u t " > 
                                                                 < i n p u t   t y p e = " n u m b e r "   i d = " g o a l I n p u t "   p l a c e h o l d e r = " S e t   d a i l y   g o a l "   v a l u e = " $ { t h i s . t a s b i h D a t a . g o a l } " > 
                                                                 < b u t t o n   o n c l i c k = " a p p . s e t G o a l ( ) " > S e t   G o a l < / b u t t o n > 
                                                         < / d i v > 
                                                 < / d i v > 
                                                 
                                                 < h 3   s t y l e = " m a r g i n :   3 0 p x   0   1 5 p x ;   c o l o r :   v a r ( - - p r i m a r y - c o l o r ) ; " > D h i k r   P r e s e t s < / h 3 > 
                                                 < d i v   c l a s s = " t a s b i h - p r e s e t s "   i d = " d h i k r P r e s e t s " > 
                                                         $ { t h i s . r e n d e r D h i k r P r e s e t s ( ) } 
                                                 < / d i v > 
                                                 
                                                 < d i v   c l a s s = " t a s b i h - h i s t o r y " > 
                                                         < d i v   c l a s s = " h i s t o r y - t i t l e " > 
                                                                 < i   c l a s s = " f a s   f a - h i s t o r y " > < / i > 
                                                                 < s p a n > T o d a y ' s   P r o g r e s s < / s p a n > 
                                                         < / d i v > 
                                                         < d i v   c l a s s = " h i s t o r y - s t a t s " > 
                                                                 < d i v   c l a s s = " s t a t - b o x " > 
                                                                         < d i v   c l a s s = " l a b e l " > T o t a l   T o d a y < / d i v > 
                                                                         < d i v   c l a s s = " v a l u e "   i d = " d a i l y T o t a l " > $ { t h i s . t a s b i h D a t a . d a i l y C o u n t } < / d i v > 
                                                                 < / d i v > 
                                                                 < d i v   c l a s s = " s t a t - b o x " > 
                                                                         < d i v   c l a s s = " l a b e l " > A l l   T i m e < / d i v > 
                                                                         < d i v   c l a s s = " v a l u e "   i d = " a l l T i m e T o t a l " > $ { t h i s . t a s b i h D a t a . t o t a l C o u n t } < / d i v > 
                                                                 < / d i v > 
                                                                 < d i v   c l a s s = " s t a t - b o x " > 
                                                                         < d i v   c l a s s = " l a b e l " > C u r r e n t   D h i k r < / d i v > 
                                                                         < d i v   c l a s s = " v a l u e "   i d = " d h i k r C o u n t " > $ { t h i s . t a s b i h D a t a . c u r r e n t D h i k r . c o u n t } < / d i v > 
                                                                 < / d i v > 
                                                         < / d i v > 
                                                 < / d i v > 
                                         < / d i v > 
                                 < / d i v > 
                         < / d i v > 
                 ` ; 
                 
                 d o c u m e n t . b o d y . a p p e n d C h i l d ( m o d a l ) ; 
         } 
 
         r e n d e r D h i k r P r e s e t s ( )   { 
                 r e t u r n   t h i s . d h i k r P r e s e t s . m a p ( p r e s e t   = >   ` 
                         < b u t t o n   c l a s s = " p r e s e t - b t n "   o n c l i c k = " a p p . s e l e c t D h i k r ( ' $ { p r e s e t . n a m e } ' ) " > 
                                 < s p a n   c l a s s = " a r a b i c " > $ { p r e s e t . a r a b i c } < / s p a n > 
                                 < s p a n   c l a s s = " c o u n t " > $ { p r e s e t . c o u n t } < / s p a n > 
                                 < s p a n   s t y l e = " f o n t - s i z e :   0 . 9 r e m ; " > $ { p r e s e t . n a m e } < / s p a n > 
                         < / b u t t o n > 
                 ` ) . j o i n ( ' ' ) ; 
         } 
 
         s e l e c t D h i k r ( n a m e )   { 
                 c o n s t   p r e s e t   =   t h i s . d h i k r P r e s e t s . f i n d ( p   = >   p . n a m e   = = =   n a m e ) ; 
                 i f   ( p r e s e t )   { 
                         t h i s . t a s b i h D a t a . c u r r e n t D h i k r   =   p r e s e t ; 
                         d o c u m e n t . g e t E l e m e n t B y I d ( ' c u r r e n t D h i k r ' ) . i n n e r H T M L   =   ` 
                                 $ { p r e s e t . a r a b i c } 
                                 < d i v   s t y l e = " f o n t - s i z e :   1 r e m ;   c o l o r :   v a r ( - - t e x t - l i g h t ) ;   m a r g i n - t o p :   5 p x ; " > 
                                         $ { p r e s e t . n a m e }   -   $ { p r e s e t . m e a n i n g } 
                                 < / d i v > 
                         ` ; 
                         d o c u m e n t . g e t E l e m e n t B y I d ( ' d h i k r C o u n t ' ) . t e x t C o n t e n t   =   p r e s e t . c o u n t ; 
                         t h i s . r e s e t T a s b i h ( ) ; 
                 } 
         } 
 
         i n c r e m e n t T a s b i h ( )   { 
                 t h i s . t a s b i h D a t a . c u r r e n t C o u n t + + ; 
                 t h i s . t a s b i h D a t a . d a i l y C o u n t + + ; 
                 t h i s . t a s b i h D a t a . t o t a l C o u n t + + ; 
                 
                 / /   U p d a t e   d i s p l a y 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' t a s b i h C o u n t ' ) . t e x t C o n t e n t   =   t h i s . t a s b i h D a t a . c u r r e n t C o u n t ; 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' d a i l y T o t a l ' ) . t e x t C o n t e n t   =   t h i s . t a s b i h D a t a . d a i l y C o u n t ; 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' a l l T i m e T o t a l ' ) . t e x t C o n t e n t   =   t h i s . t a s b i h D a t a . t o t a l C o u n t ; 
                 
                 / /   U p d a t e   g o a l   p r o g r e s s 
                 c o n s t   g o a l P e r c e n t   =   ( t h i s . t a s b i h D a t a . d a i l y C o u n t   /   t h i s . t a s b i h D a t a . g o a l )   *   1 0 0 ; 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' g o a l B a r ' ) . s t y l e . w i d t h   =   ` $ { M a t h . m i n ( g o a l P e r c e n t ,   1 0 0 ) } % ` ; 
                 
                 / /   C h e c k   i f   g o a l   r e a c h e d 
                 i f   ( t h i s . t a s b i h D a t a . d a i l y C o u n t   > =   t h i s . t a s b i h D a t a . g o a l )   { 
                         t h i s . s h o w G o a l A c h i e v e d ( ) ; 
                 } 
                 
                 / /   S a v e   t o   l o c a l S t o r a g e 
                 t h i s . s a v e T a s b i h D a t a ( ) ; 
         } 
 
         r e s e t T a s b i h ( )   { 
                 t h i s . t a s b i h D a t a . c u r r e n t C o u n t   =   0 ; 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' t a s b i h C o u n t ' ) . t e x t C o n t e n t   =   ' 0 ' ; 
                 t h i s . s a v e T a s b i h D a t a ( ) ; 
         } 
 
         s e t G o a l ( )   { 
                 c o n s t   i n p u t   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' g o a l I n p u t ' ) ; 
                 c o n s t   n e w G o a l   =   p a r s e I n t ( i n p u t . v a l u e ) ; 
                 i f   ( n e w G o a l   >   0 )   { 
                         t h i s . t a s b i h D a t a . g o a l   =   n e w G o a l ; 
                         
                         / /   U p d a t e   g o a l   p r o g r e s s 
                         c o n s t   g o a l P e r c e n t   =   ( t h i s . t a s b i h D a t a . d a i l y C o u n t   /   t h i s . t a s b i h D a t a . g o a l )   *   1 0 0 ; 
                         d o c u m e n t . g e t E l e m e n t B y I d ( ' g o a l B a r ' ) . s t y l e . w i d t h   =   ` $ { M a t h . m i n ( g o a l P e r c e n t ,   1 0 0 ) } % ` ; 
                         d o c u m e n t . q u e r y S e l e c t o r ( ' . g o a l - t e x t ' ) . t e x t C o n t e n t   =   ` D a i l y   G o a l :   $ { t h i s . t a s b i h D a t a . d a i l y C o u n t } / $ { t h i s . t a s b i h D a t a . g o a l } ` ; 
                         
                         t h i s . s a v e T a s b i h D a t a ( ) ; 
                 } 
         } 
 
         s h o w G o a l A c h i e v e d ( )   { 
                 / /   C r e a t e   c e l e b r a t i o n   e f f e c t 
                 c o n s t   m o d a l   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' t a s b i h M o d a l ' ) ; 
                 c o n s t   c e l e b r a t i o n   =   d o c u m e n t . c r e a t e E l e m e n t ( ' d i v ' ) ; 
                 c e l e b r a t i o n . s t y l e . c s s T e x t   =   ` 
                         p o s i t i o n :   f i x e d ; 
                         t o p :   5 0 % ; 
                         l e f t :   5 0 % ; 
                         t r a n s f o r m :   t r a n s l a t e ( - 5 0 % ,   - 5 0 % ) ; 
                         b a c k g r o u n d :   v a r ( - - a c c e n t - c o l o r ) ; 
                         c o l o r :   v a r ( - - p r i m a r y - c o l o r ) ; 
                         p a d d i n g :   3 0 p x ; 
                         b o r d e r - r a d i u s :   5 0 % ; 
                         f o n t - s i z e :   3 r e m ; 
                         a n i m a t i o n :   c e l e b r a t e   1 s   e a s e - o u t ; 
                         z - i n d e x :   1 0 0 0 0 ; 
                 ` ; 
                 c e l e b r a t i o n . i n n e r H T M L   =   ' <Ø‰ß' ; 
                 m o d a l . a p p e n d C h i l d ( c e l e b r a t i o n ) ; 
                 
                 s e t T i m e o u t ( ( )   = >   c e l e b r a t i o n . r e m o v e ( ) ,   2 0 0 0 ) ; 
                 
                 / /   A d d   c o n f e t t i   e f f e c t   ( s i m p l i f i e d ) 
                 f o r   ( l e t   i   =   0 ;   i   <   5 0 ;   i + + )   { 
                         s e t T i m e o u t ( ( )   = >   { 
                                 c o n s t   c o n f e t t i   =   d o c u m e n t . c r e a t e E l e m e n t ( ' d i v ' ) ; 
                                 c o n f e t t i . s t y l e . c s s T e x t   =   ` 
                                         p o s i t i o n :   f i x e d ; 
                                         l e f t :   $ { M a t h . r a n d o m ( )   *   1 0 0 } % ; 
                                         t o p :   - 1 0 p x ; 
                                         w i d t h :   1 0 p x ; 
                                         h e i g h t :   1 0 p x ; 
                                         b a c k g r o u n d :   h s l ( $ { M a t h . r a n d o m ( )   *   3 6 0 } ,   1 0 0 % ,   5 0 % ) ; 
                                         b o r d e r - r a d i u s :   5 0 % ; 
                                         a n i m a t i o n :   f a l l   $ { M a t h . r a n d o m ( )   *   3   +   2 } s   l i n e a r ; 
                                         z - i n d e x :   1 0 0 0 0 ; 
                                 ` ; 
                                 m o d a l . a p p e n d C h i l d ( c o n f e t t i ) ; 
                                 s e t T i m e o u t ( ( )   = >   c o n f e t t i . r e m o v e ( ) ,   5 0 0 0 ) ; 
                         } ,   i   *   5 0 ) ; 
                 } 
         } 
 
         l o a d T a s b i h D a t a ( )   { 
                 c o n s t   s a v e d   =   l o c a l S t o r a g e . g e t I t e m ( ' i l m n e t _ t a s b i h ' ) ; 
                 i f   ( s a v e d )   { 
                         c o n s t   d a t a   =   J S O N . p a r s e ( s a v e d ) ; 
                         
                         / /   C h e c k   i f   i t ' s   a   n e w   d a y 
                         c o n s t   t o d a y   =   n e w   D a t e ( ) . t o D a t e S t r i n g ( ) ; 
                         i f   ( d a t a . l a s t R e s e t   ! = =   t o d a y )   { 
                                 d a t a . d a i l y C o u n t   =   0 ; 
                                 d a t a . l a s t R e s e t   =   t o d a y ; 
                         } 
                         
                         t h i s . t a s b i h D a t a   =   {   . . . t h i s . t a s b i h D a t a ,   . . . d a t a   } ; 
                 } 
         } 
 
         s a v e T a s b i h D a t a ( )   { 
                 l o c a l S t o r a g e . s e t I t e m ( ' i l m n e t _ t a s b i h ' ,   J S O N . s t r i n g i f y ( t h i s . t a s b i h D a t a ) ) ; 
         } 
 
         c l o s e T a s b i h M o d a l ( )   { 
                 c o n s t   m o d a l   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' t a s b i h M o d a l ' ) ; 
                 i f   ( m o d a l )   m o d a l . r e m o v e ( ) ; 
         }  
 
         / /   = = = = = = = = = =   P R O G R E S S   T R A C K I N G   S Y S T E M   = = = = = = = = = = 
         u s e r P r o g r e s s   =   { 
                 q u i z z e s T a k e n :   0 , 
                 t o t a l S c o r e :   0 , 
                 a v e r a g e S c o r e :   0 , 
                 q u i z z e s B y C a t e g o r y :   { 
                         a q i d a h :   {   t a k e n :   0 ,   s c o r e :   0   } , 
                         e t h i c s :   {   t a k e n :   0 ,   s c o r e :   0   } 
                 } , 
                 a c h i e v e m e n t s :   [ ] , 
                 s t r e a k :   0 , 
                 l a s t A c t i v e :   n e w   D a t e ( ) . t o D a t e S t r i n g ( ) , 
                 a c t i v i t y H i s t o r y :   { } , 
                 b a d g e s :   [ ] 
         } ; 
 
         a c h i e v e m e n t s   =   [ 
                 {   i d :   ' f i r s t _ q u i z ' ,   n a m e :   ' F i r s t   S t e p s ' ,   i c o n :   ' f a - s t a r ' ,   d e s c :   ' C o m p l e t e d   y o u r   f i r s t   q u i z ' ,   p o i n t s :   1 0   } , 
                 {   i d :   ' p e r f e c t _ s c o r e ' ,   n a m e :   ' P e r f e c t   S c h o l a r ' ,   i c o n :   ' f a - c r o w n ' ,   d e s c :   ' G o t   1 0 0 %   o n   a n y   q u i z ' ,   p o i n t s :   5 0   } , 
                 {   i d :   ' q u i z _ m a s t e r ' ,   n a m e :   ' Q u i z   M a s t e r ' ,   i c o n :   ' f a - g r a d u a t i o n - c a p ' ,   d e s c :   ' C o m p l e t e d   1 0   q u i z z e s ' ,   p o i n t s :   1 0 0   } , 
                 {   i d :   ' s t r e a k _ 7 ' ,   n a m e :   ' W e e k l y   W a r r i o r ' ,   i c o n :   ' f a - f i r e ' ,   d e s c :   ' 7   d a y   l e a r n i n g   s t r e a k ' ,   p o i n t s :   7 0   } , 
                 {   i d :   ' s t r e a k _ 3 0 ' ,   n a m e :   ' M o n t h l y   M a s t e r ' ,   i c o n :   ' f a - c a l e n d a r - c h e c k ' ,   d e s c :   ' 3 0   d a y   l e a r n i n g   s t r e a k ' ,   p o i n t s :   3 0 0   } , 
                 {   i d :   ' a q i d a h _ s c h o l a r ' ,   n a m e :   ' A q i d a h   S c h o l a r ' ,   i c o n :   ' f a - b o o k - o p e n ' ,   d e s c :   ' C o m p l e t e d   a l l   A q i d a h   q u i z z e s ' ,   p o i n t s :   1 5 0   } , 
                 {   i d :   ' e t h i c s _ s c h o l a r ' ,   n a m e :   ' E t h i c s   S c h o l a r ' ,   i c o n :   ' f a - s c a l e - b a l a n c e d ' ,   d e s c :   ' C o m p l e t e d   a l l   E t h i c s   q u i z z e s ' ,   p o i n t s :   1 5 0   } , 
                 {   i d :   ' f a s t _ l e a r n e r ' ,   n a m e :   ' F a s t   L e a r n e r ' ,   i c o n :   ' f a - r o c k e t ' ,   d e s c :   ' C o m p l e t e d   q u i z   i n   u n d e r   2   m i n u t e s ' ,   p o i n t s :   2 5   } , 
                 {   i d :   ' d e d i c a t e d ' ,   n a m e :   ' D e d i c a t e d   S t u d e n t ' ,   i c o n :   ' f a - h e a r t ' ,   d e s c :   ' 5 0   t o t a l   q u i z   a t t e m p t s ' ,   p o i n t s :   2 0 0   } 
         ] ; 
 
         a s y n c   s h o w P r o g r e s s ( )   { 
                 t h i s . l o a d P r o g r e s s D a t a ( ) ; 
                 
                 / /   C r e a t e   p r o g r e s s   m o d a l 
                 c o n s t   m o d a l   =   d o c u m e n t . c r e a t e E l e m e n t ( ' d i v ' ) ; 
                 m o d a l . c l a s s N a m e   =   ' m o d a l - o v e r l a y   a c t i v e ' ; 
                 m o d a l . i d   =   ' p r o g r e s s M o d a l ' ; 
                 m o d a l . i n n e r H T M L   =   ` 
                         < d i v   c l a s s = " m o d a l "   s t y l e = " m a x - w i d t h :   1 2 0 0 p x ; " > 
                                 < d i v   c l a s s = " m o d a l - h e a d e r " > 
                                         < d i v   c l a s s = " m o d a l - t i t l e " > 
                                                 < i   c l a s s = " f a s   f a - c h a r t - l i n e " > < / i > 
                                                 < s p a n > Y o u r   L e a r n i n g   P r o g r e s s < / s p a n > 
                                         < / d i v > 
                                         < b u t t o n   c l a s s = " m o d a l - c l o s e "   o n c l i c k = " a p p . c l o s e P r o g r e s s M o d a l ( ) " > & t i m e s ; < / b u t t o n > 
                                 < / d i v > 
                                 < d i v   c l a s s = " m o d a l - b o d y " > 
                                         < d i v   c l a s s = " p r o g r e s s - s e c t i o n " > 
                                                 < d i v   c l a s s = " p r o g r e s s - h e a d e r " > 
                                                         < d i v   c l a s s = " p r o g r e s s - t i t l e " > 
                                                                 < i   c l a s s = " f a s   f a - t r o p h y " > < / i > 
                                                                 < s p a n > L e a r n i n g   A n a l y t i c s < / s p a n > 
                                                         < / d i v > 
                                                         < b u t t o n   c l a s s = " l o c a t i o n - b t n "   o n c l i c k = " a p p . r e f r e s h P r o g r e s s ( ) " > 
                                                                 < i   c l a s s = " f a s   f a - s y n c - a l t " > < / i >   R e f r e s h 
                                                         < / b u t t o n > 
                                                 < / d i v > 
                                                 
                                                 < d i v   c l a s s = " p r o g r e s s - s t a t s - g r i d " > 
                                                         < d i v   c l a s s = " p r o g r e s s - s t a t - c a r d " > 
                                                                 < d i v   c l a s s = " s t a t - i c o n " > < i   c l a s s = " f a s   f a - p e n c i l - a l t " > < / i > < / d i v > 
                                                                 < d i v   c l a s s = " s t a t - n u m b e r "   i d = " t o t a l Q u i z z e s " > $ { t h i s . u s e r P r o g r e s s . q u i z z e s T a k e n } < / d i v > 
                                                                 < d i v   c l a s s = " s t a t - l a b e l " > Q u i z z e s   T a k e n < / d i v > 
                                                         < / d i v > 
                                                         < d i v   c l a s s = " p r o g r e s s - s t a t - c a r d " > 
                                                                 < d i v   c l a s s = " s t a t - i c o n " > < i   c l a s s = " f a s   f a - p e r c e n t " > < / i > < / d i v > 
                                                                 < d i v   c l a s s = " s t a t - n u m b e r "   i d = " a v g S c o r e " > $ { t h i s . u s e r P r o g r e s s . a v e r a g e S c o r e } % < / d i v > 
                                                                 < d i v   c l a s s = " s t a t - l a b e l " > A v e r a g e   S c o r e < / d i v > 
                                                         < / d i v > 
                                                         < d i v   c l a s s = " p r o g r e s s - s t a t - c a r d " > 
                                                                 < d i v   c l a s s = " s t a t - i c o n " > < i   c l a s s = " f a s   f a - f i r e " > < / i > < / d i v > 
                                                                 < d i v   c l a s s = " s t a t - n u m b e r "   i d = " s t r e a k C o u n t " > $ { t h i s . u s e r P r o g r e s s . s t r e a k } < / d i v > 
                                                                 < d i v   c l a s s = " s t a t - l a b e l " > D a y   S t r e a k < / d i v > 
                                                         < / d i v > 
                                                         < d i v   c l a s s = " p r o g r e s s - s t a t - c a r d " > 
                                                                 < d i v   c l a s s = " s t a t - i c o n " > < i   c l a s s = " f a s   f a - s t a r " > < / i > < / d i v > 
                                                                 < d i v   c l a s s = " s t a t - n u m b e r "   i d = " a c h i e v e m e n t C o u n t " > $ { t h i s . u s e r P r o g r e s s . a c h i e v e m e n t s . l e n g t h } < / d i v > 
                                                                 < d i v   c l a s s = " s t a t - l a b e l " > A c h i e v e m e n t s < / d i v > 
                                                         < / d i v > 
                                                 < / d i v > 
                                                 
                                                 < d i v   c l a s s = " c h a r t s - c o n t a i n e r " > 
                                                         < d i v   c l a s s = " c h a r t - c a r d " > 
                                                                 < d i v   c l a s s = " c h a r t - t i t l e " > 
                                                                         < i   c l a s s = " f a s   f a - c h a r t - p i e " > < / i > 
                                                                         < s p a n > Q u i z   P e r f o r m a n c e   b y   C a t e g o r y < / s p a n > 
                                                                 < / d i v > 
                                                                 < d i v   c l a s s = " c h a r t - w r a p p e r " > 
                                                                         < c a n v a s   i d = " c a t e g o r y C h a r t " > < / c a n v a s > 
                                                                 < / d i v > 
                                                         < / d i v > 
                                                         
                                                         < d i v   c l a s s = " c h a r t - c a r d " > 
                                                                 < d i v   c l a s s = " c h a r t - t i t l e " > 
                                                                         < i   c l a s s = " f a s   f a - c h a r t - l i n e " > < / i > 
                                                                         < s p a n > P r o g r e s s   O v e r   T i m e < / s p a n > 
                                                                 < / d i v > 
                                                                 < d i v   c l a s s = " c h a r t - w r a p p e r " > 
                                                                         < c a n v a s   i d = " p r o g r e s s C h a r t " > < / c a n v a s > 
                                                                 < / d i v > 
                                                         < / d i v > 
                                                 < / d i v > 
                                                 
                                                 < d i v   c l a s s = " l e a r n i n g - s t r e a k " > 
                                                         < d i v   c l a s s = " s t r e a k - i c o n " > < i   c l a s s = " f a s   f a - c a l e n d a r - a l t " > < / i > < / d i v > 
                                                         < d i v   c l a s s = " s t r e a k - i n f o " > 
                                                                 < h 3 > L e a r n i n g   S t r e a k < / h 3 > 
                                                                 < p > Y o u ' v e   b e e n   c o n s i s t e n t !   K e e p   i t   u p ! < / p > 
                                                         < / d i v > 
                                                         < d i v   c l a s s = " s t r e a k - d a y s "   i d = " s t r e a k D a y s " > $ { t h i s . u s e r P r o g r e s s . s t r e a k }   d a y s < / d i v > 
                                                 < / d i v > 
                                                 
                                                 < h 3   s t y l e = " m a r g i n :   3 0 p x   0   1 5 p x ;   c o l o r :   v a r ( - - p r i m a r y - c o l o r ) ; " > 
                                                         < i   c l a s s = " f a s   f a - m e d a l " > < / i >   A c h i e v e m e n t s   &   B a d g e s 
                                                 < / h 3 > 
                                                 < d i v   c l a s s = " a c h i e v e m e n t s - g r i d "   i d = " a c h i e v e m e n t s G r i d " > 
                                                         $ { t h i s . r e n d e r A c h i e v e m e n t s ( ) } 
                                                 < / d i v > 
                                                 
                                                 < h 3   s t y l e = " m a r g i n :   3 0 p x   0   1 5 p x ;   c o l o r :   v a r ( - - p r i m a r y - c o l o r ) ; " > 
                                                         < i   c l a s s = " f a s   f a - c a l e n d a r " > < / i >   A c t i v i t y   C a l e n d a r 
                                                 < / h 3 > 
                                                 < d i v   c l a s s = " c a l e n d a r - h e a t m a p "   i d = " a c t i v i t y C a l e n d a r " > 
                                                         $ { t h i s . r e n d e r A c t i v i t y C a l e n d a r ( ) } 
                                                 < / d i v > 
                                                 < d i v   c l a s s = " c a l e n d a r - l a b e l " > 
                                                         < s p a n > L e s s < / s p a n > 
                                                         < s p a n > Ï%< / s p a n > < s p a n > Ï%< / s p a n > < s p a n > Ï%< / s p a n > < s p a n > Ï%< / s p a n > < s p a n > Ï%< / s p a n > 
                                                         < s p a n > M o r e < / s p a n > 
                                                 < / d i v > 
                                         < / d i v > 
                                 < / d i v > 
                         < / d i v > 
                 ` ; 
                 
                 d o c u m e n t . b o d y . a p p e n d C h i l d ( m o d a l ) ; 
                 
                 / /   I n i t i a l i z e   c h a r t s   a f t e r   m o d a l   i s   a d d e d   t o   D O M 
                 s e t T i m e o u t ( ( )   = >   { 
                         t h i s . i n i t C h a r t s ( ) ; 
                 } ,   1 0 0 ) ; 
         } 
 
         r e n d e r A c h i e v e m e n t s ( )   { 
                 r e t u r n   t h i s . a c h i e v e m e n t s . m a p ( a c h i e v e m e n t   = >   { 
                         c o n s t   u n l o c k e d   =   t h i s . u s e r P r o g r e s s . a c h i e v e m e n t s . i n c l u d e s ( a c h i e v e m e n t . i d ) ; 
                         r e t u r n   ` 
                                 < d i v   c l a s s = " a c h i e v e m e n t - c a r d   $ { u n l o c k e d   ?   ' u n l o c k e d '   :   ' ' } " > 
                                         < d i v   c l a s s = " a c h i e v e m e n t - i c o n " > < i   c l a s s = " f a s   $ { a c h i e v e m e n t . i c o n } " > < / i > < / d i v > 
                                         < d i v   c l a s s = " a c h i e v e m e n t - n a m e " > $ { a c h i e v e m e n t . n a m e } < / d i v > 
                                         < d i v   c l a s s = " a c h i e v e m e n t - d e s c " > $ { a c h i e v e m e n t . d e s c } < / d i v > 
                                         < d i v   c l a s s = " a c h i e v e m e n t - l o c k " > 
                                                 < i   c l a s s = " f a s   $ { u n l o c k e d   ?   ' f a - c h e c k - c i r c l e '   :   ' f a - l o c k ' } " > < / i > 
                                         < / d i v > 
                                 < / d i v > 
                         ` ; 
                 } ) . j o i n ( ' ' ) ; 
         } 
 
         r e n d e r A c t i v i t y C a l e n d a r ( )   { 
                 c o n s t   t o d a y   =   n e w   D a t e ( ) ; 
                 c o n s t   c a l e n d a r   =   [ ] ; 
                 c o n s t   d a y s I n M o n t h   =   n e w   D a t e ( t o d a y . g e t F u l l Y e a r ( ) ,   t o d a y . g e t M o n t h ( )   +   1 ,   0 ) . g e t D a t e ( ) ; 
                 
                 / /   G e t   f i r s t   d a y   o f   m o n t h   ( 0   =   S u n d a y ,   1   =   M o n d a y ,   e t c . ) 
                 c o n s t   f i r s t D a y   =   n e w   D a t e ( t o d a y . g e t F u l l Y e a r ( ) ,   t o d a y . g e t M o n t h ( ) ,   1 ) . g e t D a y ( ) ; 
                 
                 / /   A d d   e m p t y   c e l l s   f o r   d a y s   b e f o r e   m o n t h   s t a r t s 
                 f o r   ( l e t   i   =   0 ;   i   <   f i r s t D a y ;   i + + )   { 
                         c a l e n d a r . p u s h ( ' < d i v   c l a s s = " c a l e n d a r - d a y " > < / d i v > ' ) ; 
                 } 
                 
                 / /   A d d   d a y s   o f   m o n t h 
                 f o r   ( l e t   d a y   =   1 ;   d a y   < =   d a y s I n M o n t h ;   d a y + + )   { 
                         c o n s t   d a t e   =   n e w   D a t e ( t o d a y . g e t F u l l Y e a r ( ) ,   t o d a y . g e t M o n t h ( ) ,   d a y ) . t o D a t e S t r i n g ( ) ; 
                         c o n s t   a c t i v i t y   =   t h i s . u s e r P r o g r e s s . a c t i v i t y H i s t o r y [ d a t e ]   | |   0 ; 
                         
                         / /   D e t e r m i n e   a c t i v i t y   l e v e l   ( 0 - 4 ) 
                         l e t   l e v e l   =   0 ; 
                         i f   ( a c t i v i t y   >   0 )   l e v e l   =   1 ; 
                         i f   ( a c t i v i t y   > =   3 )   l e v e l   =   2 ; 
                         i f   ( a c t i v i t y   > =   5 )   l e v e l   =   3 ; 
                         i f   ( a c t i v i t y   > =   1 0 )   l e v e l   =   4 ; 
                         
                         c a l e n d a r . p u s h ( ` 
                                 < d i v   c l a s s = " c a l e n d a r - d a y   l e v e l - $ { l e v e l } "   d a t a - d a t e = " $ { d a t e } "   
                                           t i t l e = " $ { d a t e } :   $ { a c t i v i t y }   a c t i v i t i e s " > < / d i v > 
                         ` ) ; 
                 } 
                 
                 r e t u r n   c a l e n d a r . j o i n ( ' ' ) ; 
         } 
 
         i n i t C h a r t s ( )   { 
                 / /   C a t e g o r y   P e r f o r m a n c e   C h a r t 
                 c o n s t   c a t e g o r y C t x   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' c a t e g o r y C h a r t ' ) ? . g e t C o n t e x t ( ' 2 d ' ) ; 
                 i f   ( c a t e g o r y C t x )   { 
                         n e w   C h a r t ( c a t e g o r y C t x ,   { 
                                 t y p e :   ' d o u g h n u t ' , 
                                 d a t a :   { 
                                         l a b e l s :   [ ' A q i d a h   ( T h e o l o g y ) ' ,   ' E t h i c s   &   J u s t i c e ' ] , 
                                         d a t a s e t s :   [ { 
                                                 d a t a :   [ 
                                                         t h i s . u s e r P r o g r e s s . q u i z z e s B y C a t e g o r y . a q i d a h . t a k e n   | |   1 , 
                                                         t h i s . u s e r P r o g r e s s . q u i z z e s B y C a t e g o r y . e t h i c s . t a k e n   | |   1 
                                                 ] , 
                                                 b a c k g r o u n d C o l o r :   [ ' # 0 c 3 b 2 e ' ,   ' # d 4 a f 3 7 ' ] , 
                                                 b o r d e r C o l o r :   [ ' # 1 a 5 c 4 8 ' ,   ' # f 4 e 9 c 9 ' ] , 
                                                 b o r d e r W i d t h :   2 
                                         } ] 
                                 } , 
                                 o p t i o n s :   { 
                                         r e s p o n s i v e :   t r u e , 
                                         m a i n t a i n A s p e c t R a t i o :   f a l s e , 
                                         p l u g i n s :   { 
                                                 l e g e n d :   { 
                                                         p o s i t i o n :   ' b o t t o m ' 
                                                 } 
                                         } 
                                 } 
                         } ) ; 
                 } 
 
                 / /   P r o g r e s s   O v e r   T i m e   C h a r t 
                 c o n s t   p r o g r e s s C t x   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' p r o g r e s s C h a r t ' ) ? . g e t C o n t e x t ( ' 2 d ' ) ; 
                 i f   ( p r o g r e s s C t x )   { 
                         / /   G e n e r a t e   l a s t   7   d a y s   l a b e l s 
                         c o n s t   l a b e l s   =   [ ] ; 
                         c o n s t   d a t a   =   [ ] ; 
                         f o r   ( l e t   i   =   6 ;   i   > =   0 ;   i - - )   { 
                                 c o n s t   d a t e   =   n e w   D a t e ( ) ; 
                                 d a t e . s e t D a t e ( d a t e . g e t D a t e ( )   -   i ) ; 
                                 l a b e l s . p u s h ( d a t e . t o L o c a l e D a t e S t r i n g ( ' e n - U S ' ,   {   w e e k d a y :   ' s h o r t '   } ) ) ; 
                                 
                                 c o n s t   d a t e S t r   =   d a t e . t o D a t e S t r i n g ( ) ; 
                                 d a t a . p u s h ( t h i s . u s e r P r o g r e s s . a c t i v i t y H i s t o r y [ d a t e S t r ]   | |   0 ) ; 
                         } 
 
                         n e w   C h a r t ( p r o g r e s s C t x ,   { 
                                 t y p e :   ' l i n e ' , 
                                 d a t a :   { 
                                         l a b e l s :   l a b e l s , 
                                         d a t a s e t s :   [ { 
                                                 l a b e l :   ' A c t i v i t i e s ' , 
                                                 d a t a :   d a t a , 
                                                 b o r d e r C o l o r :   ' # 0 c 3 b 2 e ' , 
                                                 b a c k g r o u n d C o l o r :   ' r g b a ( 1 2 ,   5 9 ,   4 6 ,   0 . 1 ) ' , 
                                                 t e n s i o n :   0 . 4 , 
                                                 f i l l :   t r u e 
                                         } ] 
                                 } , 
                                 o p t i o n s :   { 
                                         r e s p o n s i v e :   t r u e , 
                                         m a i n t a i n A s p e c t R a t i o :   f a l s e , 
                                         s c a l e s :   { 
                                                 y :   { 
                                                         b e g i n A t Z e r o :   t r u e , 
                                                         t i c k s :   { 
                                                                 s t e p S i z e :   1 
                                                         } 
                                                 } 
                                         } 
                                 } 
                         } ) ; 
                 } 
         } 
 
         u p d a t e P r o g r e s s ( q u i z D a t a )   { 
                 / /   U p d a t e   q u i z   c o u n t s 
                 t h i s . u s e r P r o g r e s s . q u i z z e s T a k e n + + ; 
                 
                 / /   U p d a t e   c a t e g o r y   s c o r e s 
                 c o n s t   c a t e g o r y   =   q u i z D a t a . c a t e g o r y ; 
                 i f   ( t h i s . u s e r P r o g r e s s . q u i z z e s B y C a t e g o r y [ c a t e g o r y ] )   { 
                         t h i s . u s e r P r o g r e s s . q u i z z e s B y C a t e g o r y [ c a t e g o r y ] . t a k e n + + ; 
                         t h i s . u s e r P r o g r e s s . q u i z z e s B y C a t e g o r y [ c a t e g o r y ] . s c o r e   + =   q u i z D a t a . s c o r e ; 
                 } 
                 
                 / /   U p d a t e   a v e r a g e   s c o r e 
                 l e t   t o t a l S c o r e   =   0 ; 
                 l e t   t o t a l Q u i z z e s   =   0 ; 
                 O b j e c t . k e y s ( t h i s . u s e r P r o g r e s s . q u i z z e s B y C a t e g o r y ) . f o r E a c h ( c a t   = >   { 
                         t o t a l S c o r e   + =   t h i s . u s e r P r o g r e s s . q u i z z e s B y C a t e g o r y [ c a t ] . s c o r e ; 
                         t o t a l Q u i z z e s   + =   t h i s . u s e r P r o g r e s s . q u i z z e s B y C a t e g o r y [ c a t ] . t a k e n ; 
                 } ) ; 
                 t h i s . u s e r P r o g r e s s . a v e r a g e S c o r e   =   M a t h . r o u n d ( ( t o t a l S c o r e   /   ( t o t a l Q u i z z e s   *   5 ) )   *   1 0 0 ) ; 
                 
                 / /   C h e c k   f o r   a c h i e v e m e n t s 
                 t h i s . c h e c k A c h i e v e m e n t s ( q u i z D a t a ) ; 
                 
                 / /   U p d a t e   s t r e a k 
                 t h i s . u p d a t e S t r e a k ( ) ; 
                 
                 / /   U p d a t e   a c t i v i t y   h i s t o r y 
                 c o n s t   t o d a y   =   n e w   D a t e ( ) . t o D a t e S t r i n g ( ) ; 
                 t h i s . u s e r P r o g r e s s . a c t i v i t y H i s t o r y [ t o d a y ]   =   ( t h i s . u s e r P r o g r e s s . a c t i v i t y H i s t o r y [ t o d a y ]   | |   0 )   +   1 ; 
                 
                 / /   S a v e   t o   l o c a l S t o r a g e 
                 t h i s . s a v e P r o g r e s s D a t a ( ) ; 
         } 
 
         c h e c k A c h i e v e m e n t s ( q u i z D a t a )   { 
                 / /   F i r s t   q u i z   a c h i e v e m e n t 
                 i f   ( t h i s . u s e r P r o g r e s s . q u i z z e s T a k e n   = = =   1   & &   ! t h i s . u s e r P r o g r e s s . a c h i e v e m e n t s . i n c l u d e s ( ' f i r s t _ q u i z ' ) )   { 
                         t h i s . u s e r P r o g r e s s . a c h i e v e m e n t s . p u s h ( ' f i r s t _ q u i z ' ) ; 
                 } 
                 
                 / /   P e r f e c t   s c o r e   a c h i e v e m e n t 
                 i f   ( q u i z D a t a . s c o r e   = = =   5   & &   ! t h i s . u s e r P r o g r e s s . a c h i e v e m e n t s . i n c l u d e s ( ' p e r f e c t _ s c o r e ' ) )   { 
                         t h i s . u s e r P r o g r e s s . a c h i e v e m e n t s . p u s h ( ' p e r f e c t _ s c o r e ' ) ; 
                 } 
                 
                 / /   Q u i z   m a s t e r   ( 1 0   q u i z z e s ) 
                 i f   ( t h i s . u s e r P r o g r e s s . q u i z z e s T a k e n   > =   1 0   & &   ! t h i s . u s e r P r o g r e s s . a c h i e v e m e n t s . i n c l u d e s ( ' q u i z _ m a s t e r ' ) )   { 
                         t h i s . u s e r P r o g r e s s . a c h i e v e m e n t s . p u s h ( ' q u i z _ m a s t e r ' ) ; 
                 } 
                 
                 / /   C a t e g o r y   c o m p l e t i o n 
                 i f   ( t h i s . u s e r P r o g r e s s . q u i z z e s B y C a t e g o r y . a q i d a h . t a k e n   > =   3   & &   
                         ! t h i s . u s e r P r o g r e s s . a c h i e v e m e n t s . i n c l u d e s ( ' a q i d a h _ s c h o l a r ' ) )   { 
                         t h i s . u s e r P r o g r e s s . a c h i e v e m e n t s . p u s h ( ' a q i d a h _ s c h o l a r ' ) ; 
                 } 
                 
                 i f   ( t h i s . u s e r P r o g r e s s . q u i z z e s B y C a t e g o r y . e t h i c s . t a k e n   > =   2   & &   
                         ! t h i s . u s e r P r o g r e s s . a c h i e v e m e n t s . i n c l u d e s ( ' e t h i c s _ s c h o l a r ' ) )   { 
                         t h i s . u s e r P r o g r e s s . a c h i e v e m e n t s . p u s h ( ' e t h i c s _ s c h o l a r ' ) ; 
                 } 
                 
                 / /   S t r e a k   a c h i e v e m e n t s 
                 i f   ( t h i s . u s e r P r o g r e s s . s t r e a k   > =   7   & &   ! t h i s . u s e r P r o g r e s s . a c h i e v e m e n t s . i n c l u d e s ( ' s t r e a k _ 7 ' ) )   { 
                         t h i s . u s e r P r o g r e s s . a c h i e v e m e n t s . p u s h ( ' s t r e a k _ 7 ' ) ; 
                 } 
                 
                 i f   ( t h i s . u s e r P r o g r e s s . s t r e a k   > =   3 0   & &   ! t h i s . u s e r P r o g r e s s . a c h i e v e m e n t s . i n c l u d e s ( ' s t r e a k _ 3 0 ' ) )   { 
                         t h i s . u s e r P r o g r e s s . a c h i e v e m e n t s . p u s h ( ' s t r e a k _ 3 0 ' ) ; 
                 } 
         } 
 
         u p d a t e S t r e a k ( )   { 
                 c o n s t   t o d a y   =   n e w   D a t e ( ) . t o D a t e S t r i n g ( ) ; 
                 c o n s t   y e s t e r d a y   =   n e w   D a t e ( ) ; 
                 y e s t e r d a y . s e t D a t e ( y e s t e r d a y . g e t D a t e ( )   -   1 ) ; 
                 c o n s t   y e s t e r d a y S t r   =   y e s t e r d a y . t o D a t e S t r i n g ( ) ; 
                 
                 i f   ( t h i s . u s e r P r o g r e s s . a c t i v i t y H i s t o r y [ t o d a y ] )   { 
                         / /   A l r e a d y   a c t i v e   t o d a y ,   s t r e a k   c o n t i n u e s 
                 }   e l s e   i f   ( t h i s . u s e r P r o g r e s s . a c t i v i t y H i s t o r y [ y e s t e r d a y S t r ] )   { 
                         / /   A c t i v e   y e s t e r d a y ,   i n c r e m e n t   s t r e a k 
                         t h i s . u s e r P r o g r e s s . s t r e a k + + ; 
                 }   e l s e   { 
                         / /   N o   a c t i v i t y   y e s t e r d a y ,   r e s e t   s t r e a k 
                         t h i s . u s e r P r o g r e s s . s t r e a k   =   1 ; 
                 } 
                 
                 t h i s . u s e r P r o g r e s s . l a s t A c t i v e   =   t o d a y ; 
         } 
 
         l o a d P r o g r e s s D a t a ( )   { 
                 c o n s t   s a v e d   =   l o c a l S t o r a g e . g e t I t e m ( ' i l m n e t _ p r o g r e s s ' ) ; 
                 i f   ( s a v e d )   { 
                         t h i s . u s e r P r o g r e s s   =   {   . . . t h i s . u s e r P r o g r e s s ,   . . . J S O N . p a r s e ( s a v e d )   } ; 
                 } 
         } 
 
         s a v e P r o g r e s s D a t a ( )   { 
                 l o c a l S t o r a g e . s e t I t e m ( ' i l m n e t _ p r o g r e s s ' ,   J S O N . s t r i n g i f y ( t h i s . u s e r P r o g r e s s ) ) ; 
         } 
 
         r e f r e s h P r o g r e s s ( )   { 
                 / /   R e f r e s h   t h e   p r o g r e s s   d i s p l a y 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' t o t a l Q u i z z e s ' ) . t e x t C o n t e n t   =   t h i s . u s e r P r o g r e s s . q u i z z e s T a k e n ; 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' a v g S c o r e ' ) . t e x t C o n t e n t   =   t h i s . u s e r P r o g r e s s . a v e r a g e S c o r e   +   ' % ' ; 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' s t r e a k C o u n t ' ) . t e x t C o n t e n t   =   t h i s . u s e r P r o g r e s s . s t r e a k ; 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' a c h i e v e m e n t C o u n t ' ) . t e x t C o n t e n t   =   t h i s . u s e r P r o g r e s s . a c h i e v e m e n t s . l e n g t h ; 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' s t r e a k D a y s ' ) . t e x t C o n t e n t   =   t h i s . u s e r P r o g r e s s . s t r e a k   +   '   d a y s ' ; 
                 
                 / /   R e - r e n d e r   a c h i e v e m e n t s 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' a c h i e v e m e n t s G r i d ' ) . i n n e r H T M L   =   t h i s . r e n d e r A c h i e v e m e n t s ( ) ; 
                 
                 / /   R e - r e n d e r   c a l e n d a r 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' a c t i v i t y C a l e n d a r ' ) . i n n e r H T M L   =   t h i s . r e n d e r A c t i v i t y C a l e n d a r ( ) ; 
                 
                 / /   R e i n i t i a l i z e   c h a r t s 
                 t h i s . i n i t C h a r t s ( ) ; 
         } 
 
         c l o s e P r o g r e s s M o d a l ( )   { 
                 c o n s t   m o d a l   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' p r o g r e s s M o d a l ' ) ; 
                 i f   ( m o d a l )   m o d a l . r e m o v e ( ) ; 
         } 
 
         / /   O v e r r i d e   s u b m i t Q u i z   t o   u p d a t e   p r o g r e s s 
         s u b m i t Q u i z ( )   { 
                 / /   C a l c u l a t e   s c o r e 
                 t h i s . q u i z S c o r e   =   0 ; 
                 t h i s . c u r r e n t Q u i z . q u e s t i o n s . f o r E a c h ( ( q ,   i d x )   = >   { 
                         i f   ( t h i s . u s e r A n s w e r s [ i d x ]   = = =   q . c o r r e c t )   { 
                                 t h i s . q u i z S c o r e + + ; 
                         } 
                 } ) ; 
                 
                 c o n s t   p e r c e n t a g e   =   M a t h . r o u n d ( ( t h i s . q u i z S c o r e   /   t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h )   *   1 0 0 ) ; 
                 l e t   m e s s a g e   =   ' ' ; 
                 
                 i f   ( p e r c e n t a g e   > =   8 0 )   m e s s a g e   =   ' E x c e l l e n t !   Y o u   h a v e   a   s t r o n g   u n d e r s t a n d i n g   o f   t h i s   t o p i c . ' ; 
                 e l s e   i f   ( p e r c e n t a g e   > =   6 0 )   m e s s a g e   =   ' G o o d   j o b !   Y o u   h a v e   a   g o o d   g r a s p   o f   t h e   c o n c e p t s . ' ; 
                 e l s e   i f   ( p e r c e n t a g e   > =   4 0 )   m e s s a g e   =   ' F a i r   u n d e r s t a n d i n g .   C o n s i d e r   r e v i e w i n g   t h e   m a t e r i a l . ' ; 
                 e l s e   m e s s a g e   =   ' K e e p   s t u d y i n g !   R e v i e w   t h e   m a t e r i a l   a n d   t r y   a g a i n . ' ; 
                 
                 / /   U p d a t e   p r o g r e s s   t r a c k i n g 
                 t h i s . u p d a t e P r o g r e s s ( { 
                         c a t e g o r y :   t h i s . c u r r e n t Q u i z . i d . i n c l u d e s ( ' a q i d a h ' )   ?   ' a q i d a h '   :   ' e t h i c s ' , 
                         s c o r e :   t h i s . q u i z S c o r e , 
                         t o t a l :   t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h 
                 } ) ; 
                 
                 / /   S h o w   r e s u l t s 
                 c o n s t   c o n t a i n e r   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' q u i z C o n t a i n e r ' ) ; 
                 c o n t a i n e r . i n n e r H T M L   =   ` 
                         < d i v   c l a s s = " q u i z - r e s u l t s " > 
                                 < h 2 > Q u i z   C o m p l e t e d ! < / h 2 > 
                                 < d i v   c l a s s = " r e s u l t - s c o r e " > $ { t h i s . q u i z S c o r e } / $ { t h i s . c u r r e n t Q u i z . q u e s t i o n s . l e n g t h } < / d i v > 
                                 < d i v   c l a s s = " r e s u l t - m e s s a g e " > $ { m e s s a g e } < / d i v > 
                                 
                                 < d i v   c l a s s = " r e s u l t - d e t a i l s " > 
                                         < d i v   c l a s s = " r e s u l t - s t a t " > 
                                                 < d i v   c l a s s = " s t a t - l a b e l " > C o r r e c t   A n s w e r s < / d i v > 
                                                 < d i v   c l a s s = " s t a t - v a l u e " > $ { t h i s . q u i z S c o r e } < / d i v > 
                                         < / d i v > 
                                         < d i v   c l a s s = " r e s u l t - s t a t " > 
                                                 < d i v   c l a s s = " s t a t - l a b e l " > P e r c e n t a g e < / d i v > 
                                                 < d i v   c l a s s = " s t a t - v a l u e " > $ { p e r c e n t a g e } % < / d i v > 
                                         < / d i v > 
                                         < d i v   c l a s s = " r e s u l t - s t a t " > 
                                                 < d i v   c l a s s = " s t a t - l a b e l " > P o i n t s   E a r n e d < / d i v > 
                                                 < d i v   c l a s s = " s t a t - v a l u e " > + $ { t h i s . q u i z S c o r e   *   1 0 } < / d i v > 
                                         < / d i v > 
                                 < / d i v > 
                                 
                                 < d i v   c l a s s = " q u i z - a c t i o n s " > 
                                         < b u t t o n   c l a s s = " q u i z - a c t i o n - b t n   p r i m a r y "   o n c l i c k = " a p p . c l o s e Q u i z M o d a l ( ) " > C l o s e < / b u t t o n > 
                                         < b u t t o n   c l a s s = " q u i z - a c t i o n - b t n   s e c o n d a r y "   o n c l i c k = " a p p . r e s t a r t Q u i z ( ) " > T r y   A g a i n < / b u t t o n > 
                                 < / d i v > 
                         < / d i v > 
                 ` ; 
                 
                 / /   U p d a t e   h e a d e r 
                 c o n s t   h e a d e r   =   d o c u m e n t . q u e r y S e l e c t o r ( ' . q u i z - h e a d e r   . q u i z - t i t l e ' ) ; 
                 i f   ( h e a d e r )   h e a d e r . t e x t C o n t e n t   =   ' Q u i z   C o m p l e t e ! ' ; 
         }  
 
         / /   = = = = = = = = = =   A U D I O   R E C I T A T I O N   S Y S T E M   = = = = = = = = = = 
         a u d i o D a t a   =   { 
                 c u r r e n t S u r a h :   n u l l , 
                 c u r r e n t R e c i t e r :   ' M i s h a r y   R a s h i d   A l a f a s y ' , 
                 i s P l a y i n g :   f a l s e , 
                 c u r r e n t T i m e :   0 , 
                 d u r a t i o n :   0 , 
                 v o l u m e :   1 , 
                 s u r a h s :   [ 
                         {   n u m b e r :   1 ,   n a m e :   ' A l - F a t i h a h ' ,   a r a b i c :   ' 'DA'*-)' ,   v e r s e s :   7 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 0 1 . m p 3 '   } , 
                         {   n u m b e r :   2 ,   n a m e :   ' A l - B a q a r a h ' ,   a r a b i c :   ' 'D(B1)' ,   v e r s e s :   2 8 6 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 0 2 . m p 3 '   } , 
                         {   n u m b e r :   3 ,   n a m e :   ' A a l - E - I m r a n ' ,   a r a b i c :   ' "D  9E1'F' ,   v e r s e s :   2 0 0 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 0 3 . m p 3 '   } , 
                         {   n u m b e r :   4 ,   n a m e :   ' A n - N i s a ' ,   a r a b i c :   ' 'DF3'!' ,   v e r s e s :   1 7 6 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 0 4 . m p 3 '   } , 
                         {   n u m b e r :   5 ,   n a m e :   ' A l - M a \ ' i d a h ' ,   a r a b i c :   ' 'DE'&/)' ,   v e r s e s :   1 2 0 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 0 5 . m p 3 '   } , 
                         {   n u m b e r :   6 ,   n a m e :   ' A l - A n \ ' a m ' ,   a r a b i c :   ' 'D#F9'E' ,   v e r s e s :   1 6 5 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 0 6 . m p 3 '   } , 
                         {   n u m b e r :   7 ,   n a m e :   ' A l - A \ ' r a f ' ,   a r a b i c :   ' 'D#91'A' ,   v e r s e s :   2 0 6 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 0 7 . m p 3 '   } , 
                         {   n u m b e r :   8 ,   n a m e :   ' A l - A n f a l ' ,   a r a b i c :   ' 'D#FA'D' ,   v e r s e s :   7 5 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 0 8 . m p 3 '   } , 
                         {   n u m b e r :   9 ,   n a m e :   ' A t - T a w b a h ' ,   a r a b i c :   ' 'D*H()' ,   v e r s e s :   1 2 9 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 0 9 . m p 3 '   } , 
                         {   n u m b e r :   1 0 ,   n a m e :   ' Y u n u s ' ,   a r a b i c :   ' JHF3' ,   v e r s e s :   1 0 9 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 1 0 . m p 3 '   } , 
                         {   n u m b e r :   1 1 ,   n a m e :   ' H u d ' ,   a r a b i c :   ' GH/' ,   v e r s e s :   1 2 3 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 1 1 . m p 3 '   } , 
                         {   n u m b e r :   1 2 ,   n a m e :   ' Y u s u f ' ,   a r a b i c :   ' JH3A' ,   v e r s e s :   1 1 1 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 1 2 . m p 3 '   } 
                 ] , 
                 r e c i t e r s :   [ 
                         {   n a m e :   ' M i s h a r y   R a s h i d   A l a f a s y ' ,   s t y l e :   ' m i s h a a r i _ r a a l i f a a s e e '   } , 
                         {   n a m e :   ' A b d u l   B a s i t ' ,   s t y l e :   ' a b d u l _ b a s i t '   } , 
                         {   n a m e :   ' S a a d   A l - G h a m d i ' ,   s t y l e :   ' s a a d _ a l _ g h a m d i '   } , 
                         {   n a m e :   ' M a h e r   A l - M u a i q l y ' ,   s t y l e :   ' m a h e r _ a l _ m u a i q l y '   } 
                 ] , 
                 d u a s :   [ 
                         {   
                                 a r a b i c :   ' 1N(NQFN'  "*PFN'  APJ  'D/OQFRJN'  -N3NFN)K  HNAPJ  'DR".P1N)P  -N3NFN)K  HNBPFN'  9N0N'(N  'DFNQ'1P' , 
                                 t r a n s l a t i o n :   ' O u r   L o r d ,   g i v e   u s   i n   t h i s   w o r l d   g o o d   a n d   i n   t h e   H e r e a f t e r   g o o d   a n d   p r o t e c t   u s   f r o m   t h e   p u n i s h m e n t   o f   t h e   F i r e ' , 
                                 r e f e r e n c e :   ' Q u r \ ' a n   2 : 2 0 1 ' 
                         } , 
                         {   
                                 a r a b i c :   ' 1N(PQ  '4R1N-R  DPJ  5N/R1PJ  HNJN3PQ1R  DPJ  #NER1PJ' , 
                                 t r a n s l a t i o n :   ' M y   L o r d ,   e x p a n d   f o r   m e   m y   b r e a s t   a n d   e a s e   f o r   m e   m y   t a s k ' , 
                                 r e f e r e n c e :   ' Q u r \ ' a n   2 0 : 2 5 - 2 6 ' 
                         } , 
                         {   
                                 a r a b i c :   ' 1N(PQ  2P/RFPJ  9PDREK'' , 
                                 t r a n s l a t i o n :   ' M y   L o r d ,   i n c r e a s e   m e   i n   k n o w l e d g e ' , 
                                 r e f e r e n c e :   ' Q u r \ ' a n   2 0 : 1 1 4 ' 
                         } , 
                         {   
                                 a r a b i c :   ' -N3R(OFN'  'DDNQGO  HNFP9REN  'DRHNCPJDO' , 
                                 t r a n s l a t i o n :   ' S u f f i c i e n t   f o r   u s   i s   A l l a h ,   a n d   H e   i s   t h e   b e s t   D i s p o s e r   o f   a f f a i r s ' , 
                                 r e f e r e n c e :   ' Q u r \ ' a n   3 : 1 7 3 ' 
                         } , 
                         {   
                                 a r a b i c :   ' 1N(NQFN'  *NBN(NQDR  EPFNQ'  %PFNQCN  #NFR*N  'D3NQEPJ9O  'DR9NDPJEO' , 
                                 t r a n s l a t i o n :   ' O u r   L o r d ,   a c c e p t   f r o m   u s .   I n d e e d   Y o u   a r e   t h e   H e a r i n g ,   t h e   K n o w i n g ' , 
                                 r e f e r e n c e :   ' Q u r \ ' a n   2 : 1 2 7 ' 
                         } , 
                         {   
                                 a r a b i c :   ' 1N(NQFN'  ':RAP1R  DPJ  HNDPHN'DP/NJNQ  HNDPDREO$REPFPJFN  JNHREN  JNBOHEO  'DR-P3N'(O' , 
                                 t r a n s l a t i o n :   ' O u r   L o r d ,   f o r g i v e   m e   a n d   m y   p a r e n t s   a n d   t h e   b e l i e v e r s   t h e   D a y   t h e   a c c o u n t   i s   e s t a b l i s h e d ' , 
                                 r e f e r e n c e :   ' Q u r \ ' a n   1 4 : 4 1 ' 
                         } 
                 ] 
         } ; 
 
         a u d i o P l a y e r   =   n u l l ; 
 
         a s y n c   s h o w A u d i o R e c i t a t i o n s ( )   { 
                 / /   C r e a t e   a u d i o   m o d a l 
                 c o n s t   m o d a l   =   d o c u m e n t . c r e a t e E l e m e n t ( ' d i v ' ) ; 
                 m o d a l . c l a s s N a m e   =   ' m o d a l - o v e r l a y   a c t i v e ' ; 
                 m o d a l . i d   =   ' a u d i o M o d a l ' ; 
                 m o d a l . i n n e r H T M L   =   ` 
                         < d i v   c l a s s = " m o d a l "   s t y l e = " m a x - w i d t h :   1 0 0 0 p x ; " > 
                                 < d i v   c l a s s = " m o d a l - h e a d e r " > 
                                         < d i v   c l a s s = " m o d a l - t i t l e " > 
                                                 < i   c l a s s = " f a s   f a - q u r a n " > < / i > 
                                                 < s p a n > Q u r ' a n   A u d i o   R e c i t a t i o n s < / s p a n > 
                                         < / d i v > 
                                         < b u t t o n   c l a s s = " m o d a l - c l o s e "   o n c l i c k = " a p p . c l o s e A u d i o M o d a l ( ) " > & t i m e s ; < / b u t t o n > 
                                 < / d i v > 
                                 < d i v   c l a s s = " m o d a l - b o d y " > 
                                         < d i v   c l a s s = " a u d i o - s e c t i o n " > 
                                                 < d i v   c l a s s = " a u d i o - p l a y e r "   i d = " a u d i o P l a y e r " > 
                                                         < d i v   c l a s s = " a u d i o - t i t l e " > 
                                                                 < i   c l a s s = " f a s   f a - m u s i c " > < / i > 
                                                                 < s p a n   i d = " c u r r e n t S u r a h N a m e " > S e l e c t   a   S u r a h < / s p a n > 
                                                         < / d i v > 
                                                         
                                                         < d i v   c l a s s = " r e c i t e r s - l i s t "   i d = " r e c i t e r s L i s t " > 
                                                                 $ { t h i s . r e n d e r R e c i t e r s ( ) } 
                                                         < / d i v > 
                                                         
                                                         < d i v   c l a s s = " a u d i o - c o n t r o l s " > 
                                                                 < b u t t o n   c l a s s = " a u d i o - p l a y - b t n "   i d = " p l a y P a u s e B t n "   o n c l i c k = " a p p . t o g g l e P l a y ( ) " > 
                                                                         < i   c l a s s = " f a s   f a - p l a y " > < / i > 
                                                                 < / b u t t o n > 
                                                                 
                                                                 < d i v   c l a s s = " a u d i o - p r o g r e s s "   i d = " p r o g r e s s B a r "   o n c l i c k = " a p p . s e e k A u d i o ( e v e n t ) " > 
                                                                         < d i v   c l a s s = " a u d i o - p r o g r e s s - b a r "   i d = " p r o g r e s s F i l l "   s t y l e = " w i d t h :   0 % " > < / d i v > 
                                                                 < / d i v > 
                                                                 
                                                                 < d i v   c l a s s = " a u d i o - t i m e " > 
                                                                         < s p a n   i d = " c u r r e n t T i m e " > 0 0 : 0 0 < / s p a n >   /   < s p a n   i d = " d u r a t i o n " > 0 0 : 0 0 < / s p a n > 
                                                                 < / d i v > 
                                                                 
                                                                 < d i v   c l a s s = " a u d i o - v o l u m e " > 
                                                                         < i   c l a s s = " f a s   f a - v o l u m e - u p "   o n c l i c k = " a p p . t o g g l e M u t e ( ) " > < / i > 
                                                                         < d i v   c l a s s = " v o l u m e - s l i d e r "   o n c l i c k = " a p p . s e t V o l u m e ( e v e n t ) " > 
                                                                                 < d i v   c l a s s = " v o l u m e - b a r "   i d = " v o l u m e B a r "   s t y l e = " w i d t h :   1 0 0 % " > < / d i v > 
                                                                         < / d i v > 
                                                                 < / d i v > 
                                                         < / d i v > 
                                                 < / d i v > 
                                                 
                                                 < d i v   c l a s s = " a u d i o - t a b s "   s t y l e = " d i s p l a y :   f l e x ;   g a p :   1 0 p x ;   m a r g i n - b o t t o m :   2 0 p x ; " > 
                                                         < b u t t o n   c l a s s = " t a b - b t n   a c t i v e "   o n c l i c k = " a p p . s h o w S u r a h s ( ) " > S u r a h s < / b u t t o n > 
                                                         < b u t t o n   c l a s s = " t a b - b t n "   o n c l i c k = " a p p . s h o w D u a s ( ) " > D u a s < / b u t t o n > 
                                                 < / d i v > 
                                                 
                                                 < d i v   i d = " a u d i o C o n t e n t " > 
                                                         $ { t h i s . r e n d e r S u r a h s ( ) } 
                                                 < / d i v > 
                                         < / d i v > 
                                 < / d i v > 
                         < / d i v > 
                 ` ; 
                 
                 d o c u m e n t . b o d y . a p p e n d C h i l d ( m o d a l ) ; 
                 t h i s . i n i t A u d i o P l a y e r ( ) ; 
         } 
 
         r e n d e r R e c i t e r s ( )   { 
                 r e t u r n   t h i s . a u d i o D a t a . r e c i t e r s . m a p ( r e c i t e r   = >   ` 
                         < b u t t o n   c l a s s = " r e c i t e r - b t n   $ { r e c i t e r . n a m e   = = =   t h i s . a u d i o D a t a . c u r r e n t R e c i t e r   ?   ' a c t i v e '   :   ' ' } "   
                                         o n c l i c k = " a p p . c h a n g e R e c i t e r ( ' $ { r e c i t e r . n a m e } ' ) " > 
                                 $ { r e c i t e r . n a m e } 
                         < / b u t t o n > 
                 ` ) . j o i n ( ' ' ) ; 
         } 
 
         r e n d e r S u r a h s ( )   { 
                 r e t u r n   ` 
                         < d i v   c l a s s = " a u d i o - s u r a h s " > 
                                 $ { t h i s . a u d i o D a t a . s u r a h s . m a p ( s u r a h   = >   ` 
                                         < d i v   c l a s s = " s u r a h - c a r d   $ { s u r a h . n u m b e r   = = =   t h i s . a u d i o D a t a . c u r r e n t S u r a h   ?   ' a c t i v e '   :   ' ' } "   
                                                   o n c l i c k = " a p p . p l a y S u r a h ( $ { s u r a h . n u m b e r } ) " > 
                                                 < d i v   c l a s s = " s u r a h - n u m b e r " > $ { s u r a h . n u m b e r } < / d i v > 
                                                 < d i v   c l a s s = " s u r a h - i n f o " > 
                                                         < h 4 > $ { s u r a h . n a m e } < / h 4 > 
                                                         < p > $ { s u r a h . a r a b i c }   "   $ { s u r a h . v e r s e s }   v e r s e s < / p > 
                                                 < / d i v > 
                                         < / d i v > 
                                 ` ) . j o i n ( ' ' ) } 
                         < / d i v > 
                 ` ; 
         } 
 
         r e n d e r D u a s ( )   { 
                 r e t u r n   ` 
                         < d i v   c l a s s = " d u a s - g r i d " > 
                                 $ { t h i s . a u d i o D a t a . d u a s . m a p ( d u a   = >   ` 
                                         < d i v   c l a s s = " d u a - c a r d "   o n c l i c k = " a p p . r e a d D u a ( ' $ { d u a . a r a b i c } ' ) " > 
                                                 < d i v   c l a s s = " d u a - a r a b i c " > $ { d u a . a r a b i c } < / d i v > 
                                                 < d i v   c l a s s = " d u a - t r a n s l a t i o n " > $ { d u a . t r a n s l a t i o n } < / d i v > 
                                                 < d i v   c l a s s = " d u a - r e f e r e n c e " > 
                                                         < i   c l a s s = " f a s   f a - b o o k " > < / i >   $ { d u a . r e f e r e n c e } 
                                                 < / d i v > 
                                         < / d i v > 
                                 ` ) . j o i n ( ' ' ) } 
                         < / d i v > 
                 ` ; 
         } 
 
         s h o w S u r a h s ( )   { 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' a u d i o C o n t e n t ' ) . i n n e r H T M L   =   t h i s . r e n d e r S u r a h s ( ) ; 
                 d o c u m e n t . q u e r y S e l e c t o r A l l ( ' . a u d i o - t a b s   . t a b - b t n ' ) . f o r E a c h ( ( b t n ,   i n d e x )   = >   { 
                         b t n . c l a s s L i s t . t o g g l e ( ' a c t i v e ' ,   i n d e x   = = =   0 ) ; 
                 } ) ; 
         } 
 
         s h o w D u a s ( )   { 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' a u d i o C o n t e n t ' ) . i n n e r H T M L   =   t h i s . r e n d e r D u a s ( ) ; 
                 d o c u m e n t . q u e r y S e l e c t o r A l l ( ' . a u d i o - t a b s   . t a b - b t n ' ) . f o r E a c h ( ( b t n ,   i n d e x )   = >   { 
                         b t n . c l a s s L i s t . t o g g l e ( ' a c t i v e ' ,   i n d e x   = = =   1 ) ; 
                 } ) ; 
         } 
 
         i n i t A u d i o P l a y e r ( )   { 
                 t h i s . a u d i o P l a y e r   =   n e w   A u d i o ( ) ; 
                 t h i s . a u d i o P l a y e r . v o l u m e   =   t h i s . a u d i o D a t a . v o l u m e ; 
                 
                 t h i s . a u d i o P l a y e r . a d d E v e n t L i s t e n e r ( ' t i m e u p d a t e ' ,   ( )   = >   t h i s . u p d a t e P r o g r e s s ( ) ) ; 
                 t h i s . a u d i o P l a y e r . a d d E v e n t L i s t e n e r ( ' l o a d e d m e t a d a t a ' ,   ( )   = >   t h i s . u p d a t e D u r a t i o n ( ) ) ; 
                 t h i s . a u d i o P l a y e r . a d d E v e n t L i s t e n e r ( ' e n d e d ' ,   ( )   = >   t h i s . o n A u d i o E n d e d ( ) ) ; 
         } 
 
         p l a y S u r a h ( s u r a h N u m b e r )   { 
                 c o n s t   s u r a h   =   t h i s . a u d i o D a t a . s u r a h s . f i n d ( s   = >   s . n u m b e r   = = =   s u r a h N u m b e r ) ; 
                 i f   ( ! s u r a h )   r e t u r n ; 
                 
                 t h i s . a u d i o D a t a . c u r r e n t S u r a h   =   s u r a h N u m b e r ; 
                 t h i s . a u d i o P l a y e r . s r c   =   s u r a h . a u d i o ; 
                 t h i s . a u d i o P l a y e r . p l a y ( ) ; 
                 t h i s . a u d i o D a t a . i s P l a y i n g   =   t r u e ; 
                 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' c u r r e n t S u r a h N a m e ' ) . t e x t C o n t e n t   =   ` $ { s u r a h . n u m b e r } .   $ { s u r a h . n a m e }   ( $ { s u r a h . a r a b i c } ) ` ; 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' p l a y P a u s e B t n ' ) . i n n e r H T M L   =   ' < i   c l a s s = " f a s   f a - p a u s e " > < / i > ' ; 
                 
                 / /   U p d a t e   a c t i v e   s u r a h   c a r d 
                 d o c u m e n t . q u e r y S e l e c t o r A l l ( ' . s u r a h - c a r d ' ) . f o r E a c h ( c a r d   = >   { 
                         c a r d . c l a s s L i s t . r e m o v e ( ' a c t i v e ' ) ; 
                 } ) ; 
                 e v e n t . c u r r e n t T a r g e t . c l a s s L i s t . a d d ( ' a c t i v e ' ) ; 
                 
                 / /   T r a c k   p r o g r e s s   f o r   a c h i e v e m e n t s 
                 t h i s . u p d a t e P r o g r e s s ( { 
                         t y p e :   ' a u d i o ' , 
                         s u r a h :   s u r a h N u m b e r , 
                         a c t i o n :   ' p l a y ' 
                 } ) ; 
         } 
 
         t o g g l e P l a y ( )   { 
                 i f   ( ! t h i s . a u d i o P l a y e r . s r c )   { 
                         a l e r t ( ' P l e a s e   s e l e c t   a   s u r a h   f i r s t ' ) ; 
                         r e t u r n ; 
                 } 
                 
                 i f   ( t h i s . a u d i o D a t a . i s P l a y i n g )   { 
                         t h i s . a u d i o P l a y e r . p a u s e ( ) ; 
                         d o c u m e n t . g e t E l e m e n t B y I d ( ' p l a y P a u s e B t n ' ) . i n n e r H T M L   =   ' < i   c l a s s = " f a s   f a - p l a y " > < / i > ' ; 
                 }   e l s e   { 
                         t h i s . a u d i o P l a y e r . p l a y ( ) ; 
                         d o c u m e n t . g e t E l e m e n t B y I d ( ' p l a y P a u s e B t n ' ) . i n n e r H T M L   =   ' < i   c l a s s = " f a s   f a - p a u s e " > < / i > ' ; 
                 } 
                 
                 t h i s . a u d i o D a t a . i s P l a y i n g   =   ! t h i s . a u d i o D a t a . i s P l a y i n g ; 
         } 
 
         u p d a t e P r o g r e s s ( )   { 
                 c o n s t   c u r r e n t T i m e   =   t h i s . a u d i o P l a y e r . c u r r e n t T i m e ; 
                 c o n s t   d u r a t i o n   =   t h i s . a u d i o P l a y e r . d u r a t i o n ; 
                 
                 i f   ( d u r a t i o n )   { 
                         c o n s t   p r o g r e s s   =   ( c u r r e n t T i m e   /   d u r a t i o n )   *   1 0 0 ; 
                         d o c u m e n t . g e t E l e m e n t B y I d ( ' p r o g r e s s F i l l ' ) . s t y l e . w i d t h   =   p r o g r e s s   +   ' % ' ; 
                         d o c u m e n t . g e t E l e m e n t B y I d ( ' c u r r e n t T i m e ' ) . t e x t C o n t e n t   =   t h i s . f o r m a t T i m e ( c u r r e n t T i m e ) ; 
                 } 
         } 
 
         u p d a t e D u r a t i o n ( )   { 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' d u r a t i o n ' ) . t e x t C o n t e n t   =   t h i s . f o r m a t T i m e ( t h i s . a u d i o P l a y e r . d u r a t i o n ) ; 
         } 
 
         f o r m a t T i m e ( s e c o n d s )   { 
                 c o n s t   m i n s   =   M a t h . f l o o r ( s e c o n d s   /   6 0 ) ; 
                 c o n s t   s e c s   =   M a t h . f l o o r ( s e c o n d s   %   6 0 ) ; 
                 r e t u r n   ` $ { m i n s . t o S t r i n g ( ) . p a d S t a r t ( 2 ,   ' 0 ' ) } : $ { s e c s . t o S t r i n g ( ) . p a d S t a r t ( 2 ,   ' 0 ' ) } ` ; 
         } 
 
         s e e k A u d i o ( e v e n t )   { 
                 c o n s t   p r o g r e s s B a r   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' p r o g r e s s B a r ' ) ; 
                 c o n s t   r e c t   =   p r o g r e s s B a r . g e t B o u n d i n g C l i e n t R e c t ( ) ; 
                 c o n s t   p o s   =   ( e v e n t . c l i e n t X   -   r e c t . l e f t )   /   r e c t . w i d t h ; 
                 t h i s . a u d i o P l a y e r . c u r r e n t T i m e   =   p o s   *   t h i s . a u d i o P l a y e r . d u r a t i o n ; 
         } 
 
         s e t V o l u m e ( e v e n t )   { 
                 c o n s t   v o l u m e B a r   =   e v e n t . c u r r e n t T a r g e t ; 
                 c o n s t   r e c t   =   v o l u m e B a r . g e t B o u n d i n g C l i e n t R e c t ( ) ; 
                 c o n s t   p o s   =   ( e v e n t . c l i e n t X   -   r e c t . l e f t )   /   r e c t . w i d t h ; 
                 t h i s . a u d i o P l a y e r . v o l u m e   =   p o s ; 
                 t h i s . a u d i o D a t a . v o l u m e   =   p o s ; 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' v o l u m e B a r ' ) . s t y l e . w i d t h   =   ( p o s   *   1 0 0 )   +   ' % ' ; 
         } 
 
         t o g g l e M u t e ( )   { 
                 t h i s . a u d i o P l a y e r . m u t e d   =   ! t h i s . a u d i o P l a y e r . m u t e d ; 
                 c o n s t   v o l u m e I c o n   =   d o c u m e n t . q u e r y S e l e c t o r ( ' . a u d i o - v o l u m e   i ' ) ; 
                 v o l u m e I c o n . c l a s s N a m e   =   t h i s . a u d i o P l a y e r . m u t e d   ?   ' f a s   f a - v o l u m e - m u t e '   :   ' f a s   f a - v o l u m e - u p ' ; 
         } 
 
         c h a n g e R e c i t e r ( r e c i t e r N a m e )   { 
                 t h i s . a u d i o D a t a . c u r r e n t R e c i t e r   =   r e c i t e r N a m e ; 
                 
                 / /   U p d a t e   r e c i t e r   b u t t o n s 
                 d o c u m e n t . q u e r y S e l e c t o r A l l ( ' . r e c i t e r - b t n ' ) . f o r E a c h ( b t n   = >   { 
                         b t n . c l a s s L i s t . t o g g l e ( ' a c t i v e ' ,   b t n . t e x t C o n t e n t   = = =   r e c i t e r N a m e ) ; 
                 } ) ; 
                 
                 / /   U p d a t e   a u d i o   U R L s   b a s e d   o n   r e c i t e r 
                 c o n s t   r e c i t e r   =   t h i s . a u d i o D a t a . r e c i t e r s . f i n d ( r   = >   r . n a m e   = = =   r e c i t e r N a m e ) ; 
                 i f   ( r e c i t e r )   { 
                         t h i s . a u d i o D a t a . s u r a h s . f o r E a c h ( s u r a h   = >   { 
                                 s u r a h . a u d i o   =   s u r a h . a u d i o . r e p l a c e ( / m i s h a a r i _ r a a l i f a a s e e | a b d u l _ b a s i t | s a a d _ a l _ g h a m d i | m a h e r _ a l _ m u a i q l y / g ,   r e c i t e r . s t y l e ) ; 
                         } ) ; 
                         
                         / /   I f   a   s u r a h   i s   c u r r e n t l y   p l a y i n g ,   r e s t a r t   i t   w i t h   n e w   r e c i t e r 
                         i f   ( t h i s . a u d i o D a t a . c u r r e n t S u r a h )   { 
                                 t h i s . p l a y S u r a h ( t h i s . a u d i o D a t a . c u r r e n t S u r a h ) ; 
                         } 
                 } 
         } 
 
         r e a d D u a ( a r a b i c )   { 
                 / /   C r e a t e   a   p o p u p   w i t h   d u a   d e t a i l s 
                 c o n s t   d u a   =   t h i s . a u d i o D a t a . d u a s . f i n d ( d   = >   d . a r a b i c   = = =   a r a b i c ) ; 
                 i f   ( d u a )   { 
                         a l e r t ( ` D u a :   $ { d u a . a r a b i c } \ n \ n T r a n s l a t i o n :   $ { d u a . t r a n s l a t i o n } \ n \ n R e f e r e n c e :   $ { d u a . r e f e r e n c e } ` ) ; 
                 } 
         } 
 
         o n A u d i o E n d e d ( )   { 
                 t h i s . a u d i o D a t a . i s P l a y i n g   =   f a l s e ; 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' p l a y P a u s e B t n ' ) . i n n e r H T M L   =   ' < i   c l a s s = " f a s   f a - p l a y " > < / i > ' ; 
                 
                 / /   A u t o - p l a y   n e x t   s u r a h 
                 i f   ( t h i s . a u d i o D a t a . c u r r e n t S u r a h   & &   t h i s . a u d i o D a t a . c u r r e n t S u r a h   <   1 1 4 )   { 
                         t h i s . p l a y S u r a h ( t h i s . a u d i o D a t a . c u r r e n t S u r a h   +   1 ) ; 
                 } 
         } 
 
         c l o s e A u d i o M o d a l ( )   { 
                 i f   ( t h i s . a u d i o P l a y e r )   { 
                         t h i s . a u d i o P l a y e r . p a u s e ( ) ; 
                         t h i s . a u d i o D a t a . i s P l a y i n g   =   f a l s e ; 
                 } 
                 c o n s t   m o d a l   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' a u d i o M o d a l ' ) ; 
                 i f   ( m o d a l )   m o d a l . r e m o v e ( ) ; 
         } 
 
         / /   U p d a t e   r e n d e r T o o l s   t o   i n c l u d e   A u d i o   R e c i t a t i o n s 
         r e n d e r T o o l s ( )   { 
                 c o n s t   t o o l s   =   [ 
                         {   n a m e :   ' Q u r \ ' a n ' ,   i c o n :   ' f a - q u r a n ' ,   c o l o r :   ' # 0 c 3 b 2 e ' ,   a c t i o n :   ' a p p . s h o w A u d i o R e c i t a t i o n s ( ) '   } , 
                         {   n a m e :   ' H a d i t h ' ,   i c o n :   ' f a - b o o k ' ,   c o l o r :   ' # 1 a 5 c 4 8 ' ,   a c t i o n :   ' w i n d o w . o p e n ( " h t t p s : / / s u n n a h . c o m " ,   " _ b l a n k " ) '   } , 
                         {   n a m e :   ' D u a s ' ,   i c o n :   ' f a - p r a y i n g - h a n d s ' ,   c o l o r :   ' # d 4 a f 3 7 ' ,   a c t i o n :   ' a p p . s h o w A u d i o R e c i t a t i o n s ( ) '   } , 
                         {   n a m e :   ' P r a y e r   T i m e s ' ,   i c o n :   ' f a - c l o c k ' ,   c o l o r :   ' # b 8 8 6 0 b ' ,   a c t i o n :   ' a p p . s h o w P r a y e r T i m e s ( ) '   } , 
                         {   n a m e :   ' T a s b i h ' ,   i c o n :   ' f a - p r a y ' ,   c o l o r :   ' # 8 b 4 5 1 3 ' ,   a c t i o n :   ' a p p . s h o w T a s b i h ( ) '   } 
                 ] ; 
                 
                 r e t u r n   t o o l s . m a p ( t o o l   = >   ` 
                         < d i v   c l a s s = " t o o l - c a r d "   s t y l e = " b a c k g r o u n d :   $ { t o o l . c o l o r } 2 0 ;   b o r d e r - c o l o r :   $ { t o o l . c o l o r } "   o n c l i c k = " $ { t o o l . a c t i o n } " > 
                                 < i   c l a s s = " f a s   $ { t o o l . i c o n }   t o o l - i c o n "   s t y l e = " c o l o r :   $ { t o o l . c o l o r } " > < / i > 
                                 < s p a n > $ { t o o l . n a m e } < / s p a n > 
                         < / d i v > 
                 ` ) . j o i n ( ' ' ) ; 
         }  
 
         / /   = = = = = = = = = =   A U D I O   R E C I T A T I O N   S Y S T E M   = = = = = = = = = = 
         a u d i o D a t a   =   { 
                 c u r r e n t S u r a h :   n u l l , 
                 c u r r e n t R e c i t e r :   ' M i s h a r y   R a s h i d   A l a f a s y ' , 
                 i s P l a y i n g :   f a l s e , 
                 c u r r e n t T i m e :   0 , 
                 d u r a t i o n :   0 , 
                 v o l u m e :   1 , 
                 s u r a h s :   [ 
                         {   n u m b e r :   1 ,   n a m e :   ' A l - F a t i h a h ' ,   a r a b i c :   ' 'DA'*-)' ,   v e r s e s :   7 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 0 1 . m p 3 '   } , 
                         {   n u m b e r :   2 ,   n a m e :   ' A l - B a q a r a h ' ,   a r a b i c :   ' 'D(B1)' ,   v e r s e s :   2 8 6 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 0 2 . m p 3 '   } , 
                         {   n u m b e r :   3 ,   n a m e :   ' A a l - E - I m r a n ' ,   a r a b i c :   ' "D  9E1'F' ,   v e r s e s :   2 0 0 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 0 3 . m p 3 '   } , 
                         {   n u m b e r :   4 ,   n a m e :   ' A n - N i s a ' ,   a r a b i c :   ' 'DF3'!' ,   v e r s e s :   1 7 6 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 0 4 . m p 3 '   } , 
                         {   n u m b e r :   5 ,   n a m e :   ' A l - M a \ ' i d a h ' ,   a r a b i c :   ' 'DE'&/)' ,   v e r s e s :   1 2 0 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 0 5 . m p 3 '   } , 
                         {   n u m b e r :   6 ,   n a m e :   ' A l - A n \ ' a m ' ,   a r a b i c :   ' 'D#F9'E' ,   v e r s e s :   1 6 5 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 0 6 . m p 3 '   } , 
                         {   n u m b e r :   7 ,   n a m e :   ' A l - A \ ' r a f ' ,   a r a b i c :   ' 'D#91'A' ,   v e r s e s :   2 0 6 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 0 7 . m p 3 '   } , 
                         {   n u m b e r :   8 ,   n a m e :   ' A l - A n f a l ' ,   a r a b i c :   ' 'D#FA'D' ,   v e r s e s :   7 5 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 0 8 . m p 3 '   } , 
                         {   n u m b e r :   9 ,   n a m e :   ' A t - T a w b a h ' ,   a r a b i c :   ' 'D*H()' ,   v e r s e s :   1 2 9 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 0 9 . m p 3 '   } , 
                         {   n u m b e r :   1 0 ,   n a m e :   ' Y u n u s ' ,   a r a b i c :   ' JHF3' ,   v e r s e s :   1 0 9 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 1 0 . m p 3 '   } , 
                         {   n u m b e r :   1 1 ,   n a m e :   ' H u d ' ,   a r a b i c :   ' GH/' ,   v e r s e s :   1 2 3 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 1 1 . m p 3 '   } , 
                         {   n u m b e r :   1 2 ,   n a m e :   ' Y u s u f ' ,   a r a b i c :   ' JH3A' ,   v e r s e s :   1 1 1 ,   a u d i o :   ' h t t p s : / / d o w n l o a d . q u r a n i c a u d i o . c o m / q u r a n / m i s h a a r i _ r a a l i f a a s e e / 0 1 2 . m p 3 '   } 
                 ] , 
                 r e c i t e r s :   [ 
                         {   n a m e :   ' M i s h a r y   R a s h i d   A l a f a s y ' ,   s t y l e :   ' m i s h a a r i _ r a a l i f a a s e e '   } , 
                         {   n a m e :   ' A b d u l   B a s i t ' ,   s t y l e :   ' a b d u l _ b a s i t '   } , 
                         {   n a m e :   ' S a a d   A l - G h a m d i ' ,   s t y l e :   ' s a a d _ a l _ g h a m d i '   } , 
                         {   n a m e :   ' M a h e r   A l - M u a i q l y ' ,   s t y l e :   ' m a h e r _ a l _ m u a i q l y '   } 
                 ] , 
                 d u a s :   [ 
                         {   
                                 a r a b i c :   ' 1N(NQFN'  "*PFN'  APJ  'D/OQFRJN'  -N3NFN)K  HNAPJ  'DR".P1N)P  -N3NFN)K  HNBPFN'  9N0N'(N  'DFNQ'1P' , 
                                 t r a n s l a t i o n :   ' O u r   L o r d ,   g i v e   u s   i n   t h i s   w o r l d   g o o d   a n d   i n   t h e   H e r e a f t e r   g o o d   a n d   p r o t e c t   u s   f r o m   t h e   p u n i s h m e n t   o f   t h e   F i r e ' , 
                                 r e f e r e n c e :   ' Q u r \ ' a n   2 : 2 0 1 ' 
                         } , 
                         {   
                                 a r a b i c :   ' 1N(PQ  '4R1N-R  DPJ  5N/R1PJ  HNJN3PQ1R  DPJ  #NER1PJ' , 
                                 t r a n s l a t i o n :   ' M y   L o r d ,   e x p a n d   f o r   m e   m y   b r e a s t   a n d   e a s e   f o r   m e   m y   t a s k ' , 
                                 r e f e r e n c e :   ' Q u r \ ' a n   2 0 : 2 5 - 2 6 ' 
                         } , 
                         {   
                                 a r a b i c :   ' 1N(PQ  2P/RFPJ  9PDREK'' , 
                                 t r a n s l a t i o n :   ' M y   L o r d ,   i n c r e a s e   m e   i n   k n o w l e d g e ' , 
                                 r e f e r e n c e :   ' Q u r \ ' a n   2 0 : 1 1 4 ' 
                         } , 
                         {   
                                 a r a b i c :   ' -N3R(OFN'  'DDNQGO  HNFP9REN  'DRHNCPJDO' , 
                                 t r a n s l a t i o n :   ' S u f f i c i e n t   f o r   u s   i s   A l l a h ,   a n d   H e   i s   t h e   b e s t   D i s p o s e r   o f   a f f a i r s ' , 
                                 r e f e r e n c e :   ' Q u r \ ' a n   3 : 1 7 3 ' 
                         } , 
                         {   
                                 a r a b i c :   ' 1N(NQFN'  *NBN(NQDR  EPFNQ'  %PFNQCN  #NFR*N  'D3NQEPJ9O  'DR9NDPJEO' , 
                                 t r a n s l a t i o n :   ' O u r   L o r d ,   a c c e p t   f r o m   u s .   I n d e e d   Y o u   a r e   t h e   H e a r i n g ,   t h e   K n o w i n g ' , 
                                 r e f e r e n c e :   ' Q u r \ ' a n   2 : 1 2 7 ' 
                         } , 
                         {   
                                 a r a b i c :   ' 1N(NQFN'  ':RAP1R  DPJ  HNDPHN'DP/NJNQ  HNDPDREO$REPFPJFN  JNHREN  JNBOHEO  'DR-P3N'(O' , 
                                 t r a n s l a t i o n :   ' O u r   L o r d ,   f o r g i v e   m e   a n d   m y   p a r e n t s   a n d   t h e   b e l i e v e r s   t h e   D a y   t h e   a c c o u n t   i s   e s t a b l i s h e d ' , 
                                 r e f e r e n c e :   ' Q u r \ ' a n   1 4 : 4 1 ' 
                         } 
                 ] 
         } ; 
 
         a u d i o P l a y e r   =   n u l l ; 
 
         a s y n c   s h o w A u d i o R e c i t a t i o n s ( )   { 
                 / /   C r e a t e   a u d i o   m o d a l 
                 c o n s t   m o d a l   =   d o c u m e n t . c r e a t e E l e m e n t ( ' d i v ' ) ; 
                 m o d a l . c l a s s N a m e   =   ' m o d a l - o v e r l a y   a c t i v e ' ; 
                 m o d a l . i d   =   ' a u d i o M o d a l ' ; 
                 m o d a l . i n n e r H T M L   =   ` 
                         < d i v   c l a s s = " m o d a l "   s t y l e = " m a x - w i d t h :   1 0 0 0 p x ; " > 
                                 < d i v   c l a s s = " m o d a l - h e a d e r " > 
                                         < d i v   c l a s s = " m o d a l - t i t l e " > 
                                                 < i   c l a s s = " f a s   f a - q u r a n " > < / i > 
                                                 < s p a n > Q u r ' a n   A u d i o   R e c i t a t i o n s < / s p a n > 
                                         < / d i v > 
                                         < b u t t o n   c l a s s = " m o d a l - c l o s e "   o n c l i c k = " a p p . c l o s e A u d i o M o d a l ( ) " > & t i m e s ; < / b u t t o n > 
                                 < / d i v > 
                                 < d i v   c l a s s = " m o d a l - b o d y " > 
                                         < d i v   c l a s s = " a u d i o - s e c t i o n " > 
                                                 < d i v   c l a s s = " a u d i o - p l a y e r "   i d = " a u d i o P l a y e r " > 
                                                         < d i v   c l a s s = " a u d i o - t i t l e " > 
                                                                 < i   c l a s s = " f a s   f a - m u s i c " > < / i > 
                                                                 < s p a n   i d = " c u r r e n t S u r a h N a m e " > S e l e c t   a   S u r a h < / s p a n > 
                                                         < / d i v > 
                                                         
                                                         < d i v   c l a s s = " r e c i t e r s - l i s t "   i d = " r e c i t e r s L i s t " > 
                                                                 $ { t h i s . r e n d e r R e c i t e r s ( ) } 
                                                         < / d i v > 
                                                         
                                                         < d i v   c l a s s = " a u d i o - c o n t r o l s " > 
                                                                 < b u t t o n   c l a s s = " a u d i o - p l a y - b t n "   i d = " p l a y P a u s e B t n "   o n c l i c k = " a p p . t o g g l e P l a y ( ) " > 
                                                                         < i   c l a s s = " f a s   f a - p l a y " > < / i > 
                                                                 < / b u t t o n > 
                                                                 
                                                                 < d i v   c l a s s = " a u d i o - p r o g r e s s "   i d = " p r o g r e s s B a r "   o n c l i c k = " a p p . s e e k A u d i o ( e v e n t ) " > 
                                                                         < d i v   c l a s s = " a u d i o - p r o g r e s s - b a r "   i d = " p r o g r e s s F i l l "   s t y l e = " w i d t h :   0 % " > < / d i v > 
                                                                 < / d i v > 
                                                                 
                                                                 < d i v   c l a s s = " a u d i o - t i m e " > 
                                                                         < s p a n   i d = " c u r r e n t T i m e " > 0 0 : 0 0 < / s p a n >   /   < s p a n   i d = " d u r a t i o n " > 0 0 : 0 0 < / s p a n > 
                                                                 < / d i v > 
                                                                 
                                                                 < d i v   c l a s s = " a u d i o - v o l u m e " > 
                                                                         < i   c l a s s = " f a s   f a - v o l u m e - u p "   o n c l i c k = " a p p . t o g g l e M u t e ( ) " > < / i > 
                                                                         < d i v   c l a s s = " v o l u m e - s l i d e r "   o n c l i c k = " a p p . s e t V o l u m e ( e v e n t ) " > 
                                                                                 < d i v   c l a s s = " v o l u m e - b a r "   i d = " v o l u m e B a r "   s t y l e = " w i d t h :   1 0 0 % " > < / d i v > 
                                                                         < / d i v > 
                                                                 < / d i v > 
                                                         < / d i v > 
                                                 < / d i v > 
                                                 
                                                 < d i v   c l a s s = " a u d i o - t a b s "   s t y l e = " d i s p l a y :   f l e x ;   g a p :   1 0 p x ;   m a r g i n - b o t t o m :   2 0 p x ; " > 
                                                         < b u t t o n   c l a s s = " t a b - b t n   a c t i v e "   o n c l i c k = " a p p . s h o w S u r a h s ( ) " > S u r a h s < / b u t t o n > 
                                                         < b u t t o n   c l a s s = " t a b - b t n "   o n c l i c k = " a p p . s h o w D u a s ( ) " > D u a s < / b u t t o n > 
                                                 < / d i v > 
                                                 
                                                 < d i v   i d = " a u d i o C o n t e n t " > 
                                                         $ { t h i s . r e n d e r S u r a h s ( ) } 
                                                 < / d i v > 
                                         < / d i v > 
                                 < / d i v > 
                         < / d i v > 
                 ` ; 
                 
                 d o c u m e n t . b o d y . a p p e n d C h i l d ( m o d a l ) ; 
                 t h i s . i n i t A u d i o P l a y e r ( ) ; 
         } 
 
         r e n d e r R e c i t e r s ( )   { 
                 r e t u r n   t h i s . a u d i o D a t a . r e c i t e r s . m a p ( r e c i t e r   = >   ` 
                         < b u t t o n   c l a s s = " r e c i t e r - b t n   $ { r e c i t e r . n a m e   = = =   t h i s . a u d i o D a t a . c u r r e n t R e c i t e r   ?   ' a c t i v e '   :   ' ' } "   
                                         o n c l i c k = " a p p . c h a n g e R e c i t e r ( ' $ { r e c i t e r . n a m e } ' ) " > 
                                 $ { r e c i t e r . n a m e } 
                         < / b u t t o n > 
                 ` ) . j o i n ( ' ' ) ; 
         } 
 
         r e n d e r S u r a h s ( )   { 
                 r e t u r n   ` 
                         < d i v   c l a s s = " a u d i o - s u r a h s " > 
                                 $ { t h i s . a u d i o D a t a . s u r a h s . m a p ( s u r a h   = >   ` 
                                         < d i v   c l a s s = " s u r a h - c a r d   $ { s u r a h . n u m b e r   = = =   t h i s . a u d i o D a t a . c u r r e n t S u r a h   ?   ' a c t i v e '   :   ' ' } "   
                                                   o n c l i c k = " a p p . p l a y S u r a h ( $ { s u r a h . n u m b e r } ) " > 
                                                 < d i v   c l a s s = " s u r a h - n u m b e r " > $ { s u r a h . n u m b e r } < / d i v > 
                                                 < d i v   c l a s s = " s u r a h - i n f o " > 
                                                         < h 4 > $ { s u r a h . n a m e } < / h 4 > 
                                                         < p > $ { s u r a h . a r a b i c }   "   $ { s u r a h . v e r s e s }   v e r s e s < / p > 
                                                 < / d i v > 
                                         < / d i v > 
                                 ` ) . j o i n ( ' ' ) } 
                         < / d i v > 
                 ` ; 
         } 
 
         r e n d e r D u a s ( )   { 
                 r e t u r n   ` 
                         < d i v   c l a s s = " d u a s - g r i d " > 
                                 $ { t h i s . a u d i o D a t a . d u a s . m a p ( d u a   = >   ` 
                                         < d i v   c l a s s = " d u a - c a r d "   o n c l i c k = " a p p . r e a d D u a ( ' $ { d u a . a r a b i c } ' ) " > 
                                                 < d i v   c l a s s = " d u a - a r a b i c " > $ { d u a . a r a b i c } < / d i v > 
                                                 < d i v   c l a s s = " d u a - t r a n s l a t i o n " > $ { d u a . t r a n s l a t i o n } < / d i v > 
                                                 < d i v   c l a s s = " d u a - r e f e r e n c e " > 
                                                         < i   c l a s s = " f a s   f a - b o o k " > < / i >   $ { d u a . r e f e r e n c e } 
                                                 < / d i v > 
                                         < / d i v > 
                                 ` ) . j o i n ( ' ' ) } 
                         < / d i v > 
                 ` ; 
         } 
 
         s h o w S u r a h s ( )   { 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' a u d i o C o n t e n t ' ) . i n n e r H T M L   =   t h i s . r e n d e r S u r a h s ( ) ; 
                 d o c u m e n t . q u e r y S e l e c t o r A l l ( ' . a u d i o - t a b s   . t a b - b t n ' ) . f o r E a c h ( ( b t n ,   i n d e x )   = >   { 
                         b t n . c l a s s L i s t . t o g g l e ( ' a c t i v e ' ,   i n d e x   = = =   0 ) ; 
                 } ) ; 
         } 
 
         s h o w D u a s ( )   { 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' a u d i o C o n t e n t ' ) . i n n e r H T M L   =   t h i s . r e n d e r D u a s ( ) ; 
                 d o c u m e n t . q u e r y S e l e c t o r A l l ( ' . a u d i o - t a b s   . t a b - b t n ' ) . f o r E a c h ( ( b t n ,   i n d e x )   = >   { 
                         b t n . c l a s s L i s t . t o g g l e ( ' a c t i v e ' ,   i n d e x   = = =   1 ) ; 
                 } ) ; 
         } 
 
         i n i t A u d i o P l a y e r ( )   { 
                 t h i s . a u d i o P l a y e r   =   n e w   A u d i o ( ) ; 
                 t h i s . a u d i o P l a y e r . v o l u m e   =   t h i s . a u d i o D a t a . v o l u m e ; 
                 
                 t h i s . a u d i o P l a y e r . a d d E v e n t L i s t e n e r ( ' t i m e u p d a t e ' ,   ( )   = >   t h i s . u p d a t e P r o g r e s s ( ) ) ; 
                 t h i s . a u d i o P l a y e r . a d d E v e n t L i s t e n e r ( ' l o a d e d m e t a d a t a ' ,   ( )   = >   t h i s . u p d a t e D u r a t i o n ( ) ) ; 
                 t h i s . a u d i o P l a y e r . a d d E v e n t L i s t e n e r ( ' e n d e d ' ,   ( )   = >   t h i s . o n A u d i o E n d e d ( ) ) ; 
         } 
 
         p l a y S u r a h ( s u r a h N u m b e r )   { 
                 c o n s t   s u r a h   =   t h i s . a u d i o D a t a . s u r a h s . f i n d ( s   = >   s . n u m b e r   = = =   s u r a h N u m b e r ) ; 
                 i f   ( ! s u r a h )   r e t u r n ; 
                 
                 t h i s . a u d i o D a t a . c u r r e n t S u r a h   =   s u r a h N u m b e r ; 
                 t h i s . a u d i o P l a y e r . s r c   =   s u r a h . a u d i o ; 
                 t h i s . a u d i o P l a y e r . p l a y ( ) ; 
                 t h i s . a u d i o D a t a . i s P l a y i n g   =   t r u e ; 
                 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' c u r r e n t S u r a h N a m e ' ) . t e x t C o n t e n t   =   ` $ { s u r a h . n u m b e r } .   $ { s u r a h . n a m e }   ( $ { s u r a h . a r a b i c } ) ` ; 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' p l a y P a u s e B t n ' ) . i n n e r H T M L   =   ' < i   c l a s s = " f a s   f a - p a u s e " > < / i > ' ; 
                 
                 / /   U p d a t e   a c t i v e   s u r a h   c a r d 
                 d o c u m e n t . q u e r y S e l e c t o r A l l ( ' . s u r a h - c a r d ' ) . f o r E a c h ( c a r d   = >   { 
                         c a r d . c l a s s L i s t . r e m o v e ( ' a c t i v e ' ) ; 
                 } ) ; 
                 e v e n t . c u r r e n t T a r g e t . c l a s s L i s t . a d d ( ' a c t i v e ' ) ; 
                 
                 / /   T r a c k   p r o g r e s s   f o r   a c h i e v e m e n t s 
                 t h i s . u p d a t e P r o g r e s s ( { 
                         t y p e :   ' a u d i o ' , 
                         s u r a h :   s u r a h N u m b e r , 
                         a c t i o n :   ' p l a y ' 
                 } ) ; 
         } 
 
         t o g g l e P l a y ( )   { 
                 i f   ( ! t h i s . a u d i o P l a y e r . s r c )   { 
                         a l e r t ( ' P l e a s e   s e l e c t   a   s u r a h   f i r s t ' ) ; 
                         r e t u r n ; 
                 } 
                 
                 i f   ( t h i s . a u d i o D a t a . i s P l a y i n g )   { 
                         t h i s . a u d i o P l a y e r . p a u s e ( ) ; 
                         d o c u m e n t . g e t E l e m e n t B y I d ( ' p l a y P a u s e B t n ' ) . i n n e r H T M L   =   ' < i   c l a s s = " f a s   f a - p l a y " > < / i > ' ; 
                 }   e l s e   { 
                         t h i s . a u d i o P l a y e r . p l a y ( ) ; 
                         d o c u m e n t . g e t E l e m e n t B y I d ( ' p l a y P a u s e B t n ' ) . i n n e r H T M L   =   ' < i   c l a s s = " f a s   f a - p a u s e " > < / i > ' ; 
                 } 
                 
                 t h i s . a u d i o D a t a . i s P l a y i n g   =   ! t h i s . a u d i o D a t a . i s P l a y i n g ; 
         } 
 
         u p d a t e P r o g r e s s ( )   { 
                 c o n s t   c u r r e n t T i m e   =   t h i s . a u d i o P l a y e r . c u r r e n t T i m e ; 
                 c o n s t   d u r a t i o n   =   t h i s . a u d i o P l a y e r . d u r a t i o n ; 
                 
                 i f   ( d u r a t i o n )   { 
                         c o n s t   p r o g r e s s   =   ( c u r r e n t T i m e   /   d u r a t i o n )   *   1 0 0 ; 
                         d o c u m e n t . g e t E l e m e n t B y I d ( ' p r o g r e s s F i l l ' ) . s t y l e . w i d t h   =   p r o g r e s s   +   ' % ' ; 
                         d o c u m e n t . g e t E l e m e n t B y I d ( ' c u r r e n t T i m e ' ) . t e x t C o n t e n t   =   t h i s . f o r m a t T i m e ( c u r r e n t T i m e ) ; 
                 } 
         } 
 
         u p d a t e D u r a t i o n ( )   { 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' d u r a t i o n ' ) . t e x t C o n t e n t   =   t h i s . f o r m a t T i m e ( t h i s . a u d i o P l a y e r . d u r a t i o n ) ; 
         } 
 
         f o r m a t T i m e ( s e c o n d s )   { 
                 c o n s t   m i n s   =   M a t h . f l o o r ( s e c o n d s   /   6 0 ) ; 
                 c o n s t   s e c s   =   M a t h . f l o o r ( s e c o n d s   %   6 0 ) ; 
                 r e t u r n   ` $ { m i n s . t o S t r i n g ( ) . p a d S t a r t ( 2 ,   ' 0 ' ) } : $ { s e c s . t o S t r i n g ( ) . p a d S t a r t ( 2 ,   ' 0 ' ) } ` ; 
         } 
 
         s e e k A u d i o ( e v e n t )   { 
                 c o n s t   p r o g r e s s B a r   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' p r o g r e s s B a r ' ) ; 
                 c o n s t   r e c t   =   p r o g r e s s B a r . g e t B o u n d i n g C l i e n t R e c t ( ) ; 
                 c o n s t   p o s   =   ( e v e n t . c l i e n t X   -   r e c t . l e f t )   /   r e c t . w i d t h ; 
                 t h i s . a u d i o P l a y e r . c u r r e n t T i m e   =   p o s   *   t h i s . a u d i o P l a y e r . d u r a t i o n ; 
         } 
 
         s e t V o l u m e ( e v e n t )   { 
                 c o n s t   v o l u m e B a r   =   e v e n t . c u r r e n t T a r g e t ; 
                 c o n s t   r e c t   =   v o l u m e B a r . g e t B o u n d i n g C l i e n t R e c t ( ) ; 
                 c o n s t   p o s   =   ( e v e n t . c l i e n t X   -   r e c t . l e f t )   /   r e c t . w i d t h ; 
                 t h i s . a u d i o P l a y e r . v o l u m e   =   p o s ; 
                 t h i s . a u d i o D a t a . v o l u m e   =   p o s ; 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' v o l u m e B a r ' ) . s t y l e . w i d t h   =   ( p o s   *   1 0 0 )   +   ' % ' ; 
         } 
 
         t o g g l e M u t e ( )   { 
                 t h i s . a u d i o P l a y e r . m u t e d   =   ! t h i s . a u d i o P l a y e r . m u t e d ; 
                 c o n s t   v o l u m e I c o n   =   d o c u m e n t . q u e r y S e l e c t o r ( ' . a u d i o - v o l u m e   i ' ) ; 
                 v o l u m e I c o n . c l a s s N a m e   =   t h i s . a u d i o P l a y e r . m u t e d   ?   ' f a s   f a - v o l u m e - m u t e '   :   ' f a s   f a - v o l u m e - u p ' ; 
         } 
 
         c h a n g e R e c i t e r ( r e c i t e r N a m e )   { 
                 t h i s . a u d i o D a t a . c u r r e n t R e c i t e r   =   r e c i t e r N a m e ; 
                 
                 / /   U p d a t e   r e c i t e r   b u t t o n s 
                 d o c u m e n t . q u e r y S e l e c t o r A l l ( ' . r e c i t e r - b t n ' ) . f o r E a c h ( b t n   = >   { 
                         b t n . c l a s s L i s t . t o g g l e ( ' a c t i v e ' ,   b t n . t e x t C o n t e n t   = = =   r e c i t e r N a m e ) ; 
                 } ) ; 
                 
                 / /   U p d a t e   a u d i o   U R L s   b a s e d   o n   r e c i t e r 
                 c o n s t   r e c i t e r   =   t h i s . a u d i o D a t a . r e c i t e r s . f i n d ( r   = >   r . n a m e   = = =   r e c i t e r N a m e ) ; 
                 i f   ( r e c i t e r )   { 
                         t h i s . a u d i o D a t a . s u r a h s . f o r E a c h ( s u r a h   = >   { 
                                 s u r a h . a u d i o   =   s u r a h . a u d i o . r e p l a c e ( / m i s h a a r i _ r a a l i f a a s e e | a b d u l _ b a s i t | s a a d _ a l _ g h a m d i | m a h e r _ a l _ m u a i q l y / g ,   r e c i t e r . s t y l e ) ; 
                         } ) ; 
                         
                         / /   I f   a   s u r a h   i s   c u r r e n t l y   p l a y i n g ,   r e s t a r t   i t   w i t h   n e w   r e c i t e r 
                         i f   ( t h i s . a u d i o D a t a . c u r r e n t S u r a h )   { 
                                 t h i s . p l a y S u r a h ( t h i s . a u d i o D a t a . c u r r e n t S u r a h ) ; 
                         } 
                 } 
         } 
 
         r e a d D u a ( a r a b i c )   { 
                 / /   C r e a t e   a   p o p u p   w i t h   d u a   d e t a i l s 
                 c o n s t   d u a   =   t h i s . a u d i o D a t a . d u a s . f i n d ( d   = >   d . a r a b i c   = = =   a r a b i c ) ; 
                 i f   ( d u a )   { 
                         a l e r t ( ` D u a :   $ { d u a . a r a b i c } \ n \ n T r a n s l a t i o n :   $ { d u a . t r a n s l a t i o n } \ n \ n R e f e r e n c e :   $ { d u a . r e f e r e n c e } ` ) ; 
                 } 
         } 
 
         o n A u d i o E n d e d ( )   { 
                 t h i s . a u d i o D a t a . i s P l a y i n g   =   f a l s e ; 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' p l a y P a u s e B t n ' ) . i n n e r H T M L   =   ' < i   c l a s s = " f a s   f a - p l a y " > < / i > ' ; 
                 
                 / /   A u t o - p l a y   n e x t   s u r a h 
                 i f   ( t h i s . a u d i o D a t a . c u r r e n t S u r a h   & &   t h i s . a u d i o D a t a . c u r r e n t S u r a h   <   1 1 4 )   { 
                         t h i s . p l a y S u r a h ( t h i s . a u d i o D a t a . c u r r e n t S u r a h   +   1 ) ; 
                 } 
         } 
 
         c l o s e A u d i o M o d a l ( )   { 
                 i f   ( t h i s . a u d i o P l a y e r )   { 
                         t h i s . a u d i o P l a y e r . p a u s e ( ) ; 
                         t h i s . a u d i o D a t a . i s P l a y i n g   =   f a l s e ; 
                 } 
                 c o n s t   m o d a l   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' a u d i o M o d a l ' ) ; 
                 i f   ( m o d a l )   m o d a l . r e m o v e ( ) ; 
         } 
 
         / /   U p d a t e   r e n d e r T o o l s   t o   i n c l u d e   A u d i o   R e c i t a t i o n s 
         r e n d e r T o o l s ( )   { 
                 c o n s t   t o o l s   =   [ 
                         {   n a m e :   ' Q u r \ ' a n ' ,   i c o n :   ' f a - q u r a n ' ,   c o l o r :   ' # 0 c 3 b 2 e ' ,   a c t i o n :   ' a p p . s h o w A u d i o R e c i t a t i o n s ( ) '   } , 
                         {   n a m e :   ' H a d i t h ' ,   i c o n :   ' f a - b o o k ' ,   c o l o r :   ' # 1 a 5 c 4 8 ' ,   a c t i o n :   ' w i n d o w . o p e n ( " h t t p s : / / s u n n a h . c o m " ,   " _ b l a n k " ) '   } , 
                         {   n a m e :   ' D u a s ' ,   i c o n :   ' f a - p r a y i n g - h a n d s ' ,   c o l o r :   ' # d 4 a f 3 7 ' ,   a c t i o n :   ' a p p . s h o w A u d i o R e c i t a t i o n s ( ) '   } , 
                         {   n a m e :   ' P r a y e r   T i m e s ' ,   i c o n :   ' f a - c l o c k ' ,   c o l o r :   ' # b 8 8 6 0 b ' ,   a c t i o n :   ' a p p . s h o w P r a y e r T i m e s ( ) '   } , 
                         {   n a m e :   ' T a s b i h ' ,   i c o n :   ' f a - p r a y ' ,   c o l o r :   ' # 8 b 4 5 1 3 ' ,   a c t i o n :   ' a p p . s h o w T a s b i h ( ) '   } 
                 ] ; 
                 
                 r e t u r n   t o o l s . m a p ( t o o l   = >   ` 
                         < d i v   c l a s s = " t o o l - c a r d "   s t y l e = " b a c k g r o u n d :   $ { t o o l . c o l o r } 2 0 ;   b o r d e r - c o l o r :   $ { t o o l . c o l o r } "   o n c l i c k = " $ { t o o l . a c t i o n } " > 
                                 < i   c l a s s = " f a s   $ { t o o l . i c o n }   t o o l - i c o n "   s t y l e = " c o l o r :   $ { t o o l . c o l o r } " > < / i > 
                                 < s p a n > $ { t o o l . n a m e } < / s p a n > 
                         < / d i v > 
                 ` ) . j o i n ( ' ' ) ; 
         }  
 
         / /   = = = = = = = = = =   M O S Q U E   F I N D E R   S Y S T E M   = = = = = = = = = = 
         m a p   =   n u l l ; 
         m a r k e r s   =   [ ] ; 
         u s e r L o c a t i o n   =   n u l l ; 
         m o s q u e s   =   [ ] ; 
 
         a s y n c   s h o w M o s q u e F i n d e r ( )   { 
                 / /   C r e a t e   m o s q u e   f i n d e r   m o d a l 
                 c o n s t   m o d a l   =   d o c u m e n t . c r e a t e E l e m e n t ( ' d i v ' ) ; 
                 m o d a l . c l a s s N a m e   =   ' m o d a l - o v e r l a y   a c t i v e ' ; 
                 m o d a l . i d   =   ' m o s q u e M o d a l ' ; 
                 m o d a l . i n n e r H T M L   =   ` 
                         < d i v   c l a s s = " m o d a l "   s t y l e = " m a x - w i d t h :   1 2 0 0 p x ; " > 
                                 < d i v   c l a s s = " m o d a l - h e a d e r " > 
                                         < d i v   c l a s s = " m o d a l - t i t l e " > 
                                                 < i   c l a s s = " f a s   f a - m o s q u e " > < / i > 
                                                 < s p a n > M o s q u e   F i n d e r < / s p a n > 
                                         < / d i v > 
                                         < b u t t o n   c l a s s = " m o d a l - c l o s e "   o n c l i c k = " a p p . c l o s e M o s q u e M o d a l ( ) " > & t i m e s ; < / b u t t o n > 
                                 < / d i v > 
                                 < d i v   c l a s s = " m o d a l - b o d y " > 
                                         < d i v   c l a s s = " m o s q u e - s e c t i o n " > 
                                                 < d i v   c l a s s = " m o s q u e - h e a d e r " > 
                                                         < d i v   c l a s s = " m o s q u e - t i t l e " > 
                                                                 < i   c l a s s = " f a s   f a - l o c a t i o n - d o t " > < / i > 
                                                                 < s p a n > N e a r b y   M o s q u e s < / s p a n > 
                                                         < / d i v > 
                                                         < d i v   c l a s s = " m o s q u e - s e a r c h " > 
                                                                 < i n p u t   t y p e = " t e x t "   i d = " l o c a t i o n I n p u t "   p l a c e h o l d e r = " E n t e r   c i t y   o r   z i p   c o d e . . . "   v a l u e = " N e w   Y o r k " > 
                                                                 < b u t t o n   c l a s s = " m o s q u e - s e a r c h - b t n "   o n c l i c k = " a p p . s e a r c h M o s q u e s ( ) " > 
                                                                         < i   c l a s s = " f a s   f a - s e a r c h " > < / i >   S e a r c h 
                                                                 < / b u t t o n > 
                                                                 < b u t t o n   c l a s s = " m o s q u e - s e a r c h - b t n "   o n c l i c k = " a p p . f i n d N e a r b y M o s q u e s ( ) " > 
                                                                         < i   c l a s s = " f a s   f a - l o c a t i o n - a r r o w " > < / i >   N e a r   M e 
                                                                 < / b u t t o n > 
                                                         < / d i v > 
                                                 < / d i v > 
                                                 
                                                 < d i v   i d = " m a p C o n t a i n e r "   c l a s s = " m o s q u e - m a p " > < / d i v > 
                                                 
                                                 < d i v   i d = " m o s q u e L i s t "   c l a s s = " m o s q u e - l i s t " > 
                                                         < d i v   c l a s s = " m o s q u e - l o a d i n g " > 
                                                                 < d i v   c l a s s = " m o s q u e - s p i n n e r " > < / d i v > 
                                                                 < p > L o a d i n g   n e a r b y   m o s q u e s . . . < / p > 
                                                         < / d i v > 
                                                 < / d i v > 
                                         < / d i v > 
                                 < / d i v > 
                         < / d i v > 
                 ` ; 
                 
                 d o c u m e n t . b o d y . a p p e n d C h i l d ( m o d a l ) ; 
                 
                 / /   I n i t i a l i z e   m a p 
                 s e t T i m e o u t ( ( )   = >   { 
                         t h i s . i n i t M a p ( ) ; 
                         t h i s . f i n d N e a r b y M o s q u e s ( ) ; 
                 } ,   1 0 0 ) ; 
         } 
 
         i n i t M a p ( )   { 
                 c o n s t   d e f a u l t L o c a t i o n   =   {   l a t :   4 0 . 7 1 2 8 ,   l n g :   - 7 4 . 0 0 6 0   } ;   / /   N e w   Y o r k 
                 
                 t h i s . m a p   =   n e w   g o o g l e . m a p s . M a p ( d o c u m e n t . g e t E l e m e n t B y I d ( ' m a p C o n t a i n e r ' ) ,   { 
                         c e n t e r :   d e f a u l t L o c a t i o n , 
                         z o o m :   1 2 , 
                         s t y l e s :   [ 
                                 { 
                                         f e a t u r e T y p e :   ' p o i ' , 
                                         e l e m e n t T y p e :   ' l a b e l s ' , 
                                         s t y l e r s :   [ {   v i s i b i l i t y :   ' o f f '   } ] 
                                 } , 
                                 { 
                                         f e a t u r e T y p e :   ' p o i . b u s i n e s s ' , 
                                         s t y l e r s :   [ {   v i s i b i l i t y :   ' o f f '   } ] 
                                 } 
                         ] 
                 } ) ; 
 
                 / /   A d d   u s e r   l o c a t i o n   m a r k e r   i f   a v a i l a b l e 
                 i f   ( n a v i g a t o r . g e o l o c a t i o n )   { 
                         n a v i g a t o r . g e o l o c a t i o n . g e t C u r r e n t P o s i t i o n ( 
                                 ( p o s i t i o n )   = >   { 
                                         t h i s . u s e r L o c a t i o n   =   { 
                                                 l a t :   p o s i t i o n . c o o r d s . l a t i t u d e , 
                                                 l n g :   p o s i t i o n . c o o r d s . l o n g i t u d e 
                                         } ; 
                                         
                                         / /   A d d   u s e r   m a r k e r 
                                         n e w   g o o g l e . m a p s . M a r k e r ( { 
                                                 p o s i t i o n :   t h i s . u s e r L o c a t i o n , 
                                                 m a p :   t h i s . m a p , 
                                                 i c o n :   { 
                                                         u r l :   ' h t t p : / / m a p s . g o o g l e . c o m / m a p f i l e s / m s / i c o n s / b l u e - d o t . p n g ' , 
                                                         s c a l e d S i z e :   n e w   g o o g l e . m a p s . S i z e ( 4 0 ,   4 0 ) 
                                                 } , 
                                                 t i t l e :   ' Y o u r   L o c a t i o n ' 
                                         } ) ; 
                                         
                                         t h i s . m a p . s e t C e n t e r ( t h i s . u s e r L o c a t i o n ) ; 
                                 } , 
                                 ( e r r o r )   = >   { 
                                         c o n s o l e . l o g ( ' G e o l o c a t i o n   e r r o r : ' ,   e r r o r ) ; 
                                 } 
                         ) ; 
                 } 
         } 
 
         a s y n c   f i n d N e a r b y M o s q u e s ( )   { 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' m o s q u e L i s t ' ) . i n n e r H T M L   =   ` 
                         < d i v   c l a s s = " m o s q u e - l o a d i n g " > 
                                 < d i v   c l a s s = " m o s q u e - s p i n n e r " > < / d i v > 
                                 < p > S e a r c h i n g   f o r   n e a r b y   m o s q u e s . . . < / p > 
                         < / d i v > 
                 ` ; 
                 
                 / /   C l e a r   e x i s t i n g   m a r k e r s 
                 t h i s . c l e a r M a r k e r s ( ) ; 
                 
                 / /   U s e   c u r r e n t   l o c a t i o n   o r   d e f a u l t 
                 l e t   s e a r c h L o c a t i o n   =   t h i s . u s e r L o c a t i o n   | |   {   l a t :   4 0 . 7 1 2 8 ,   l n g :   - 7 4 . 0 0 6 0   } ; 
                 
                 / /   C r e a t e   P l a c e s S e r v i c e 
                 c o n s t   s e r v i c e   =   n e w   g o o g l e . m a p s . p l a c e s . P l a c e s S e r v i c e ( t h i s . m a p ) ; 
                 
                 c o n s t   r e q u e s t   =   { 
                         l o c a t i o n :   s e a r c h L o c a t i o n , 
                         r a d i u s :   5 0 0 0 ,   / /   5 k m   r a d i u s 
                         k e y w o r d :   ' m o s q u e   m a s j i d   i s l a m i c   c e n t e r ' , 
                         t y p e :   ' m o s q u e ' 
                 } ; 
                 
                 s e r v i c e . n e a r b y S e a r c h ( r e q u e s t ,   ( r e s u l t s ,   s t a t u s )   = >   { 
                         i f   ( s t a t u s   = = =   g o o g l e . m a p s . p l a c e s . P l a c e s S e r v i c e S t a t u s . O K )   { 
                                 t h i s . m o s q u e s   =   r e s u l t s ; 
                                 t h i s . d i s p l a y M o s q u e s ( r e s u l t s ) ; 
                                 t h i s . a d d M o s q u e M a r k e r s ( r e s u l t s ) ; 
                         }   e l s e   { 
                                 d o c u m e n t . g e t E l e m e n t B y I d ( ' m o s q u e L i s t ' ) . i n n e r H T M L   =   ` 
                                         < d i v   c l a s s = " m o s q u e - e r r o r " > 
                                                 < i   c l a s s = " f a s   f a - e x c l a m a t i o n - c i r c l e "   s t y l e = " f o n t - s i z e :   3 r e m ;   m a r g i n - b o t t o m :   1 5 p x ; " > < / i > 
                                                 < h 3 > N o   m o s q u e s   f o u n d   n e a r b y < / h 3 > 
                                                 < p > T r y   s e a r c h i n g   f o r   a   d i f f e r e n t   l o c a t i o n   o r   e x p a n d i n g   y o u r   s e a r c h   r a d i u s . < / p > 
                                         < / d i v > 
                                 ` ; 
                         } 
                 } ) ; 
         } 
 
         a s y n c   s e a r c h M o s q u e s ( )   { 
                 c o n s t   l o c a t i o n   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' l o c a t i o n I n p u t ' ) . v a l u e ; 
                 i f   ( ! l o c a t i o n )   r e t u r n ; 
                 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' m o s q u e L i s t ' ) . i n n e r H T M L   =   ` 
                         < d i v   c l a s s = " m o s q u e - l o a d i n g " > 
                                 < d i v   c l a s s = " m o s q u e - s p i n n e r " > < / d i v > 
                                 < p > S e a r c h i n g   f o r   m o s q u e s   i n   $ { l o c a t i o n } . . . < / p > 
                         < / d i v > 
                 ` ; 
                 
                 / /   G e o c o d e   t h e   l o c a t i o n 
                 c o n s t   g e o c o d e r   =   n e w   g o o g l e . m a p s . G e o c o d e r ( ) ; 
                 g e o c o d e r . g e o c o d e ( {   a d d r e s s :   l o c a t i o n   } ,   ( r e s u l t s ,   s t a t u s )   = >   { 
                         i f   ( s t a t u s   = = =   ' O K ' )   { 
                                 c o n s t   s e a r c h L o c a t i o n   =   r e s u l t s [ 0 ] . g e o m e t r y . l o c a t i o n ; 
                                 t h i s . m a p . s e t C e n t e r ( s e a r c h L o c a t i o n ) ; 
                                 
                                 c o n s t   s e r v i c e   =   n e w   g o o g l e . m a p s . p l a c e s . P l a c e s S e r v i c e ( t h i s . m a p ) ; 
                                 c o n s t   r e q u e s t   =   { 
                                         l o c a t i o n :   s e a r c h L o c a t i o n , 
                                         r a d i u s :   5 0 0 0 , 
                                         k e y w o r d :   ' m o s q u e   m a s j i d   i s l a m i c   c e n t e r ' , 
                                         t y p e :   ' m o s q u e ' 
                                 } ; 
                                 
                                 s e r v i c e . n e a r b y S e a r c h ( r e q u e s t ,   ( r e s u l t s ,   s t a t u s )   = >   { 
                                         i f   ( s t a t u s   = = =   g o o g l e . m a p s . p l a c e s . P l a c e s S e r v i c e S t a t u s . O K )   { 
                                                 t h i s . m o s q u e s   =   r e s u l t s ; 
                                                 t h i s . d i s p l a y M o s q u e s ( r e s u l t s ) ; 
                                                 t h i s . a d d M o s q u e M a r k e r s ( r e s u l t s ) ; 
                                         }   e l s e   { 
                                                 d o c u m e n t . g e t E l e m e n t B y I d ( ' m o s q u e L i s t ' ) . i n n e r H T M L   =   ` 
                                                         < d i v   c l a s s = " m o s q u e - e r r o r " > 
                                                                 < i   c l a s s = " f a s   f a - e x c l a m a t i o n - c i r c l e "   s t y l e = " f o n t - s i z e :   3 r e m ;   m a r g i n - b o t t o m :   1 5 p x ; " > < / i > 
                                                                 < h 3 > N o   m o s q u e s   f o u n d   i n   $ { l o c a t i o n } < / h 3 > 
                                                                 < p > T r y   a   d i f f e r e n t   l o c a t i o n   o r   c h e c k   t h e   s p e l l i n g . < / p > 
                                                         < / d i v > 
                                                 ` ; 
                                         } 
                                 } ) ; 
                         }   e l s e   { 
                                 d o c u m e n t . g e t E l e m e n t B y I d ( ' m o s q u e L i s t ' ) . i n n e r H T M L   =   ` 
                                         < d i v   c l a s s = " m o s q u e - e r r o r " > 
                                                 < i   c l a s s = " f a s   f a - e x c l a m a t i o n - c i r c l e "   s t y l e = " f o n t - s i z e :   3 r e m ;   m a r g i n - b o t t o m :   1 5 p x ; " > < / i > 
                                                 < h 3 > L o c a t i o n   n o t   f o u n d < / h 3 > 
                                                 < p > P l e a s e   c h e c k   t h e   s p e l l i n g   a n d   t r y   a g a i n . < / p > 
                                         < / d i v > 
                                 ` ; 
                         } 
                 } ) ; 
         } 
 
         d i s p l a y M o s q u e s ( m o s q u e s )   { 
                 c o n s t   m o s q u e L i s t   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' m o s q u e L i s t ' ) ; 
                 
                 i f   ( m o s q u e s . l e n g t h   = = =   0 )   { 
                         m o s q u e L i s t . i n n e r H T M L   =   ` 
                                 < d i v   c l a s s = " m o s q u e - e r r o r " > 
                                         < i   c l a s s = " f a s   f a - m o s q u e "   s t y l e = " f o n t - s i z e :   3 r e m ;   m a r g i n - b o t t o m :   1 5 p x ; " > < / i > 
                                         < h 3 > N o   m o s q u e s   f o u n d   n e a r b y < / h 3 > 
                                         < p > T r y   e x p a n d i n g   y o u r   s e a r c h   r a d i u s   o r   c h e c k   a   d i f f e r e n t   l o c a t i o n . < / p > 
                                 < / d i v > 
                         ` ; 
                         r e t u r n ; 
                 } 
                 
                 m o s q u e L i s t . i n n e r H T M L   =   m o s q u e s . m a p ( ( m o s q u e ,   i n d e x )   = >   { 
                         c o n s t   d i s t a n c e   =   t h i s . c a l c u l a t e D i s t a n c e ( 
                                 t h i s . u s e r L o c a t i o n   | |   {   l a t :   4 0 . 7 1 2 8 ,   l n g :   - 7 4 . 0 0 6 0   } , 
                                 m o s q u e . g e o m e t r y . l o c a t i o n 
                         ) ; 
                         
                         r e t u r n   ` 
                                 < d i v   c l a s s = " m o s q u e - c a r d "   o n c l i c k = " a p p . s h o w M o s q u e D e t a i l s ( $ { i n d e x } ) " > 
                                         < d i v   c l a s s = " m o s q u e - i c o n " > 
                                                 < i   c l a s s = " f a s   f a - m o s q u e " > < / i > 
                                         < / d i v > 
                                         < d i v   c l a s s = " m o s q u e - i n f o " > 
                                                 < d i v   c l a s s = " m o s q u e - n a m e " > $ { m o s q u e . n a m e } < / d i v > 
                                                 < d i v   c l a s s = " m o s q u e - a d d r e s s " > $ { m o s q u e . v i c i n i t y   | |   ' A d d r e s s   n o t   a v a i l a b l e ' } < / d i v > 
                                                 < d i v   c l a s s = " m o s q u e - d i s t a n c e " > 
                                                         < i   c l a s s = " f a s   f a - l o c a t i o n - a r r o w " > < / i >   $ { d i s t a n c e . t o F i x e d ( 2 ) }   k m   a w a y 
                                                 < / d i v > 
                                                 < d i v   c l a s s = " m o s q u e - a c t i o n s " > 
                                                         < b u t t o n   c l a s s = " m o s q u e - d i r e c t i o n s - b t n "   o n c l i c k = " a p p . g e t D i r e c t i o n s ( ' $ { m o s q u e . v i c i n i t y } ' ,   e v e n t ) " > 
                                                                 < i   c l a s s = " f a s   f a - d i r e c t i o n s " > < / i >   D i r e c t i o n s 
                                                         < / b u t t o n > 
                                                         < b u t t o n   c l a s s = " m o s q u e - s a v e - b t n "   o n c l i c k = " a p p . s a v e M o s q u e ( $ { i n d e x } ,   e v e n t ) " > 
                                                                 < i   c l a s s = " f a r   f a - b o o k m a r k " > < / i >   S a v e 
                                                         < / b u t t o n > 
                                                 < / d i v > 
                                         < / d i v > 
                                 < / d i v > 
                         ` ; 
                 } ) . j o i n ( ' ' ) ; 
         } 
 
         a d d M o s q u e M a r k e r s ( m o s q u e s )   { 
                 t h i s . c l e a r M a r k e r s ( ) ; 
                 
                 m o s q u e s . f o r E a c h ( ( m o s q u e ,   i n d e x )   = >   { 
                         c o n s t   m a r k e r   =   n e w   g o o g l e . m a p s . M a r k e r ( { 
                                 p o s i t i o n :   m o s q u e . g e o m e t r y . l o c a t i o n , 
                                 m a p :   t h i s . m a p , 
                                 t i t l e :   m o s q u e . n a m e , 
                                 i c o n :   { 
                                         u r l :   ' h t t p : / / m a p s . g o o g l e . c o m / m a p f i l e s / m s / i c o n s / r e d - d o t . p n g ' , 
                                         s c a l e d S i z e :   n e w   g o o g l e . m a p s . S i z e ( 4 0 ,   4 0 ) 
                                 } 
                         } ) ; 
                         
                         / /   A d d   c l i c k   l i s t e n e r   t o   m a r k e r 
                         m a r k e r . a d d L i s t e n e r ( ' c l i c k ' ,   ( )   = >   { 
                                 t h i s . s h o w M o s q u e D e t a i l s ( i n d e x ) ; 
                         } ) ; 
                         
                         t h i s . m a r k e r s . p u s h ( m a r k e r ) ; 
                 } ) ; 
         } 
 
         c l e a r M a r k e r s ( )   { 
                 t h i s . m a r k e r s . f o r E a c h ( m a r k e r   = >   m a r k e r . s e t M a p ( n u l l ) ) ; 
                 t h i s . m a r k e r s   =   [ ] ; 
         } 
 
         c a l c u l a t e D i s t a n c e ( p o i n t 1 ,   p o i n t 2 )   { 
                 c o n s t   l a t 1   =   p o i n t 1 . l a t ; 
                 c o n s t   l n g 1   =   p o i n t 1 . l n g ; 
                 c o n s t   l a t 2   =   p o i n t 2 . l a t ( ) ; 
                 c o n s t   l n g 2   =   p o i n t 2 . l n g ( ) ; 
                 
                 c o n s t   R   =   6 3 7 1 ;   / /   E a r t h ' s   r a d i u s   i n   k m 
                 c o n s t   d L a t   =   t h i s . t o R a d ( l a t 2   -   l a t 1 ) ; 
                 c o n s t   d L o n   =   t h i s . t o R a d ( l n g 2   -   l n g 1 ) ; 
                 c o n s t   a   =   
                         M a t h . s i n ( d L a t   /   2 )   *   M a t h . s i n ( d L a t   /   2 )   + 
                         M a t h . c o s ( t h i s . t o R a d ( l a t 1 ) )   *   M a t h . c o s ( t h i s . t o R a d ( l a t 2 ) )   *   
                         M a t h . s i n ( d L o n   /   2 )   *   M a t h . s i n ( d L o n   /   2 ) ; 
                 c o n s t   c   =   2   *   M a t h . a t a n 2 ( M a t h . s q r t ( a ) ,   M a t h . s q r t ( 1   -   a ) ) ; 
                 r e t u r n   R   *   c ; 
         } 
 
         t o R a d ( v a l u e )   { 
                 r e t u r n   v a l u e   *   M a t h . P I   /   1 8 0 ; 
         } 
 
         s h o w M o s q u e D e t a i l s ( i n d e x )   { 
                 c o n s t   m o s q u e   =   t h i s . m o s q u e s [ i n d e x ] ; 
                 
                 / /   C r e a t e   d e t a i l s   m o d a l 
                 c o n s t   d e t a i l s M o d a l   =   d o c u m e n t . c r e a t e E l e m e n t ( ' d i v ' ) ; 
                 d e t a i l s M o d a l . c l a s s N a m e   =   ' m o s q u e - d e t a i l s - m o d a l ' ; 
                 d e t a i l s M o d a l . i d   =   ' m o s q u e D e t a i l s M o d a l ' ; 
                 d e t a i l s M o d a l . i n n e r H T M L   =   ` 
                         < d i v   c l a s s = " d e t a i l s - h e a d e r " > 
                                 < h 2 > $ { m o s q u e . n a m e } < / h 2 > 
                                 < b u t t o n   c l a s s = " d e t a i l s - c l o s e "   o n c l i c k = " a p p . c l o s e M o s q u e D e t a i l s ( ) " > & t i m e s ; < / b u t t o n > 
                         < / d i v > 
                         
                         < d i v   s t y l e = " m a r g i n - b o t t o m :   2 0 p x ; " > 
                                 < p > < i   c l a s s = " f a s   f a - m a p - m a r k e r - a l t "   s t y l e = " c o l o r :   v a r ( - - a c c e n t - c o l o r ) ; " > < / i >   $ { m o s q u e . v i c i n i t y   | |   ' A d d r e s s   n o t   a v a i l a b l e ' } < / p > 
                                 $ { m o s q u e . r a t i n g   ?   ` < p > < i   c l a s s = " f a s   f a - s t a r "   s t y l e = " c o l o r :   g o l d ; " > < / i >   $ { m o s q u e . r a t i n g }   ( $ { m o s q u e . u s e r _ r a t i n g s _ t o t a l   | |   0 }   r e v i e w s ) < / p > `   :   ' ' } 
                                 $ { m o s q u e . p h o n e   ?   ` < p > < i   c l a s s = " f a s   f a - p h o n e "   s t y l e = " c o l o r :   v a r ( - - a c c e n t - c o l o r ) ; " > < / i >   $ { m o s q u e . p h o n e } < / p > `   :   ' ' } 
                         < / d i v > 
                         
                         < h 3   s t y l e = " c o l o r :   v a r ( - - p r i m a r y - c o l o r ) ;   m a r g i n - b o t t o m :   1 5 p x ; " > P r a y e r   T i m e s   ( E s t i m a t e d ) < / h 3 > 
                         < d i v   c l a s s = " p r a y e r - s c h e d u l e " > 
                                 < d i v   c l a s s = " s c h e d u l e - i t e m " > 
                                         < s p a n   c l a s s = " p r a y e r " > F a j r < / s p a n > 
                                         < s p a n   c l a s s = " t i m e " > 0 5 : 3 0   A M < / s p a n > 
                                 < / d i v > 
                                 < d i v   c l a s s = " s c h e d u l e - i t e m " > 
                                         < s p a n   c l a s s = " p r a y e r " > S u n r i s e < / s p a n > 
                                         < s p a n   c l a s s = " t i m e " > 0 7 : 0 0   A M < / s p a n > 
                                 < / d i v > 
                                 < d i v   c l a s s = " s c h e d u l e - i t e m " > 
                                         < s p a n   c l a s s = " p r a y e r " > D h u h r < / s p a n > 
                                         < s p a n   c l a s s = " t i m e " > 1 2 : 3 0   P M < / s p a n > 
                                 < / d i v > 
                                 < d i v   c l a s s = " s c h e d u l e - i t e m " > 
                                         < s p a n   c l a s s = " p r a y e r " > A s r < / s p a n > 
                                         < s p a n   c l a s s = " t i m e " > 0 3 : 4 5   P M < / s p a n > 
                                 < / d i v > 
                                 < d i v   c l a s s = " s c h e d u l e - i t e m " > 
                                         < s p a n   c l a s s = " p r a y e r " > M a g h r i b < / s p a n > 
                                         < s p a n   c l a s s = " t i m e " > 0 6 : 1 5   P M < / s p a n > 
                                 < / d i v > 
                                 < d i v   c l a s s = " s c h e d u l e - i t e m " > 
                                         < s p a n   c l a s s = " p r a y e r " > I s h a < / s p a n > 
                                         < s p a n   c l a s s = " t i m e " > 0 7 : 4 5   P M < / s p a n > 
                                 < / d i v > 
                         < / d i v > 
                         
                         < d i v   s t y l e = " d i s p l a y :   f l e x ;   g a p :   1 0 p x ;   m a r g i n - t o p :   2 0 p x ; " > 
                                 < b u t t o n   c l a s s = " m o s q u e - d i r e c t i o n s - b t n "   s t y l e = " f l e x :   1 ; "   o n c l i c k = " a p p . g e t D i r e c t i o n s ( ' $ { m o s q u e . v i c i n i t y } ' ,   e v e n t ) " > 
                                         < i   c l a s s = " f a s   f a - d i r e c t i o n s " > < / i >   G e t   D i r e c t i o n s 
                                 < / b u t t o n > 
                                 < b u t t o n   c l a s s = " m o s q u e - s a v e - b t n "   s t y l e = " f l e x :   1 ; "   o n c l i c k = " a p p . s a v e M o s q u e ( $ { i n d e x } ,   e v e n t ) " > 
                                         < i   c l a s s = " f a r   f a - b o o k m a r k " > < / i >   S a v e   M o s q u e 
                                 < / b u t t o n > 
                         < / d i v > 
                 ` ; 
                 
                 d o c u m e n t . b o d y . a p p e n d C h i l d ( d e t a i l s M o d a l ) ; 
         } 
 
         g e t D i r e c t i o n s ( a d d r e s s ,   e v e n t )   { 
                 e v e n t . s t o p P r o p a g a t i o n ( ) ; 
                 i f   ( a d d r e s s )   { 
                         w i n d o w . o p e n ( ` h t t p s : / / w w w . g o o g l e . c o m / m a p s / d i r / ? a p i = 1 & d e s t i n a t i o n = $ { e n c o d e U R I C o m p o n e n t ( a d d r e s s ) } ` ,   ' _ b l a n k ' ) ; 
                 } 
         } 
 
         s a v e M o s q u e ( i n d e x ,   e v e n t )   { 
                 e v e n t . s t o p P r o p a g a t i o n ( ) ; 
                 c o n s t   m o s q u e   =   t h i s . m o s q u e s [ i n d e x ] ; 
                 
                 / /   G e t   s a v e d   m o s q u e s   f r o m   l o c a l S t o r a g e 
                 l e t   s a v e d M o s q u e s   =   J S O N . p a r s e ( l o c a l S t o r a g e . g e t I t e m ( ' i l m n e t _ s a v e d _ m o s q u e s ' )   | |   ' [ ] ' ) ; 
                 
                 / /   C h e c k   i f   a l r e a d y   s a v e d 
                 i f   ( ! s a v e d M o s q u e s . s o m e ( m   = >   m . p l a c e _ i d   = = =   m o s q u e . p l a c e _ i d ) )   { 
                         s a v e d M o s q u e s . p u s h ( { 
                                 p l a c e _ i d :   m o s q u e . p l a c e _ i d , 
                                 n a m e :   m o s q u e . n a m e , 
                                 v i c i n i t y :   m o s q u e . v i c i n i t y , 
                                 s a v e d _ d a t e :   n e w   D a t e ( ) . t o I S O S t r i n g ( ) 
                         } ) ; 
                         
                         l o c a l S t o r a g e . s e t I t e m ( ' i l m n e t _ s a v e d _ m o s q u e s ' ,   J S O N . s t r i n g i f y ( s a v e d M o s q u e s ) ) ; 
                         
                         / /   S h o w   s u c c e s s   m e s s a g e 
                         c o n s t   b t n   =   e v e n t . c u r r e n t T a r g e t ; 
                         b t n . i n n e r H T M L   =   ' < i   c l a s s = " f a s   f a - c h e c k " > < / i >   S a v e d ' ; 
                         b t n . s t y l e . b a c k g r o u n d   =   ' v a r ( - - s u c c e s s - c o l o r ) ' ; 
                         b t n . s t y l e . c o l o r   =   ' w h i t e ' ; 
                 }   e l s e   { 
                         a l e r t ( ' T h i s   m o s q u e   i s   a l r e a d y   s a v e d ! ' ) ; 
                 } 
         } 
 
         c l o s e M o s q u e D e t a i l s ( )   { 
                 c o n s t   m o d a l   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' m o s q u e D e t a i l s M o d a l ' ) ; 
                 i f   ( m o d a l )   m o d a l . r e m o v e ( ) ; 
         } 
 
         c l o s e M o s q u e M o d a l ( )   { 
                 c o n s t   m o d a l   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' m o s q u e M o d a l ' ) ; 
                 i f   ( m o d a l )   m o d a l . r e m o v e ( ) ; 
         } 
 
         / /   U p d a t e   r e n d e r T o o l s   t o   i n c l u d e   M o s q u e   F i n d e r 
         r e n d e r T o o l s ( )   { 
                 c o n s t   t o o l s   =   [ 
                         {   n a m e :   ' Q u r \ ' a n ' ,   i c o n :   ' f a - q u r a n ' ,   c o l o r :   ' # 0 c 3 b 2 e ' ,   a c t i o n :   ' a p p . s h o w A u d i o R e c i t a t i o n s ( ) '   } , 
                         {   n a m e :   ' H a d i t h ' ,   i c o n :   ' f a - b o o k ' ,   c o l o r :   ' # 1 a 5 c 4 8 ' ,   a c t i o n :   ' w i n d o w . o p e n ( " h t t p s : / / s u n n a h . c o m " ,   " _ b l a n k " ) '   } , 
                         {   n a m e :   ' D u a s ' ,   i c o n :   ' f a - p r a y i n g - h a n d s ' ,   c o l o r :   ' # d 4 a f 3 7 ' ,   a c t i o n :   ' a p p . s h o w A u d i o R e c i t a t i o n s ( ) '   } , 
                         {   n a m e :   ' M o s q u e   F i n d e r ' ,   i c o n :   ' f a - m o s q u e ' ,   c o l o r :   ' # b 8 8 6 0 b ' ,   a c t i o n :   ' a p p . s h o w M o s q u e F i n d e r ( ) '   } , 
                         {   n a m e :   ' P r a y e r   T i m e s ' ,   i c o n :   ' f a - c l o c k ' ,   c o l o r :   ' # 0 c 3 b 2 e ' ,   a c t i o n :   ' a p p . s h o w P r a y e r T i m e s ( ) '   } , 
                         {   n a m e :   ' T a s b i h ' ,   i c o n :   ' f a - p r a y ' ,   c o l o r :   ' # 8 b 4 5 1 3 ' ,   a c t i o n :   ' a p p . s h o w T a s b i h ( ) '   } 
                 ] ; 
                 
                 r e t u r n   t o o l s . m a p ( t o o l   = >   ` 
                         < d i v   c l a s s = " t o o l - c a r d "   s t y l e = " b a c k g r o u n d :   $ { t o o l . c o l o r } 2 0 ;   b o r d e r - c o l o r :   $ { t o o l . c o l o r } "   o n c l i c k = " $ { t o o l . a c t i o n } " > 
                                 < i   c l a s s = " f a s   $ { t o o l . i c o n }   t o o l - i c o n "   s t y l e = " c o l o r :   $ { t o o l . c o l o r } " > < / i > 
                                 < s p a n > $ { t o o l . n a m e } < / s p a n > 
                         < / d i v > 
                 ` ) . j o i n ( ' ' ) ; 
         }  
 
         / /   = = = = = = = = = =   I S L A M I C   C A L E N D A R   S Y S T E M   = = = = = = = = = = 
         i s l a m i c M o n t h s   =   [ 
                 {   n a m e :   ' M u h a r r a m ' ,   a r a b i c :   ' EO-N1NQE' ,   d a y s :   3 0 ,   s i g n i f i c a n c e :   ' F i r s t   m o n t h   o f   I s l a m i c   c a l e n d a r .   D a y   o f   A s h u r a   o n   1 0 t h   M u h a r r a m . '   } , 
                 {   n a m e :   ' S a f a r ' ,   a r a b i c :   ' 5NAN1' ,   d a y s :   2 9 ,   s i g n i f i c a n c e :   ' S e c o n d   m o n t h .   T h e   m o n t h   o f   m i g r a t i o n . '   } , 
                 {   n a m e :   ' R a b i   a l - A w w a l ' ,   a r a b i c :   ' 1N(PJ9  qDR#NHNQD' ,   d a y s :   3 0 ,   s i g n i f i c a n c e :   ' B i r t h   o f   P r o p h e t   M u h a m m a d   úý  o n   1 2 t h   o f   t h i s   m o n t h . '   } , 
                 {   n a m e :   ' R a b i   a l - T h a n i ' ,   a r a b i c :   ' 1N(PJ9  qD+NQ'FPJ' ,   d a y s :   2 9 ,   s i g n i f i c a n c e :   ' F o u r t h   m o n t h . '   } , 
                 {   n a m e :   ' J u m a d a   a l - A w w a l ' ,   a r a b i c :   ' ,OEN'/NIp  qDR#NHNQD' ,   d a y s :   3 0 ,   s i g n i f i c a n c e :   ' F i f t h   m o n t h . '   } , 
                 {   n a m e :   ' J u m a d a   a l - T h a n i ' ,   a r a b i c :   ' ,OEN'/NIp  qD+NQ'FPJ' ,   d a y s :   2 9 ,   s i g n i f i c a n c e :   ' S i x t h   m o n t h . '   } , 
                 {   n a m e :   ' R a j a b ' ,   a r a b i c :   ' 1N,N(' ,   d a y s :   3 0 ,   s i g n i f i c a n c e :   ' S a c r e d   m o n t h .   I s r a   a n d   M i r a j   o n   2 7 t h   R a j a b . '   } , 
                 {   n a m e :   ' S h a b a n ' ,   a r a b i c :   ' 4N9R(N'F' ,   d a y s :   2 9 ,   s i g n i f i c a n c e :   ' M o n t h   o f   p r e p a r a t i o n   f o r   R a m a d a n .   1 5 t h   S h a b a n   i s   b l e s s e d   n i g h t . '   } , 
                 {   n a m e :   ' R a m a d a n ' ,   a r a b i c :   ' 1NEN6N'F' ,   d a y s :   3 0 ,   s i g n i f i c a n c e :   ' M o n t h   o f   f a s t i n g ,   Q u r \ ' a n   r e v e l a t i o n ,   a n d   L a y l a t   a l - Q a d r . '   } , 
                 {   n a m e :   ' S h a w w a l ' ,   a r a b i c :   ' 4NHNQ'D' ,   d a y s :   2 9 ,   s i g n i f i c a n c e :   ' E i d   a l - F i t r   o n   1 s t   S h a w w a l .   S i x   d a y s   o f   f a s t i n g   r e c o m m e n d e d . '   } , 
                 {   n a m e :   ' D h u l   Q a d a h ' ,   a r a b i c :   ' 0OH  qDRBN9R/N)' ,   d a y s :   3 0 ,   s i g n i f i c a n c e :   ' S a c r e d   m o n t h .   M o n t h   o f   r e s t   b e f o r e   H a j j . '   } , 
                 {   n a m e :   ' D h u l   H i j j a h ' ,   a r a b i c :   ' 0OH  qDR-P,NQ)' ,   d a y s :   2 9 ,   s i g n i f i c a n c e :   ' S a c r e d   m o n t h .   H a j j   a n d   E i d   a l - A d h a   o n   1 0 t h .   F i r s t   1 0   d a y s   a r e   b l e s s e d . '   } 
         ] ; 
 
         i s l a m i c E v e n t s   =   [ 
                 {   m o n t h :   ' M u h a r r a m ' ,   d a y :   1 ,   n a m e :   ' I s l a m i c   N e w   Y e a r ' ,   d e s c :   ' B e g i n n i n g   o f   t h e   n e w   H i j r i   y e a r . ' ,   s i g n i f i c a n c e :   ' F i r s t   d a y   o f   M u h a r r a m '   } , 
                 {   m o n t h :   ' M u h a r r a m ' ,   d a y :   1 0 ,   n a m e :   ' D a y   o f   A s h u r a ' ,   d e s c :   ' D a y   o f   f a s t i n g   a n d   r e m e m b r a n c e .   P r o p h e t   M u s a   ( M o s e s )   w a s   s a v e d   o n   t h i s   d a y . ' ,   s i g n i f i c a n c e :   ' R e c o m m e n d e d   f a s t i n g '   } , 
                 {   m o n t h :   ' R a b i   a l - A w w a l ' ,   d a y :   1 2 ,   n a m e :   ' M a w l i d   a l - N a b i ' ,   d e s c :   ' B i r t h   o f   P r o p h e t   M u h a m m a d   úý. ' ,   s i g n i f i c a n c e :   ' C e l e b r a t e d   b y   m a n y   M u s l i m s '   } , 
                 {   m o n t h :   ' R a j a b ' ,   d a y :   2 7 ,   n a m e :   ' I s r a   a n d   M i r a j ' ,   d e s c :   ' N i g h t   j o u r n e y   a n d   a s c e n s i o n   o f   P r o p h e t   M u h a m m a d   úý. ' ,   s i g n i f i c a n c e :   ' B l e s s e d   n i g h t '   } , 
                 {   m o n t h :   ' S h a b a n ' ,   d a y :   1 5 ,   n a m e :   ' N i s f   S h a b a n ' ,   d e s c :   ' B l e s s e d   n i g h t   o f   f o r g i v e n e s s . ' ,   s i g n i f i c a n c e :   ' N i g h t   o f   w o r s h i p   a n d   p r a y e r '   } , 
                 {   m o n t h :   ' R a m a d a n ' ,   d a y :   1 ,   n a m e :   ' B e g i n n i n g   o f   R a m a d a n ' ,   d e s c :   ' F i r s t   d a y   o f   f a s t i n g . ' ,   s i g n i f i c a n c e :   ' M o n t h   o f   Q u r \ ' a n   a n d   m e r c y '   } , 
                 {   m o n t h :   ' R a m a d a n ' ,   d a y :   2 7 ,   n a m e :   ' L a y l a t   a l - Q a d r ' ,   d e s c :   ' N i g h t   o f   P o w e r ,   b e t t e r   t h a n   1 0 0 0   m o n t h s . ' ,   s i g n i f i c a n c e :   ' M o s t   b l e s s e d   n i g h t '   } , 
                 {   m o n t h :   ' S h a w w a l ' ,   d a y :   1 ,   n a m e :   ' E i d   a l - F i t r ' ,   d e s c :   ' F e s t i v a l   o f   b r e a k i n g   t h e   f a s t . ' ,   s i g n i f i c a n c e :   ' C e l e b r a t i o n   a n d   p r a y e r s '   } , 
                 {   m o n t h :   ' D h u l   H i j j a h ' ,   d a y :   9 ,   n a m e :   ' D a y   o f   A r a f a h ' ,   d e s c :   ' D a y   o f   s t a n d i n g   a t   A r a f a t   d u r i n g   H a j j . ' ,   s i g n i f i c a n c e :   ' B e s t   d a y   o f   t h e   y e a r '   } , 
                 {   m o n t h :   ' D h u l   H i j j a h ' ,   d a y :   1 0 ,   n a m e :   ' E i d   a l - A d h a ' ,   d e s c :   ' F e s t i v a l   o f   s a c r i f i c e . ' ,   s i g n i f i c a n c e :   ' C e l e b r a t i o n   a n d   Q u r b a n i '   } 
         ] ; 
 
         c u r r e n t H i j r i D a t e   =   n u l l ; 
 
         a s y n c   s h o w I s l a m i c C a l e n d a r ( )   { 
                 / /   G e t   c u r r e n t   H i j r i   d a t e 
                 a w a i t   t h i s . f e t c h H i j r i D a t e ( ) ; 
                 
                 / /   C r e a t e   c a l e n d a r   m o d a l 
                 c o n s t   m o d a l   =   d o c u m e n t . c r e a t e E l e m e n t ( ' d i v ' ) ; 
                 m o d a l . c l a s s N a m e   =   ' m o d a l - o v e r l a y   a c t i v e ' ; 
                 m o d a l . i d   =   ' c a l e n d a r M o d a l ' ; 
                 m o d a l . i n n e r H T M L   =   ` 
                         < d i v   c l a s s = " m o d a l "   s t y l e = " m a x - w i d t h :   1 0 0 0 p x ; " > 
                                 < d i v   c l a s s = " m o d a l - h e a d e r " > 
                                         < d i v   c l a s s = " m o d a l - t i t l e " > 
                                                 < i   c l a s s = " f a s   f a - c a l e n d a r - a l t " > < / i > 
                                                 < s p a n > I s l a m i c   C a l e n d a r   ( H i j r i ) < / s p a n > 
                                         < / d i v > 
                                         < b u t t o n   c l a s s = " m o d a l - c l o s e "   o n c l i c k = " a p p . c l o s e C a l e n d a r M o d a l ( ) " > & t i m e s ; < / b u t t o n > 
                                 < / d i v > 
                                 < d i v   c l a s s = " m o d a l - b o d y " > 
                                         < d i v   c l a s s = " c a l e n d a r - s e c t i o n " > 
                                                 < d i v   c l a s s = " c a l e n d a r - h e a d e r " > 
                                                         < d i v   c l a s s = " h i j r i - d a t e - l a r g e "   i d = " c u r r e n t H i j r i D a t e " > $ { t h i s . c u r r e n t H i j r i D a t e   | |   ' L o a d i n g . . . ' } < / d i v > 
                                                         < d i v   c l a s s = " g r e g o r i a n - d a t e "   i d = " c u r r e n t G r e g o r i a n D a t e " > $ { n e w   D a t e ( ) . t o L o c a l e D a t e S t r i n g ( ' e n - U S ' ,   {   w e e k d a y :   ' l o n g ' ,   y e a r :   ' n u m e r i c ' ,   m o n t h :   ' l o n g ' ,   d a y :   ' n u m e r i c '   } ) } < / d i v > 
                                                 < / d i v > 
                                                 
                                                 < d i v   c l a s s = " c a l e n d a r - c o n v e r t e r " > 
                                                         < d i v   c l a s s = " c o n v e r t e r - t i t l e " > 
                                                                 < i   c l a s s = " f a s   f a - e x c h a n g e - a l t " > < / i > 
                                                                 < s p a n > D a t e   C o n v e r t e r < / s p a n > 
                                                         < / d i v > 
                                                         < d i v   c l a s s = " c o n v e r t e r - g r i d " > 
                                                                 < d i v   c l a s s = " c o n v e r t e r - c a r d " > 
                                                                         < h 3 > G r e g o r i a n   t o   H i j r i < / h 3 > 
                                                                         < d i v   c l a s s = " d a t e - i n p u t - g r o u p " > 
                                                                                 < i n p u t   t y p e = " n u m b e r "   i d = " g r e g D a y "   c l a s s = " d a t e - i n p u t "   p l a c e h o l d e r = " D a y "   m i n = " 1 "   m a x = " 3 1 "   v a l u e = " $ { n e w   D a t e ( ) . g e t D a t e ( ) } " > 
                                                                                 < i n p u t   t y p e = " n u m b e r "   i d = " g r e g M o n t h "   c l a s s = " d a t e - i n p u t "   p l a c e h o l d e r = " M o n t h "   m i n = " 1 "   m a x = " 1 2 "   v a l u e = " $ { n e w   D a t e ( ) . g e t M o n t h ( )   +   1 } " > 
                                                                                 < i n p u t   t y p e = " n u m b e r "   i d = " g r e g Y e a r "   c l a s s = " d a t e - i n p u t "   p l a c e h o l d e r = " Y e a r "   m i n = " 1 9 0 0 "   m a x = " 2 1 0 0 "   v a l u e = " $ { n e w   D a t e ( ) . g e t F u l l Y e a r ( ) } " > 
                                                                         < / d i v > 
                                                                         < b u t t o n   c l a s s = " c o n v e r t - b t n "   o n c l i c k = " a p p . c o n v e r t G r e g o r i a n T o H i j r i ( ) " > 
                                                                                 < i   c l a s s = " f a s   f a - a r r o w - r i g h t " > < / i >   C o n v e r t 
                                                                         < / b u t t o n > 
                                                                         < d i v   c l a s s = " c o n v e r t e d - r e s u l t "   i d = " h i j r i R e s u l t " > < / d i v > 
                                                                 < / d i v > 
                                                                 
                                                                 < d i v   c l a s s = " c o n v e r t e r - c a r d " > 
                                                                         < h 3 > H i j r i   t o   G r e g o r i a n < / h 3 > 
                                                                         < d i v   c l a s s = " d a t e - i n p u t - g r o u p " > 
                                                                                 < i n p u t   t y p e = " n u m b e r "   i d = " h i j r i D a y "   c l a s s = " d a t e - i n p u t "   p l a c e h o l d e r = " D a y "   m i n = " 1 "   m a x = " 3 0 "   v a l u e = " 1 " > 
                                                                                 < s e l e c t   i d = " h i j r i M o n t h "   c l a s s = " d a t e - i n p u t " > 
                                                                                         $ { t h i s . i s l a m i c M o n t h s . m a p ( ( m o n t h ,   i n d e x )   = >   ` 
                                                                                                 < o p t i o n   v a l u e = " $ { i n d e x   +   1 } " > $ { m o n t h . n a m e } < / o p t i o n > 
                                                                                         ` ) . j o i n ( ' ' ) } 
                                                                                 < / s e l e c t > 
                                                                                 < i n p u t   t y p e = " n u m b e r "   i d = " h i j r i Y e a r "   c l a s s = " d a t e - i n p u t "   p l a c e h o l d e r = " Y e a r "   m i n = " 1 3 0 0 "   m a x = " 1 5 0 0 "   v a l u e = " 1 4 4 6 " > 
                                                                         < / d i v > 
                                                                         < b u t t o n   c l a s s = " c o n v e r t - b t n "   o n c l i c k = " a p p . c o n v e r t H i j r i T o G r e g o r i a n ( ) " > 
                                                                                 < i   c l a s s = " f a s   f a - a r r o w - r i g h t " > < / i >   C o n v e r t 
                                                                         < / b u t t o n > 
                                                                         < d i v   c l a s s = " c o n v e r t e d - r e s u l t "   i d = " g r e g R e s u l t " > < / d i v > 
                                                                 < / d i v > 
                                                         < / d i v > 
                                                 < / d i v > 
                                                 
                                                 < d i v   c l a s s = " c a l e n d a r - n a v i g a t i o n " > 
                                                         < b u t t o n   c l a s s = " c a l e n d a r - n a v - b t n "   o n c l i c k = " a p p . p r e v i o u s M o n t h ( ) " > 
                                                                 < i   c l a s s = " f a s   f a - c h e v r o n - l e f t " > < / i >   P r e v i o u s   M o n t h 
                                                         < / b u t t o n > 
                                                         < h 3   s t y l e = " c o l o r :   v a r ( - - p r i m a r y - c o l o r ) ; "   i d = " c u r r e n t M o n t h D i s p l a y " > $ { t h i s . i s l a m i c M o n t h s [ n e w   D a t e ( ) . g e t M o n t h ( ) ] . n a m e }   1 4 4 6 < / h 3 > 
                                                         < b u t t o n   c l a s s = " c a l e n d a r - n a v - b t n "   o n c l i c k = " a p p . n e x t M o n t h ( ) " > 
                                                                 N e x t   M o n t h   < i   c l a s s = " f a s   f a - c h e v r o n - r i g h t " > < / i > 
                                                         < / b u t t o n > 
                                                 < / d i v > 
                                                 
                                                 < d i v   c l a s s = " i s l a m i c - m o n t h s "   i d = " m o n t h s G r i d " > 
                                                         $ { t h i s . r e n d e r M o n t h s ( ) } 
                                                 < / d i v > 
                                                 
                                                 < d i v   c l a s s = " i s l a m i c - e v e n t s " > 
                                                         < d i v   c l a s s = " e v e n t s - t i t l e " > 
                                                                 < i   c l a s s = " f a s   f a - s t a r " > < / i > 
                                                                 < s p a n > I m p o r t a n t   I s l a m i c   E v e n t s < / s p a n > 
                                                         < / d i v > 
                                                         < d i v   c l a s s = " e v e n t s - l i s t "   i d = " e v e n t s L i s t " > 
                                                                 $ { t h i s . r e n d e r E v e n t s ( ) } 
                                                         < / d i v > 
                                                 < / d i v > 
                                         < / d i v > 
                                 < / d i v > 
                         < / d i v > 
                 ` ; 
                 
                 d o c u m e n t . b o d y . a p p e n d C h i l d ( m o d a l ) ; 
         } 
 
         a s y n c   f e t c h H i j r i D a t e ( )   { 
                 t r y   { 
                         c o n s t   r e s p o n s e   =   a w a i t   f e t c h ( ` h t t p s : / / a p i . a l a d h a n . c o m / v 1 / g T o H / $ { n e w   D a t e ( ) . g e t D a t e ( ) } / $ { n e w   D a t e ( ) . g e t M o n t h ( )   +   1 } / $ { n e w   D a t e ( ) . g e t F u l l Y e a r ( ) } ` ) ; 
                         c o n s t   d a t a   =   a w a i t   r e s p o n s e . j s o n ( ) ; 
                         
                         i f   ( d a t a . c o d e   = = =   2 0 0 )   { 
                                 c o n s t   h i j r i   =   d a t a . d a t a . h i j r i ; 
                                 t h i s . c u r r e n t H i j r i D a t e   =   ` $ { h i j r i . d a y }   $ { h i j r i . m o n t h . e n }   $ { h i j r i . y e a r }   A H ` ; 
                         } 
                 }   c a t c h   ( e r r o r )   { 
                         c o n s o l e . e r r o r ( ' E r r o r   f e t c h i n g   H i j r i   d a t e : ' ,   e r r o r ) ; 
                         t h i s . c u r r e n t H i j r i D a t e   =   ' L o a d i n g   f a i l e d ' ; 
                 } 
         } 
 
         r e n d e r M o n t h s ( )   { 
                 c o n s t   c u r r e n t M o n t h   =   n e w   D a t e ( ) . g e t M o n t h ( ) ; 
                 
                 r e t u r n   t h i s . i s l a m i c M o n t h s . m a p ( ( m o n t h ,   i n d e x )   = >   ` 
                         < d i v   c l a s s = " m o n t h - c a r d   $ { i n d e x   = = =   c u r r e n t M o n t h   ?   ' c u r r e n t '   :   ' ' } "   o n c l i c k = " a p p . s e l e c t M o n t h ( $ { i n d e x } ) " > 
                                 < d i v   c l a s s = " m o n t h - n a m e " > $ { m o n t h . n a m e } < / d i v > 
                                 < d i v   c l a s s = " m o n t h - a r a b i c " > $ { m o n t h . a r a b i c } < / d i v > 
                                 < d i v   c l a s s = " m o n t h - d a y s " > $ { m o n t h . d a y s }   d a y s < / d i v > 
                                 < d i v   s t y l e = " f o n t - s i z e :   0 . 8 r e m ;   m a r g i n - t o p :   5 p x ; " > $ { m o n t h . s i g n i f i c a n c e . s u b s t r i n g ( 0 ,   3 0 ) } . . . < / d i v > 
                         < / d i v > 
                 ` ) . j o i n ( ' ' ) ; 
         } 
 
         r e n d e r E v e n t s ( )   { 
                 r e t u r n   t h i s . i s l a m i c E v e n t s . m a p ( e v e n t   = >   ` 
                         < d i v   c l a s s = " e v e n t - c a r d " > 
                                 < d i v   c l a s s = " e v e n t - d a t e " > 
                                         < d i v   c l a s s = " e v e n t - d a y " > $ { e v e n t . d a y } < / d i v > 
                                         < d i v   c l a s s = " e v e n t - m o n t h " > $ { e v e n t . m o n t h } < / d i v > 
                                 < / d i v > 
                                 < d i v   c l a s s = " e v e n t - i n f o " > 
                                         < d i v   c l a s s = " e v e n t - n a m e " > $ { e v e n t . n a m e } < / d i v > 
                                         < d i v   c l a s s = " e v e n t - d e s c " > $ { e v e n t . d e s c } < / d i v > 
                                         < d i v   c l a s s = " e v e n t - s i g n i f i c a n c e " > $ { e v e n t . s i g n i f i c a n c e } < / d i v > 
                                 < / d i v > 
                         < / d i v > 
                 ` ) . j o i n ( ' ' ) ; 
         } 
 
         a s y n c   c o n v e r t G r e g o r i a n T o H i j r i ( )   { 
                 c o n s t   d a y   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' g r e g D a y ' ) . v a l u e ; 
                 c o n s t   m o n t h   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' g r e g M o n t h ' ) . v a l u e ; 
                 c o n s t   y e a r   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' g r e g Y e a r ' ) . v a l u e ; 
                 
                 t r y   { 
                         c o n s t   r e s p o n s e   =   a w a i t   f e t c h ( ` h t t p s : / / a p i . a l a d h a n . c o m / v 1 / g T o H / $ { d a y } / $ { m o n t h } / $ { y e a r } ` ) ; 
                         c o n s t   d a t a   =   a w a i t   r e s p o n s e . j s o n ( ) ; 
                         
                         i f   ( d a t a . c o d e   = = =   2 0 0 )   { 
                                 c o n s t   h i j r i   =   d a t a . d a t a . h i j r i ; 
                                 d o c u m e n t . g e t E l e m e n t B y I d ( ' h i j r i R e s u l t ' ) . i n n e r H T M L   =   
                                         ` $ { h i j r i . d a y }   $ { h i j r i . m o n t h . e n }   $ { h i j r i . y e a r }   A H ` ; 
                         }   e l s e   { 
                                 d o c u m e n t . g e t E l e m e n t B y I d ( ' h i j r i R e s u l t ' ) . i n n e r H T M L   =   ' C o n v e r s i o n   f a i l e d ' ; 
                         } 
                 }   c a t c h   ( e r r o r )   { 
                         d o c u m e n t . g e t E l e m e n t B y I d ( ' h i j r i R e s u l t ' ) . i n n e r H T M L   =   ' E r r o r   c o n v e r t i n g   d a t e ' ; 
                 } 
         } 
 
         a s y n c   c o n v e r t H i j r i T o G r e g o r i a n ( )   { 
                 c o n s t   d a y   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' h i j r i D a y ' ) . v a l u e ; 
                 c o n s t   m o n t h   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' h i j r i M o n t h ' ) . v a l u e ; 
                 c o n s t   y e a r   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' h i j r i Y e a r ' ) . v a l u e ; 
                 
                 t r y   { 
                         c o n s t   r e s p o n s e   =   a w a i t   f e t c h ( ` h t t p s : / / a p i . a l a d h a n . c o m / v 1 / h T o G / $ { d a y } / $ { m o n t h } / $ { y e a r } ` ) ; 
                         c o n s t   d a t a   =   a w a i t   r e s p o n s e . j s o n ( ) ; 
                         
                         i f   ( d a t a . c o d e   = = =   2 0 0 )   { 
                                 c o n s t   g r e g o r i a n   =   d a t a . d a t a . g r e g o r i a n ; 
                                 d o c u m e n t . g e t E l e m e n t B y I d ( ' g r e g R e s u l t ' ) . i n n e r H T M L   =   
                                         ` $ { g r e g o r i a n . d a y }   $ { g r e g o r i a n . m o n t h . e n }   $ { g r e g o r i a n . y e a r } ` ; 
                         }   e l s e   { 
                                 d o c u m e n t . g e t E l e m e n t B y I d ( ' g r e g R e s u l t ' ) . i n n e r H T M L   =   ' C o n v e r s i o n   f a i l e d ' ; 
                         } 
                 }   c a t c h   ( e r r o r )   { 
                         d o c u m e n t . g e t E l e m e n t B y I d ( ' g r e g R e s u l t ' ) . i n n e r H T M L   =   ' E r r o r   c o n v e r t i n g   d a t e ' ; 
                 } 
         } 
 
         s e l e c t M o n t h ( i n d e x )   { 
                 d o c u m e n t . q u e r y S e l e c t o r A l l ( ' . m o n t h - c a r d ' ) . f o r E a c h ( ( c a r d ,   i )   = >   { 
                         c a r d . c l a s s L i s t . t o g g l e ( ' c u r r e n t ' ,   i   = = =   i n d e x ) ; 
                 } ) ; 
                 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' c u r r e n t M o n t h D i s p l a y ' ) . t e x t C o n t e n t   =   
                         ` $ { t h i s . i s l a m i c M o n t h s [ i n d e x ] . n a m e }   1 4 4 6 ` ; 
         } 
 
         p r e v i o u s M o n t h ( )   { 
                 c o n s t   c u r r e n t D i s p l a y   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' c u r r e n t M o n t h D i s p l a y ' ) . t e x t C o n t e n t ; 
                 c o n s t   m o n t h N a m e   =   c u r r e n t D i s p l a y . s p l i t ( '   ' ) [ 0 ] ; 
                 c o n s t   c u r r e n t I n d e x   =   t h i s . i s l a m i c M o n t h s . f i n d I n d e x ( m   = >   m . n a m e   = = =   m o n t h N a m e ) ; 
                 
                 i f   ( c u r r e n t I n d e x   >   0 )   { 
                         t h i s . s e l e c t M o n t h ( c u r r e n t I n d e x   -   1 ) ; 
                 } 
         } 
 
         n e x t M o n t h ( )   { 
                 c o n s t   c u r r e n t D i s p l a y   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' c u r r e n t M o n t h D i s p l a y ' ) . t e x t C o n t e n t ; 
                 c o n s t   m o n t h N a m e   =   c u r r e n t D i s p l a y . s p l i t ( '   ' ) [ 0 ] ; 
                 c o n s t   c u r r e n t I n d e x   =   t h i s . i s l a m i c M o n t h s . f i n d I n d e x ( m   = >   m . n a m e   = = =   m o n t h N a m e ) ; 
                 
                 i f   ( c u r r e n t I n d e x   <   t h i s . i s l a m i c M o n t h s . l e n g t h   -   1 )   { 
                         t h i s . s e l e c t M o n t h ( c u r r e n t I n d e x   +   1 ) ; 
                 } 
         } 
 
         c l o s e C a l e n d a r M o d a l ( )   { 
                 c o n s t   m o d a l   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' c a l e n d a r M o d a l ' ) ; 
                 i f   ( m o d a l )   m o d a l . r e m o v e ( ) ; 
         } 
 
         / /   U p d a t e   r e n d e r T o o l s   t o   i n c l u d e   I s l a m i c   C a l e n d a r 
         r e n d e r T o o l s ( )   { 
                 c o n s t   t o o l s   =   [ 
                         {   n a m e :   ' Q u r \ ' a n ' ,   i c o n :   ' f a - q u r a n ' ,   c o l o r :   ' # 0 c 3 b 2 e ' ,   a c t i o n :   ' a p p . s h o w A u d i o R e c i t a t i o n s ( ) '   } , 
                         {   n a m e :   ' H a d i t h ' ,   i c o n :   ' f a - b o o k ' ,   c o l o r :   ' # 1 a 5 c 4 8 ' ,   a c t i o n :   ' w i n d o w . o p e n ( " h t t p s : / / s u n n a h . c o m " ,   " _ b l a n k " ) '   } , 
                         {   n a m e :   ' D u a s ' ,   i c o n :   ' f a - p r a y i n g - h a n d s ' ,   c o l o r :   ' # d 4 a f 3 7 ' ,   a c t i o n :   ' a p p . s h o w A u d i o R e c i t a t i o n s ( ) '   } , 
                         {   n a m e :   ' M o s q u e   F i n d e r ' ,   i c o n :   ' f a - m o s q u e ' ,   c o l o r :   ' # b 8 8 6 0 b ' ,   a c t i o n :   ' a p p . s h o w M o s q u e F i n d e r ( ) '   } , 
                         {   n a m e :   ' I s l a m i c   C a l e n d a r ' ,   i c o n :   ' f a - c a l e n d a r - a l t ' ,   c o l o r :   ' # 0 c 3 b 2 e ' ,   a c t i o n :   ' a p p . s h o w I s l a m i c C a l e n d a r ( ) '   } , 
                         {   n a m e :   ' P r a y e r   T i m e s ' ,   i c o n :   ' f a - c l o c k ' ,   c o l o r :   ' # 1 a 5 c 4 8 ' ,   a c t i o n :   ' a p p . s h o w P r a y e r T i m e s ( ) '   } , 
                         {   n a m e :   ' T a s b i h ' ,   i c o n :   ' f a - p r a y ' ,   c o l o r :   ' # 8 b 4 5 1 3 ' ,   a c t i o n :   ' a p p . s h o w T a s b i h ( ) '   } 
                 ] ; 
                 
                 r e t u r n   t o o l s . m a p ( t o o l   = >   ` 
                         < d i v   c l a s s = " t o o l - c a r d "   s t y l e = " b a c k g r o u n d :   $ { t o o l . c o l o r } 2 0 ;   b o r d e r - c o l o r :   $ { t o o l . c o l o r } "   o n c l i c k = " $ { t o o l . a c t i o n } " > 
                                 < i   c l a s s = " f a s   $ { t o o l . i c o n }   t o o l - i c o n "   s t y l e = " c o l o r :   $ { t o o l . c o l o r } " > < / i > 
                                 < s p a n > $ { t o o l . n a m e } < / s p a n > 
                         < / d i v > 
                 ` ) . j o i n ( ' ' ) ; 
         }  
 