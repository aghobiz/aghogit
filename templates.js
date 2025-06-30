/**
 * UI 템플릿을 담당하는 모듈
 * 버전: 1.0.2 (캐시 갱신용)
 */
const Templates = {
    /**
     * 신청자/관리자 선택 화면 템플릿
     * @returns {string} HTML 문자열
     */
    loginTemplate: function() {
        return `
            <div class="login-container">
                <h1 class="login-title">연차관리 시스템</h1>
                <div class="login-buttons">
                    <button id="btn-employee-login" class="btn login-btn">전문연구요원 로그인</button>
                    <button id="btn-admin-login" class="btn login-btn">관리자 로그인</button>
                </div>
            </div>
        `;
    },

    /**
     * 신청자 대시보드 화면 템플릿
     * @param {Object} userData 사용자 데이터
     * @returns {string} HTML 문자열
     */
    dashboardTemplate: function(userData) {
        // 시간을 '일'과 '시간'으로 변환하는 함수
        const formatHours = (hours) => {
            const days = Math.floor(hours / 8);
            const remainingHours = hours % 8;
            
            if (days > 0 && remainingHours > 0) {
                return `${days}일 ${remainingHours}시간`;
            } else if (days > 0 || hours === 0) {
                return `${days}일`;
            } else {
                return `${hours}시간`;
            }
        };

        return `
            <div class="dashboard">
                <div class="header">
                    <h1>${userData.name}님의 연차 현황</h1>
                </div>
                
                <div class="card-container">
                    <div class="card">
                        <h3>총 연차</h3>
                        <div class="value">${formatHours(userData.totalDays * 8)}</div>
                    </div>
                    <div class="card">
                        <h3>사용 연차</h3>
                        <div class="value">${formatHours(userData.usedDays * 8)}</div>
                    </div>
                    <div class="card">
                        <h3>잔여 연차</h3>
                        <div class="value">${formatHours(userData.remainingDays * 8)}</div>
                    </div>
                    <div class="card">
                        <h3>누적 병가</h3>
                        <div class="value">${formatHours(userData.sickDays * 8)}</div>
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button id="btn-show-application-form" class="btn">신청하기</button>
                    <button id="btn-show-my-applications" class="btn btn-secondary">내 신청 내역</button>
                    <button id="btn-logout" class="btn btn-secondary">로그아웃</button>
                </div>
            </div>
        `;
    },

    /**
     * 신청 폼 화면 템플릿
     * @returns {string} HTML 문자열
     */
    applicationFormTemplate: function() {
        // 업무 시간 옵션 생성 (09~18시)
        const generateTimeOptions = () => {
            let options = '';
            for (let i = 9; i <= 18; i++) {
                const hour = String(i).padStart(2, '0');
                options += `<option value="${hour}:00">${hour}:00</option>`;
            }
            return options;
        };

        return `
            <div class="application-form">
                <div class="header">
                    <h1>연차/출장/병가 신청</h1>
                </div>
                
                <form id="form-application">
                    <div class="form-group">
                        <label for="application-type">신청 종류</label>
                        <select id="application-type" class="form-control" required>
                            <option value="">선택하세요</option>
                            <option value="연차">연차</option>
                            <option value="출장">출장</option>
                            <option value="병가">병가</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="start-date">시작일</label>
                        <input type="date" id="start-date" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="start-time">시작 시간</label>
                        <select id="start-time" class="form-control" required>
                            ${generateTimeOptions()}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="end-date">종료일</label>
                        <input type="date" id="end-date" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="end-time">종료 시간</label>
                        <select id="end-time" class="form-control" required>
                            ${generateTimeOptions()}
                        </select>
                    </div>
                    
                    <div id="reason-group" class="form-group">
                        <label for="reason-select">사유</label>
                        <select id="reason-select" class="form-control" required>
                            <option value="">선택하세요</option>
                            <option value="하루연차">하루연차</option>
                            <option value="오전반차">오전반차</option>
                            <option value="오후반차">오후반차</option>
                            <option value="경조휴가">경조휴가</option>
                            <option value="지각">지각</option>
                            <option value="기타">기타 (직접 입력)</option>
                        </select>
                    </div>
                    
                    <div id="custom-reason-group" class="form-group" style="display: none;">
                        <label for="application-reason">상세 사유</label>
                        <textarea id="application-reason" class="form-control" rows="3"></textarea>
                    </div>
                    
                    <div id="sick-reason-group" class="form-group" style="display: none;">
                        <label for="sick-reason">병가 사유</label>
                        <textarea id="sick-reason" class="form-control" rows="3" placeholder="병가 사유를 상세히 입력해주세요"></textarea>
                    </div>
                    
                    <div id="destination-group" class="form-group" style="display: none;">
                        <label for="application-destination">출장지</label>
                        <input type="text" id="application-destination" class="form-control">
                    </div>
                    
                    <div id="trip-content-group" class="form-group" style="display: none;">
                        <label for="trip-content">출장 내용</label>
                        <textarea id="trip-content" class="form-control" rows="3"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>사용 시간</label>
                        <div id="calculated-hours" class="form-control" style="background-color: #f8f8f8;">계산 중...</div>
                    </div>
                    
                    <div class="action-buttons">
                        <button type="submit" class="btn">제출하기</button>
                        <button type="button" id="btn-back-to-dashboard" class="btn btn-secondary">돌아가기</button>
                    </div>
                </form>
            </div>
        `;
    },

    /**
     * 내 신청 내역 화면 템플릿
     * @param {Array} applications 신청 내역 배열
     * @returns {string} HTML 문자열
     */
    myApplicationsTemplate: function(applications) {
        // 날짜 포맷 함수
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
        };

        // 상태에 따른 배지 색상 클래스
        const getStatusClass = (status) => {
            switch (status) {
                case '승인': return 'status-approved';
                case '반려': return 'status-rejected';
                case '대기중': return 'status-pending';
                case '취소 요청중': return 'status-cancel-requested';
                case '취소됨': return 'status-cancelled';
                default: return '';
            }
        };

        // 테이블 행 생성
        const createTableRows = () => {
            if (applications.length === 0) {
                return `<tr><td colspan="7" style="text-align: center;">신청 내역이 없습니다.</td></tr>`;
            }
            
            // 현재 날짜
            const today = new Date();
            today.setHours(0, 0, 0, 0); // 오늘 자정으로 설정하여 날짜만 비교

            return applications.map(app => {
                // 시작일이 오늘 이후인지 확인 (취소 요청 가능 여부)
                const startDate = new Date(app.startDate);
                startDate.setHours(0, 0, 0, 0); // 시작일 자정으로 설정하여 날짜만 비교
                const canCancel = startDate >= today;
                
                // 취소 요청이 반려된 경우 특별 표시
                let statusDisplay = app.status;
                let statusClass = getStatusClass(app.status);
                
                if (app.cancelRejected && app.status === '승인') {
                    statusDisplay = '승인 (취소 요청 반려됨)';
                    statusClass = 'status-cancel-rejected';
                }
                
                return `
                    <tr>
                        <td>${app.type}</td>
                        <td>${formatDate(app.startDate)} ~ ${formatDate(app.endDate)}</td>
                        <td>${app.hours}시간</td>
                        <td>${app.reason}</td>
                        <td>${app.destination || '-'}</td>
                        <td><span class="status-badge ${statusClass}">${statusDisplay}</span></td>
                        <td>
                            ${app.status === '승인' && canCancel && !app.cancelRejected ? 
                              `<button class="btn btn-danger btn-sm btn-request-cancel" data-id="${app.id}">취소 요청</button>` : 
                              app.status === '승인' && !canCancel ?
                              `<span class="text-muted">취소 불가</span>` :
                              app.status === '승인' && app.cancelRejected ?
                              `<button class="btn btn-secondary btn-sm btn-show-reject-reason" data-reason="${app.rejectReason}">반려 사유 보기</button>` :
                              app.status === '대기중' ?
                              `<button class="btn btn-warning btn-sm btn-cancel" data-id="${app.id}">취소</button>` :
                              app.status === '반려' && app.rejectReason ? 
                              `<button class="btn btn-secondary btn-sm btn-show-reject-reason" data-reason="${app.rejectReason}">반려 사유 보기</button>` : 
                              ''}
                        </td>
                    </tr>
                `;
            }).join('');
        };

        return `
            <div class="my-applications">
                <div class="header">
                    <h1>내 신청 내역</h1>
                </div>
                
                <table class="table">
                    <thead>
                        <tr>
                            <th>종류</th>
                            <th>기간</th>
                            <th>사용 시간</th>
                            <th>사유</th>
                            <th>출장지</th>
                            <th>상태</th>
                            <th>액션</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${createTableRows()}
                    </tbody>
                </table>
                
                <div class="action-buttons">
                    <button id="btn-back-to-dashboard" class="btn btn-secondary">대시보드로 돌아가기</button>
                </div>
                
                <!-- 반려 사유 모달 -->
                <div id="reject-reason-modal" class="modal" style="display: none;">
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <h2>반려 사유</h2>
                        <div id="reject-reason-text" class="modal-body"></div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * 관리자: 대시보드 화면 템플릿
     * @param {Array} pendingApplications 처리 대기중인 신청 내역 배열
     * @returns {string} HTML 문자열
     */
    adminDashboardTemplate: function(pendingApplications) {
        // 날짜 포맷 함수
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
        };

        // 테이블 행 생성
        const createTableRows = () => {
            if (pendingApplications.length === 0) {
                return `<tr><td colspan="8" style="text-align: center;">처리할 신청이 없습니다.</td></tr>`;
            }

            return pendingApplications.map(app => {
                if (app.isCancelRequest) {
                    // 취소 요청인 경우
                    return `
                    <tr>
                        <td>${app.userName}</td>
                        <td>${app.type}</td>
                        <td>${formatDate(app.startDate)} ~ ${formatDate(app.endDate)}</td>
                        <td>${app.hours}시간</td>
                        <td>${app.reason}</td>
                        <td>${app.destination || '-'}</td>
                        <td><span class="status-badge status-cancel-requested">취소 요청중</span></td>
                        <td>${app.cancelReason || '-'}</td>
                        <td>
                            <button class="btn btn-primary btn-sm btn-approve" data-id="${app.id}">승인</button>
                            <button class="btn btn-danger btn-sm btn-reject" data-id="${app.id}">반려</button>
                        </td>
                    </tr>
                `;
                } else {
                    // 일반 신청인 경우
                    return `
                    <tr>
                        <td>${app.userName}</td>
                        <td>${app.type}</td>
                        <td>${formatDate(app.startDate)} ~ ${formatDate(app.endDate)}</td>
                        <td>${app.hours}시간</td>
                        <td>${app.reason}</td>
                        <td>${app.destination || '-'}</td>
                        <td><span class="status-badge status-pending">대기중</span></td>
                        <td>-</td>
                        <td>
                            <button class="btn btn-primary btn-sm btn-approve" data-id="${app.id}">승인</button>
                            <button class="btn btn-danger btn-sm btn-reject" data-id="${app.id}">반려</button>
                        </td>
                    </tr>
                `;
                }
            }).join('');
        };

        return `
            <!-- 햄버거 버튼 -->
            <button class="hamburger-btn" id="hamburger-btn">
                <div class="hamburger-icon"></div>
            </button>
            
            <!-- 사이드바 오버레이 -->
            <div class="sidebar-overlay" id="sidebar-overlay"></div>
            
            <div class="admin-container">
                <nav class="sidebar" id="sidebar">
                    <div class="sidebar-logo">관리자</div>
                    <div class="sidebar-menu">
                        <button class="sidebar-menu-item active" id="sidebar-admin-pending"><span class="sidebar-icon">📋</span>처리할 신청</button>
                        <button class="sidebar-menu-item" id="sidebar-admin-all-applications"><span class="sidebar-icon">📑</span>전체 신청 내역</button>
                        <button class="sidebar-menu-item" id="sidebar-admin-create-application"><span class="sidebar-icon">📝</span>신청 등록하기</button>
                        <button class="sidebar-menu-item" id="sidebar-admin-duty-status"><span class="sidebar-icon">👤</span>개인별 복무상황부</button>
                    </div>
                    <div style="flex:1;"></div>
                    <button class="sidebar-menu-item" id="sidebar-admin-logout" style="margin-top:auto;"><span class="sidebar-icon">🚪</span>로그아웃</button>
                </nav>
                <div class="admin-content">
                    <div class="admin-dashboard">
                        <div class="header"><h1>관리자 대시보드</h1></div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>신청자</th>
                                    <th>종류</th>
                                    <th>기간</th>
                                    <th>사용 시간</th>
                                    <th>사유</th>
                                    <th>출장지</th>
                                    <th>상태</th>
                                    <th>취소 사유</th>
                                    <th>액션</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${createTableRows()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * 관리자: 전체 신청 내역 화면 템플릿
     * @param {Array} allApplications 모든 신청 내역 배열
     * @returns {string} HTML 문자열
     */
    adminAllApplicationsTemplate: function(allApplications) {
        // 날짜 포맷 함수
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
        };

        // 상태에 따른 배지 색상 클래스
        const getStatusClass = (status) => {
            switch (status) {
                case '승인': return 'status-approved';
                case '반려': return 'status-rejected';
                case '대기중': return 'status-pending';
                case '취소 요청중': return 'status-cancel-requested';
                case '취소됨': return 'status-cancelled';
                default: return '';
            }
        };

        // 테이블 행 생성
        const createTableRows = () => {
            if (allApplications.length === 0) {
                return `<tr><td colspan="9" style="text-align: center;">신청 내역이 없습니다.</td></tr>`;
            }

            return allApplications.map(app => {
                // 취소 요청이 반려된 경우 특별 표시
                let statusDisplay = app.status;
                let statusClass = getStatusClass(app.status);
                
                if (app.cancelRejected && app.status === '승인') {
                    statusDisplay = '승인 (취소 요청 반려됨)';
                    statusClass = 'status-cancel-rejected';
                }
                
                return `
                <tr>
                    <td>${app.userName}</td>
                    <td>${app.type}</td>
                    <td>${formatDate(app.startDate)} ~ ${formatDate(app.endDate)}</td>
                    <td>${app.hours}시간</td>
                    <td>${app.reason}</td>
                    <td>${app.destination || '-'}</td>
                    <td><span class="status-badge ${statusClass}">${statusDisplay}</span></td>
                    <td>${app.status === '취소 요청중' || app.cancelRejected ? app.cancelReason || '-' : '-'}</td>
                    <td>
                        ${(app.status === '반려' || (app.status === '승인' && app.cancelRejected)) && app.rejectReason ? 
                          `<button class="btn btn-secondary btn-sm btn-show-reject-reason" data-reason="${app.rejectReason}">반려 사유 보기</button>` : 
                          ''}
                    </td>
                </tr>
            `}).join('');
        };

        return `
            <!-- 햄버거 버튼 -->
            <button class="hamburger-btn" id="hamburger-btn">
                <div class="hamburger-icon"></div>
            </button>
            
            <!-- 사이드바 오버레이 -->
            <div class="sidebar-overlay" id="sidebar-overlay"></div>
            
            <div class="admin-container">
                <nav class="sidebar" id="sidebar">
                    <div class="sidebar-logo">관리자</div>
                    <div class="sidebar-menu">
                        <button class="sidebar-menu-item" id="sidebar-admin-pending"><span class="sidebar-icon">📋</span>처리할 신청</button>
                        <button class="sidebar-menu-item active" id="sidebar-admin-all-applications"><span class="sidebar-icon">📑</span>전체 신청 내역</button>
                        <button class="sidebar-menu-item" id="sidebar-admin-create-application"><span class="sidebar-icon">📝</span>신청 등록하기</button>
                        <button class="sidebar-menu-item" id="sidebar-admin-duty-status"><span class="sidebar-icon">👤</span>개인별 복무상황부</button>
                    </div>
                    <div style="flex:1;"></div>
                    <button class="sidebar-menu-item" id="sidebar-admin-logout" style="margin-top:auto;"><span class="sidebar-icon">🚪</span>로그아웃</button>
                </nav>
                <div class="admin-content">
                    <div class="admin-all-applications">
                        <div class="header">
                            <h1>전체 신청 내역</h1>
                        </div>
                        
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>신청자</th>
                                    <th>종류</th>
                                    <th>기간</th>
                                    <th>사용 시간</th>
                                    <th>사유</th>
                                    <th>출장지</th>
                                    <th>상태</th>
                                    <th>취소 사유</th>
                                    <th>액션</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${createTableRows()}
                            </tbody>
                        </table>
                        
                        <!-- 반려 사유 모달 -->
                        <div id="reject-reason-modal" class="modal" style="display: none;">
                            <div class="modal-content">
                                <span class="close">&times;</span>
                                <h2>반려 사유</h2>
                                <div id="reject-reason-text" class="modal-body"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * 관리자: 신청 등록 폼 템플릿
     * @returns {string} HTML 문자열
     */
    adminApplicationFormTemplate: function() {
        // 시간 옵션 생성 함수
        const generateTimeOptions = () => {
            let options = '';
            for (let hour = 9; hour <= 18; hour++) {
                options += `<option value="${String(hour).padStart(2, '0')}:00">${String(hour).padStart(2, '0')}:00</option>`;
            }
            return options;
        };

        return `
            <!-- 햄버거 버튼 -->
            <button class="hamburger-btn" id="hamburger-btn">
                <div class="hamburger-icon"></div>
            </button>
            
            <!-- 사이드바 오버레이 -->
            <div class="sidebar-overlay" id="sidebar-overlay"></div>
            
            <div class="admin-container">
                <nav class="sidebar" id="sidebar">
                    <div class="sidebar-logo">관리자</div>
                    <div class="sidebar-menu">
                        <button class="sidebar-menu-item" id="sidebar-admin-pending"><span class="sidebar-icon">📋</span>처리할 신청</button>
                        <button class="sidebar-menu-item" id="sidebar-admin-all-applications"><span class="sidebar-icon">📑</span>전체 신청 내역</button>
                        <button class="sidebar-menu-item active" id="sidebar-admin-create-application"><span class="sidebar-icon">📝</span>신청 등록하기</button>
                        <button class="sidebar-menu-item" id="sidebar-admin-duty-status"><span class="sidebar-icon">👤</span>개인별 복무상황부</button>
                    </div>
                    <div style="flex:1;"></div>
                    <button class="sidebar-menu-item" id="sidebar-admin-logout" style="margin-top:auto;"><span class="sidebar-icon">🚪</span>로그아웃</button>
                </nav>
                <div class="admin-content">
                    <div class="admin-application-form">
                        <div class="header">
                            <h1>관리자: 신청 등록</h1>
                        </div>
                        
                        <form id="admin-application-form">
                            <div class="form-group">
                                <label for="admin-application-user">신청자 이름</label>
                                <input type="text" id="admin-application-user" class="form-control" placeholder="신청자 이름을 입력하세요" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="admin-application-type">신청 종류</label>
                                <select id="admin-application-type" class="form-control" required>
                                    <option value="">선택하세요</option>
                                    <option value="연차">연차</option>
                                    <option value="출장">출장</option>
                                    <option value="병가">병가</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="admin-start-date">시작일</label>
                                <input type="date" id="admin-start-date" class="form-control" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="admin-start-time">시작 시간</label>
                                <select id="admin-start-time" class="form-control" required>
                                    ${generateTimeOptions()}
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="admin-end-date">종료일</label>
                                <input type="date" id="admin-end-date" class="form-control" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="admin-end-time">종료 시간</label>
                                <select id="admin-end-time" class="form-control" required>
                                    ${generateTimeOptions()}
                                </select>
                            </div>
                            
                            <div id="admin-reason-group" class="form-group">
                                <label for="admin-reason-select">사유</label>
                                <select id="admin-reason-select" class="form-control" required>
                                    <option value="">선택하세요</option>
                                    <option value="하루연차">하루연차</option>
                                    <option value="오전반차">오전반차</option>
                                    <option value="오후반차">오후반차</option>
                                    <option value="경조휴가">경조휴가</option>
                                    <option value="지각">지각</option>
                                    <option value="기타">기타 (직접 입력)</option>
                                </select>
                            </div>
                            
                            <div id="admin-custom-reason-group" class="form-group" style="display: none;">
                                <label for="admin-application-reason">상세 사유</label>
                                <textarea id="admin-application-reason" class="form-control" rows="3"></textarea>
                            </div>
                            
                            <div id="admin-sick-reason-group" class="form-group" style="display: none;">
                                <label for="admin-sick-reason">병가 사유</label>
                                <textarea id="admin-sick-reason" class="form-control" rows="3" placeholder="병가 사유를 상세히 입력해주세요"></textarea>
                            </div>
                            
                            <div id="admin-destination-group" class="form-group" style="display: none;">
                                <label for="admin-application-destination">출장지</label>
                                <input type="text" id="admin-application-destination" class="form-control">
                            </div>
                            
                            <div id="admin-trip-content-group" class="form-group" style="display: none;">
                                <label for="admin-trip-content">출장 내용</label>
                                <textarea id="admin-trip-content" class="form-control" rows="3"></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>사용 시간</label>
                                <div id="admin-calculated-hours" class="form-control" style="background-color: #f8f8f8;">계산 중...</div>
                            </div>
                            
                            <div class="action-buttons">
                                <button type="submit" id="admin-submit-button" class="btn btn-primary">등록하기</button>
                                <button type="button" id="btn-admin-back" class="btn btn-secondary">돌아가기</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * 관리자: 사용자 선택 화면 템플릿
     * @param {Array} userList 사용자 목록
     * @returns {string} HTML 문자열
     */
    adminUserSelectTemplate: function(userList) {
        // 사용자 목록 생성
        const createUserList = () => {
            if (userList.length === 0) {
                return `<div class="no-users">사용자가 없습니다.</div>`;
            }

            return userList.map(user => `
                <div class="user-card" data-user-id="${user.id}">
                    <div class="user-name">${user.name}</div>
                    <div class="user-info">
                        <span class="department">${user.department}</span>
                        <span class="join-date">입사일: ${user.joinDate}</span>
                    </div>
                </div>
            `).join('');
        };

        return `
            <!-- 햄버거 버튼 -->
            <button class="hamburger-btn" id="hamburger-btn">
                <div class="hamburger-icon"></div>
            </button>
            
            <!-- 사이드바 오버레이 -->
            <div class="sidebar-overlay" id="sidebar-overlay"></div>
            
            <div class="admin-container">
                <nav class="sidebar" id="sidebar">
                    <div class="sidebar-logo">관리자</div>
                    <div class="sidebar-menu">
                        <button class="sidebar-menu-item" id="sidebar-admin-pending"><span class="sidebar-icon">📋</span>처리할 신청</button>
                        <button class="sidebar-menu-item" id="sidebar-admin-all-applications"><span class="sidebar-icon">📑</span>전체 신청 내역</button>
                        <button class="sidebar-menu-item" id="sidebar-admin-create-application"><span class="sidebar-icon">📝</span>신청 등록하기</button>
                        <button class="sidebar-menu-item active" id="sidebar-admin-duty-status"><span class="sidebar-icon">👤</span>개인별 복무상황부</button>
                    </div>
                    <div style="flex:1;"></div>
                    <button class="sidebar-menu-item" id="sidebar-admin-logout" style="margin-top:auto;"><span class="sidebar-icon">🚪</span>로그아웃</button>
                </nav>
                <div class="admin-content">
                    <div class="admin-user-select">
                        <div class="header">
                            <h1>개인별 복무상황부</h1>
                            <p>조회할 사용자를 선택하세요</p>
                        </div>
                        
                        <div class="user-list-container">
                            ${createUserList()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * 관리자: 개인별 복무상황부 템플릿
     * @param {Object} dutyStatus 복무상황부 데이터
     * @returns {string} HTML 문자열
     */
    adminDutyStatusTemplate: function(dutyStatus) {
        const { userInfo, applications } = dutyStatus;
        
        // 날짜 포맷 함수
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        };

        // 시간 포맷 함수
        const formatTime = (dateString) => {
            const date = new Date(dateString);
            return `${String(date.getHours()).padStart(2, '0')}:00`;
        };
        
        // 시간을 일수로 변환하는 함수 (8시간 = 1일)
        const formatDays = (hours) => {
            const days = Math.floor(hours / 8);
            const remainingHours = hours % 8;
            
            if (days > 0 && remainingHours > 0) {
                return `${days}일 ${remainingHours}시간`;
            } else if (days > 0 || hours === 0) {
                return `${days}일`;
            } else {
                return `${hours}시간`;
            }
        };
        
        // 누계 계산
        const total = { 연차: 0, 출장: 0, 병가: 0 };
        applications.forEach(app => {
            if (app.status === '승인') {
                if (total[app.type] !== undefined) {
                    total[app.type] += app.hours;
                }
            }
        });
        
        // 상태에 따른 배지 색상 클래스
        const getStatusClass = (status) => {
            switch (status) {
                case '승인': return 'status-approved';
                case '반려': return 'status-rejected';
                case '대기중': return 'status-pending';
                case '취소 요청중': return 'status-cancel-requested';
                case '취소됨': return 'status-cancelled';
                default: return '';
            }
        };

        // 신청 내역 테이블 행 생성
        const createTableRows = () => {
            if (applications.length === 0) {
                return `<tr><td colspan="6" style="text-align: center;">내역이 없습니다.</td></tr>`;
            }

            return applications.map(app => {
                const startDate = formatDate(app.startDate);
                const endDate = formatDate(app.endDate);
                const startTime = formatTime(app.startDate);
                const endTime = formatTime(app.endDate);
                
                const dateDisplay = startDate === endDate
                    ? `${startDate} (${startTime}~${endTime})`
                    : `${startDate} ${startTime} ~ ${endDate} ${endTime}`;
                
                return `
                <tr>
                    <td>${app.type}</td>
                    <td>${dateDisplay}</td>
                    <td>${formatDays(app.hours)}</td>
                    <td>${app.reason}</td>
                    <td>${app.destination || '-'}</td>
                    <td><span class="status-badge ${getStatusClass(app.status)}">${app.status}</span></td>
                </tr>
            `}).join('');
        };

        return `
            <!-- 햄버거 버튼 -->
            <button class="hamburger-btn" id="hamburger-btn">
                <div class="hamburger-icon"></div>
            </button>
            
            <!-- 사이드바 오버레이 -->
            <div class="sidebar-overlay" id="sidebar-overlay"></div>
            
            <div class="admin-container">
                <nav class="sidebar" id="sidebar">
                    <div class="sidebar-logo">관리자</div>
                    <div class="sidebar-menu">
                        <button class="sidebar-menu-item" id="sidebar-admin-pending"><span class="sidebar-icon">📋</span>처리할 신청</button>
                        <button class="sidebar-menu-item" id="sidebar-admin-all-applications"><span class="sidebar-icon">📑</span>전체 신청 내역</button>
                        <button class="sidebar-menu-item" id="sidebar-admin-create-application"><span class="sidebar-icon">📝</span>신청 등록하기</button>
                        <button class="sidebar-menu-item active" id="sidebar-admin-duty-status"><span class="sidebar-icon">👤</span>개인별 복무상황부</button>
                    </div>
                    <div style="flex:1;"></div>
                    <button class="sidebar-menu-item" id="sidebar-admin-logout" style="margin-top:auto;"><span class="sidebar-icon">🚪</span>로그아웃</button>
                </nav>
                <div class="admin-content">
                    <div class="admin-duty-status">
                        <div class="header">
                            <h1>개인별 복무상황부</h1>
                        </div>
                        
                        <div class="user-info-card">
                            <div class="user-info-horizontal">
                                <div class="info-item">
                                    <span class="info-label">소속:</span>
                                    <span class="info-value">${userInfo.department}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">편입일자:</span>
                                    <span class="info-value">${userInfo.joinDate}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">성명:</span>
                                    <span class="info-value">${userInfo.name}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">생년월일:</span>
                                    <span class="info-value">${userInfo.birthDate}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">확인자:</span>
                                    <span class="info-value">${userInfo.supervisor}</span>
                                </div>
                            </div>
                        </div>

                        <div style="font-weight:700; font-size:1.15em; margin: 24px 0 4px 2px; letter-spacing:1px; color:#222;">누계</div>
                        <div class="duty-summary" style="margin: 0 0 8px 0; display: flex; gap: 18px; justify-content: flex-start;">
                            <div style="background: #f9fafb; border-radius: 18px; box-shadow: 0 2px 12px 0 rgba(49,130,246,0.06); padding: 22px 32px; display: flex; align-items: center; gap: 12px; min-width: 120px;">
                                <span style="font-size: 1.6em; color: #3182f6;">🌴</span>
                                <span style="font-weight: 600; color: #222; font-size:1.08em;">연차</span>
                                <span style="font-size: 1.15em; color: #222; margin-left: 10px; min-width:60px; display:inline-block; text-align:right; font-variant-numeric: tabular-nums;">${formatDays(total['연차'])}</span>
                            </div>
                            <div style="background: #f9fafb; border-radius: 18px; box-shadow: 0 2px 12px 0 rgba(49,130,246,0.06); padding: 22px 32px; display: flex; align-items: center; gap: 12px; min-width: 120px;">
                                <span style="font-size: 1.6em; color: #3182f6;">🚌</span>
                                <span style="font-weight: 600; color: #222; font-size:1.08em;">출장</span>
                                <span style="font-size: 1.15em; color: #222; margin-left: 10px; min-width:60px; display:inline-block; text-align:right; font-variant-numeric: tabular-nums;">${formatDays(total['출장'])}</span>
                            </div>
                            <div style="background: #f9fafb; border-radius: 18px; box-shadow: 0 2px 12px 0 rgba(255,152,0,0.08); padding: 22px 32px; display: flex; align-items: center; gap: 12px; min-width: 120px;">
                                <span style="font-size: 1.6em; color: #3182f6;">🤒</span>
                                <span style="font-weight: 600; color: #222; font-size:1.08em;">병가</span>
                                <span style="font-size: 1.15em; color: #222; margin-left: 10px; min-width:60px; display:inline-block; text-align:right; font-variant-numeric: tabular-nums;">${formatDays(total['병가'])}</span>
                            </div>
                        </div>
                        
                        <div class="application-history">
                            <h2>상황 내역</h2>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>종류</th>
                                        <th>기간</th>
                                        <th>사용일수</th>
                                        <th>사유</th>
                                        <th>장소</th>
                                        <th>상태</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${createTableRows()}
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="action-buttons">
                            <button id="btn-back-to-user-select" class="btn btn-secondary">사용자 선택으로 돌아가기</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}; 