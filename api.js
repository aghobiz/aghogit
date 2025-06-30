/**
 * API 통신을 담당하는 모듈
 */
const API = {
    // 모의 데이터 (실제 서버 연결 시 이 부분은 삭제하고 실제 API 호출 사용)
    mockData: {
        user: {
            name: '홍길동',
            remainingDays: 15,
            totalDays: 15,
            usedDays: 0,
            sickDays: 0
        },
        applications: [],
        pendingApplications: []
    },

    /**
     * 사용자 정보 조회
     * @returns {Promise} 사용자 정보
     */
    getMyInfo: function() {
        // 실제 API 호출 시:
        // return fetch('/api/me').then(response => response.json());
        
        // 모의 데이터 사용:
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.mockData.user);
            }, 300);
        });
    },

    /**
     * 연차/출장/병가 신청
     * @param {Object} applicationData 신청 데이터
     * @returns {Promise} 신청 결과
     */
    createApplication: function(applicationData) {
        // 실제 API 호출 시:
        // return fetch('/api/applications', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(applicationData)
        // }).then(response => response.json());
        
        // 모의 데이터 사용:
        return new Promise((resolve) => {
            setTimeout(() => {
                const newId = this.mockData.applications.length + 1;
                const newApplication = {
                    id: newId,
                    ...applicationData,
                    status: '대기중'
                };
                this.mockData.applications.push(newApplication);
                this.mockData.pendingApplications.push({
                    ...newApplication,
                    userName: this.mockData.user.name
                });
                resolve({ success: true, id: newId });
            }, 300);
        });
    },

    /**
     * 내 신청 내역 조회
     * @returns {Promise} 신청 내역 목록
     */
    getMyApplications: function() {
        // 실제 API 호출 시:
        // return fetch('/api/applications/me').then(response => response.json());
        
        // 모의 데이터 사용:
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.mockData.applications);
            }, 300);
        });
    },

    /**
     * 취소 요청
     * @param {number} id 신청 ID
     * @param {string} reason 취소 요청 사유
     * @returns {Promise} 취소 요청 결과
     */
    requestCancel: function(id, reason) {
        // 실제 API 호출 시:
        // return fetch(`/api/applications/${id}/request-cancel`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ reason })
        // }).then(response => response.json());
        
        // 모의 데이터 사용:
        return new Promise((resolve) => {
            setTimeout(() => {
                const application = this.mockData.applications.find(app => app.id === id);
                if (application) {
                    // 이전 상태 저장
                    application.previousStatus = application.status;
                    // 상태 변경
                    application.status = '취소 요청중';
                    // 취소 요청 사유 저장
                    application.cancelReason = reason;
                    
                    // 취소 요청된 항목을 관리자 대기 목록에 추가
                    if (!this.mockData.pendingApplications.some(app => app.id === id)) {
                        this.mockData.pendingApplications.push({
                            ...application,
                            userName: this.mockData.user.name,
                            isCancelRequest: true, // 취소 요청 여부 표시
                            cancelReason: reason // 취소 요청 사유
                        });
                    }
                }
                resolve({ success: true });
            }, 300);
        });
    },

    /**
     * 관리자: 대기중인 신청 목록 조회
     * @returns {Promise} 대기중인 신청 목록
     */
    getPendingApplications: function() {
        // 실제 API 호출 시:
        // return fetch('/api/admin/applications/pending').then(response => response.json());
        
        // 모의 데이터 사용:
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.mockData.pendingApplications);
            }, 300);
        });
    },

    /**
     * 관리자: 신청 승인
     * @param {number} id 신청 ID
     * @returns {Promise} 승인 결과
     */
    approveApplication: function(id) {
        // 실제 API 호출 시:
        // return fetch(`/api/admin/applications/${id}/approve`, {
        //     method: 'POST'
        // }).then(response => response.json());
        
        // 모의 데이터 사용:
        return new Promise((resolve) => {
            setTimeout(() => {
                const pendingApp = this.mockData.pendingApplications.find(app => app.id === id);
                if (pendingApp) {
                    // 취소 요청인지 일반 신청인지 확인
                    const isCancelRequest = pendingApp.isCancelRequest === true;
                    
                    if (isCancelRequest) {
                        // 취소 요청 승인 처리
                        // 사용자의 신청 내역에서 상태 업데이트
                        const application = this.mockData.applications.find(app => app.id === id);
                        if (application) {
                            // 상태 변경
                            application.status = '취소됨';
                            
                            // 이미 승인된 연차였다면 연차 현황 복원
                            if (application.previousStatus === '승인') {
                                const daysUsed = application.hours / 8; // 시간을 일 단위로 변환
                                
                                if (application.type === '연차') {
                                    // 연차인 경우 사용 연차 감소, 잔여 연차 증가
                                    this.mockData.user.usedDays -= daysUsed;
                                    this.mockData.user.remainingDays += daysUsed;
                                } else if (application.type === '병가') {
                                    // 병가인 경우 누적 병가 감소
                                    this.mockData.user.sickDays -= daysUsed;
                                }
                            }
                        }
                    } else {
                        // 일반 신청 승인 처리
                        pendingApp.status = '승인';
                        
                        // 사용자의 신청 내역에서도 상태 업데이트
                        const application = this.mockData.applications.find(app => app.id === id);
                        if (application) {
                            application.status = '승인';
                            
                            // 연차 현황 업데이트
                            const daysUsed = application.hours / 8; // 시간을 일 단위로 변환
                            
                            if (application.type === '연차') {
                                // 연차인 경우 사용 연차 증가, 잔여 연차 감소
                                this.mockData.user.usedDays += daysUsed;
                                this.mockData.user.remainingDays -= daysUsed;
                            } else if (application.type === '병가') {
                                // 병가인 경우 누적 병가 증가
                                this.mockData.user.sickDays += daysUsed;
                            }
                            // 출장은 연차 현황에 영향을 주지 않음
                        }
                    }
                    
                    // 승인된 항목은 대기 목록에서 제거
                    this.mockData.pendingApplications = this.mockData.pendingApplications.filter(app => app.id !== id);
                }
                resolve({ success: true });
            }, 300);
        });
    },

    /**
     * 관리자: 신청 반려
     * @param {number} id 신청 ID
     * @param {string} reason 반려 사유
     * @returns {Promise} 반려 결과
     */
    rejectApplication: function(id, reason) {
        // 실제 API 호출 시:
        // return fetch(`/api/admin/applications/${id}/reject`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ reason })
        // }).then(response => response.json());
        
        // 모의 데이터 사용:
        return new Promise((resolve) => {
            setTimeout(() => {
                // 대기 목록에서 해당 신청 찾기
                const pendingIndex = this.mockData.pendingApplications.findIndex(app => app.id === id);
                
                if (pendingIndex !== -1) {
                    const pendingApp = this.mockData.pendingApplications[pendingIndex];
                    
                    // 취소 요청인지 일반 신청인지 확인
                    const isCancelRequest = pendingApp.isCancelRequest === true;
                    
                    if (isCancelRequest) {
                        // 취소 요청 반려 처리
                        // 관리자 대기 목록에서 해당 항목 제거
                        this.mockData.pendingApplications.splice(pendingIndex, 1);
                        
                        // 사용자의 신청 내역에서 상태 복원 및 반려 사유 저장
                        const application = this.mockData.applications.find(app => app.id === id);
                        if (application) {
                            // 상태 복원
                            application.status = application.previousStatus || '승인';
                            delete application.previousStatus;
                            
                            // 취소 요청 반려 표시
                            application.cancelRejected = true;
                            application.rejectReason = reason;
                        }
                    } else {
                        // 일반 신청 반려 처리
                        // 관리자 대기 목록에서 해당 항목 제거
                        this.mockData.pendingApplications.splice(pendingIndex, 1);
                        
                        // 사용자의 신청 내역에서도 상태 업데이트
                        const application = this.mockData.applications.find(app => app.id === id);
                        if (application) {
                            application.status = '반려';
                            application.rejectReason = reason;
                        }
                    }
                }
                
                resolve({ success: true });
            }, 300);
        });
    },

    /**
     * 관리자: 사용자를 대신하여 신청 등록
     * @param {Object} applicationData 신청 데이터 (userName 포함)
     * @returns {Promise} 등록 결과
     */
    adminCreateApplication: function(applicationData) {
        // 실제 API 호출 시:
        // return fetch('/api/admin/applications', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(applicationData)
        // }).then(response => response.json());
        
        // 모의 데이터 사용:
        return new Promise((resolve) => {
            setTimeout(() => {
                const newId = this.mockData.applications.length + 1;
                
                // 신청 상태는 바로 '승인'으로 설정
                const newApplication = {
                    id: newId,
                    ...applicationData,
                    status: '승인'
                };
                
                // 신청 내역에 추가 (관리자가 등록한 내역이므로 대기 목록에는 추가하지 않음)
                this.mockData.applications.push(newApplication);
                
                // 전체 신청 내역에 추가
                if (!this.mockData.allApplications) {
                    this.mockData.allApplications = [];
                }
                this.mockData.allApplications.push(newApplication);
                
                // 연차 현황 업데이트 (모의 데이터이므로 실제로는 해당 사용자의 데이터를 업데이트해야 함)
                const daysUsed = parseFloat(applicationData.hours) / 8; // 시간을 일 단위로 변환
                
                if (applicationData.type === '연차') {
                    // 연차인 경우 사용 연차 증가, 잔여 연차 감소
                    this.mockData.user.usedDays += daysUsed;
                    this.mockData.user.remainingDays -= daysUsed;
                } else if (applicationData.type === '병가') {
                    // 병가인 경우 누적 병가 증가
                    this.mockData.user.sickDays += daysUsed;
                }
                
                resolve({ success: true, id: newId });
            }, 300);
        });
    },

    /**
     * 대기중인 신청 취소
     * @param {number} id 신청 ID
     * @returns {Promise} 취소 결과
     */
    cancelApplication: function(id) {
        // 실제 API 호출 시:
        // return fetch(`/api/applications/${id}/cancel`, {
        //     method: 'POST'
        // }).then(response => response.json());
        
        // 모의 데이터 사용:
        return new Promise((resolve) => {
            setTimeout(() => {
                // 사용자의 신청 내역에서 제거
                this.mockData.applications = this.mockData.applications.filter(app => app.id !== id);
                
                // 관리자 대기 목록에서도 제거
                this.mockData.pendingApplications = this.mockData.pendingApplications.filter(app => app.id !== id);
                
                resolve({ success: true });
            }, 300);
        });
    },

    /**
     * 관리자: 전체 신청 내역 조회
     * @returns {Promise} 모든 신청 내역 목록
     */
    getAllApplications: function() {
        // 실제 API 호출 시:
        // return fetch('/api/admin/applications/all').then(response => response.json());
        
        // 모의 데이터 사용:
        return new Promise((resolve) => {
            setTimeout(() => {
                // 신청 내역과 대기 목록을 합쳐서 전체 내역 생성
                const allApplications = [...this.mockData.applications];
                
                // 중복 제거
                const uniqueApplications = [];
                const idSet = new Set();
                
                allApplications.forEach(app => {
                    if (!idSet.has(app.id)) {
                        idSet.add(app.id);
                        
                        // 사용자 이름 추가 (실제로는 서버에서 이 정보를 제공)
                        if (!app.userName) {
                            app.userName = this.mockData.user.name;
                        }
                        
                        uniqueApplications.push(app);
                    }
                });
                
                // 모의 데이터에 저장 (다음 조회 시 사용)
                this.mockData.allApplications = uniqueApplications;
                
                resolve(uniqueApplications);
            }, 300);
        });
    },

    /**
     * 관리자: 사용자 목록 조회
     * @returns {Promise} 사용자 목록
     */
    getUserList: function() {
        // 실제 API 호출 시:
        // return fetch('/api/admin/users').then(response => response.json());
        
        // 모의 데이터 사용:
        return new Promise((resolve) => {
            setTimeout(() => {
                // 모의 사용자 데이터 생성
                const userList = [
                    {
                        id: 1,
                        name: '홍길동',
                        department: '개발팀',
                        joinDate: '2020-01-15',
                        birthDate: '1990-05-20',
                        supervisor: '김부장'
                    },
                    {
                        id: 2,
                        name: '김철수',
                        department: '인사팀',
                        joinDate: '2019-03-10',
                        birthDate: '1988-11-12',
                        supervisor: '박부장'
                    },
                    {
                        id: 3,
                        name: '이영희',
                        department: '마케팅팀',
                        joinDate: '2021-07-01',
                        birthDate: '1995-02-28',
                        supervisor: '최부장'
                    },
                    {
                        id: 4,
                        name: '박지민',
                        department: '디자인팀',
                        joinDate: '2022-02-15',
                        birthDate: '1993-08-17',
                        supervisor: '임부장'
                    },
                    {
                        id: 5,
                        name: '최동욱',
                        department: '영업팀',
                        joinDate: '2018-09-23',
                        birthDate: '1987-12-05',
                        supervisor: '강부장'
                    }
                ];
                
                resolve(userList);
            }, 300);
        });
    },

    /**
     * 관리자: 사용자별 복무상황부 조회
     * @param {number} userId 사용자 ID
     * @returns {Promise} 사용자의 복무상황부 정보
     */
    getUserDutyStatus: function(userId) {
        // 실제 API 호출 시:
        // return fetch(`/api/admin/users/${userId}/duty-status`).then(response => response.json());
        
        // 모의 데이터 사용:
        return new Promise((resolve) => {
            setTimeout(() => {
                // 해당 사용자 찾기
                const users = [
                    {
                        id: 1,
                        name: '홍길동',
                        department: '개발팀',
                        joinDate: '2020-01-15',
                        birthDate: '1990-05-20',
                        supervisor: '김부장'
                    },
                    {
                        id: 2,
                        name: '김철수',
                        department: '인사팀',
                        joinDate: '2019-03-10',
                        birthDate: '1988-11-12',
                        supervisor: '박부장'
                    },
                    {
                        id: 3,
                        name: '이영희',
                        department: '마케팅팀',
                        joinDate: '2021-07-01',
                        birthDate: '1995-02-28',
                        supervisor: '최부장'
                    },
                    {
                        id: 4,
                        name: '박지민',
                        department: '디자인팀',
                        joinDate: '2022-02-15',
                        birthDate: '1993-08-17',
                        supervisor: '임부장'
                    },
                    {
                        id: 5,
                        name: '최동욱',
                        department: '영업팀',
                        joinDate: '2018-09-23',
                        birthDate: '1987-12-05',
                        supervisor: '강부장'
                    }
                ];
                
                const user = users.find(u => u.id === userId) || users[0];
                
                // 전체 신청 내역에서 해당 사용자의 신청만 필터링
                const userApplications = this.mockData.allApplications 
                    ? this.mockData.allApplications.filter(app => 
                        app.userName === user.name || 
                        (app.userId && app.userId === userId)
                    ) 
                    : [];
                
                // 해당 사용자의 복무상황부 데이터 생성
                const dutyStatus = {
                    userInfo: user,
                    applications: userApplications
                };
                
                resolve(dutyStatus);
            }, 300);
        });
    }
}; 