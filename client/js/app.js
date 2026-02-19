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
                                                         ' P r o p h e t   M u h a m m a d   ��  i n   h i s   F i n a l   S e r m o n ' , 
                                                         ' U m a r   i b n   a l - K h a t t a b ' , 
                                                         ' A l i   i b n   A b i   T a l i b ' 
                                                 ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' P r o p h e t   M u h a m m a d   ��  s a i d   t h i s   i n   h i s   F i n a l   S e r m o n . ' 
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
                                                 q u e s t i o n :   ' W h a t   d i d   P r o p h e t   M u h a m m a d   ��  s a y   a b o u t   F a t i m a h   i f   s h e   s t o l e ? ' , 
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
                                                         ' P r o p h e t   M u h a m m a d   ��  i n   h i s   F i n a l   S e r m o n ' , 
                                                         ' U m a r   i b n   a l - K h a t t a b ' , 
                                                         ' A l i   i b n   A b i   T a l i b ' 
                                                 ] , 
                                                 c o r r e c t :   1 , 
                                                 e x p l a n a t i o n :   ' P r o p h e t   M u h a m m a d   ��  s a i d   t h i s   i n   h i s   F i n a l   S e r m o n . ' 
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
                                                 q u e s t i o n :   ' W h a t   d i d   P r o p h e t   M u h a m m a d   ��  s a y   a b o u t   F a t i m a h   i f   s h e   s t o l e ? ' , 
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