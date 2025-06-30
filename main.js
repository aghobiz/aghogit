/**
 * 연차관리 시스템 메인 JavaScript
 * 버전: 1.0.2 (캐시 갱신용)
 */
document.addEventListener('DOMContentLoaded', () => {
    // 앱 상태 관리
    const AppState = {
        currentView: 'login', // 현재 화면: 'login', 'dashboard', 'applicationForm', 'myApplications', 'adminDashboard', 'adminAllApplications', 'adminApplicationForm', 'adminUserSelect', 'adminDutyStatus'
        userData: null,
        applications: [],
        pendingApplications: [],
        allApplications: [], // 관리자용 전체 신청 내역
        userList: [], // 관리자용 사용자 목록
        currentUserDutyStatus: null // 현재 조회 중인 사용자의 복무상황부
    };

    /**
     * 화면 렌더링 함수
     */
    const renderView = () => {
        const appContainer = document.getElementById('app');
        
        switch (AppState.currentView) {
            case 'login':
                appContainer.innerHTML = Templates.loginTemplate();
                initLoginEvents();
                break;
                
            case 'dashboard':
                if (AppState.userData) {
                    appContainer.innerHTML = Templates.dashboardTemplate(AppState.userData);
                    initDashboardEvents();
                } else {
                    loadUserData().then(() => {
                        appContainer.innerHTML = Templates.dashboardTemplate(AppState.userData);
                        initDashboardEvents();
                    });
                }
                break;
                
            case 'applicationForm':
                appContainer.innerHTML = Templates.applicationFormTemplate();
                initApplicationFormEvents();
                break;
                
            case 'myApplications':
                loadMyApplications().then(() => {
                    appContainer.innerHTML = Templates.myApplicationsTemplate(AppState.applications);
                    initMyApplicationsEvents();
                });
                break;
                
            case 'adminDashboard':
                loadPendingApplications().then(() => {
                    appContainer.innerHTML = Templates.adminDashboardTemplate(AppState.pendingApplications);
                    initAdminDashboardEvents();
                });
                break;
                
            case 'adminAllApplications':
                loadAllApplications().then(() => {
                    appContainer.innerHTML = Templates.adminAllApplicationsTemplate(AppState.allApplications);
                    initAdminAllApplicationsEvents();
                });
                break;
                
            case 'adminApplicationForm':
                // 사용자 목록을 먼저 로드한 후 폼 초기화
                loadUserList().then(() => {
                    appContainer.innerHTML = Templates.adminApplicationFormTemplate();
                    initAdminApplicationFormEvents();
                });
                break;
                
            case 'adminUserSelect':
                loadUserList().then(() => {
                    appContainer.innerHTML = Templates.adminUserSelectTemplate(AppState.userList);
                    initAdminUserSelectEvents();
                });
                break;
                
            case 'adminDutyStatus':
                if (AppState.currentUserDutyStatus) {
                    appContainer.innerHTML = Templates.adminDutyStatusTemplate(AppState.currentUserDutyStatus);
                    initAdminDutyStatusEvents();
                }
                break;
        }
        initSidebarHamburgerEvents();
    };

    /**
     * 사용자 데이터 로드
     */
    const loadUserData = () => {
        return API.getMyInfo().then(data => {
            AppState.userData = data;
        });
    };

    /**
     * 내 신청 내역 로드
     */
    const loadMyApplications = () => {
        return API.getMyApplications().then(data => {
            AppState.applications = data;
        });
    };

    /**
     * 관리자: 대기중인 신청 내역 로드
     */
    const loadPendingApplications = () => {
        return API.getPendingApplications().then(data => {
            AppState.pendingApplications = data;
        });
    };

    /**
     * 관리자: 전체 신청 내역 로드
     */
    const loadAllApplications = () => {
        return API.getAllApplications().then(data => {
            AppState.allApplications = data;
        });
    };

    /**
     * 관리자: 사용자 목록 로드
     */
    const loadUserList = () => {
        return API.getUserList().then(data => {
            AppState.userList = data;
        });
    };

    /**
     * 관리자: 사용자별 복무상황부 로드
     * @param {number} userId 사용자 ID
     */
    const loadUserDutyStatus = (userId) => {
        return API.getUserDutyStatus(userId).then(data => {
            AppState.currentUserDutyStatus = data;
        });
    };

    /**
     * 로그인 화면 이벤트 초기화
     */
    const initLoginEvents = () => {
        // 전문연구요원 로그인 버튼 클릭
        document.getElementById('btn-employee-login').addEventListener('click', () => {
            AppState.currentView = 'dashboard';
            renderView();
        });
        
        // 관리자 로그인 버튼 클릭
        document.getElementById('btn-admin-login').addEventListener('click', () => {
            AppState.currentView = 'adminDashboard';
            renderView();
        });
    };

    /**
     * 대시보드 화면 이벤트 초기화
     */
    const initDashboardEvents = () => {
        // 신청하기 버튼 클릭
        document.getElementById('btn-show-application-form').addEventListener('click', () => {
            AppState.currentView = 'applicationForm';
            renderView();
        });
        
        // 내 신청 내역 버튼 클릭
        document.getElementById('btn-show-my-applications').addEventListener('click', () => {
            AppState.currentView = 'myApplications';
            renderView();
        });
        
        // 로그아웃 버튼 클릭
        document.getElementById('btn-logout').addEventListener('click', () => {
            AppState.currentView = 'login';
            AppState.userData = null;
            renderView();
        });
    };

    /**
     * 공통 신청 폼 이벤트 함수
     */
    function initCommonApplicationFormEvents({
        formId,
        typeSelectId,
        startDateId,
        startTimeId,
        endDateId,
        endTimeId,
        reasonGroupId,
        reasonSelectId,
        customReasonGroupId,
        reasonTextareaId,
        sickReasonGroupId,
        sickReasonTextareaId,
        destinationGroupId,
        destinationInputId,
        tripContentGroupId,
        tripContentTextareaId,
        calculatedHoursId,
        userInputId,
        backButtonId,
        onSubmit,
        onBack
    }) {
        const applicationForm = document.getElementById(formId);
        const applicationTypeSelect = document.getElementById(typeSelectId);
        const startDateInput = document.getElementById(startDateId);
        const startTimeSelect = document.getElementById(startTimeId);
        const endDateInput = document.getElementById(endDateId);
        const endTimeSelect = document.getElementById(endTimeId);
        const reasonGroup = document.getElementById(reasonGroupId);
        const reasonSelect = document.getElementById(reasonSelectId);
        const customReasonGroup = document.getElementById(customReasonGroupId);
        const applicationReasonTextarea = document.getElementById(reasonTextareaId);
        const sickReasonGroup = document.getElementById(sickReasonGroupId);
        const sickReasonTextarea = document.getElementById(sickReasonTextareaId);
        const destinationGroup = document.getElementById(destinationGroupId);
        const destinationInput = document.getElementById(destinationInputId);
        const tripContentGroup = document.getElementById(tripContentGroupId);
        const tripContentTextarea = document.getElementById(tripContentTextareaId);
        const calculatedHoursElement = document.getElementById(calculatedHoursId);
        const applicationUserInput = userInputId ? document.getElementById(userInputId) : null;
        const backButton = backButtonId ? document.getElementById(backButtonId) : null;
        
        // 날짜 입력 필드 초기화
        const initDateInputs = () => {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const todayStr = `${yyyy}-${mm}-${dd}`;
            startDateInput.value = todayStr;
            endDateInput.value = todayStr;
            startTimeSelect.value = '09:00';
            endTimeSelect.value = '18:00';
            calculateHours();
        };
        
        // 날짜/시간 변경 시 사용 시간 계산
        const calculateHours = () => {
            if (startDateInput.value && endDateInput.value && startTimeSelect.value && endTimeSelect.value) {
                const startDateTime = new Date(`${startDateInput.value}T${startTimeSelect.value}`);
                const endDateTime = new Date(`${endDateInput.value}T${endTimeSelect.value}`);
                if (endDateTime < startDateTime) {
                    calculatedHoursElement.textContent = '종료일시는 시작일시보다 이후여야 합니다.';
                    return;
                }
                let workHours = 0;
                const startHour = startDateTime.getHours();
                const endHour = endDateTime.getHours();
                if (startDateTime.toDateString() === endDateTime.toDateString()) {
                    if (startHour === 9 && endHour === 18) {
                        workHours = 8;
                    } else {
                        workHours = endHour - startHour;
                    }
                } else {
                    if (startHour === 9) {
                        workHours += 8;
                    } else {
                        workHours += 18 - startHour;
                    }
                    const daysBetween = Math.floor((endDateTime - startDateTime) / (1000 * 60 * 60 * 24));
                    if (daysBetween > 0) {
                        workHours += daysBetween * 8;
                    }
                    if (endHour === 18) {
                        workHours += 8;
                    } else {
                        workHours += endHour - 9;
                    }
                    if (startHour === 9 && endHour === 18 && daysBetween === 0) {
                        workHours = 8;
                    }
                }
                calculatedHoursElement.textContent = `${workHours}시간`;
            } else {
                calculatedHoursElement.textContent = '시작일시와 종료일시를 입력하세요.';
            }
        };
        
        // 이벤트 리스너 등록
        startDateInput.addEventListener('change', calculateHours);
        startTimeSelect.addEventListener('change', calculateHours);
        endDateInput.addEventListener('change', calculateHours);
        endTimeSelect.addEventListener('change', calculateHours);
        
        // 신청 종류 변경 시 필드 표시/숨김 처리
        applicationTypeSelect.addEventListener('change', () => {
            const applicationType = applicationTypeSelect.value;
            const isBusinessTrip = applicationType === '출장';
            const isSickLeave = applicationType === '병가';
            destinationGroup.style.display = isBusinessTrip ? 'block' : 'none';
            tripContentGroup.style.display = isBusinessTrip ? 'block' : 'none';
            sickReasonGroup.style.display = isSickLeave ? 'block' : 'none';
            reasonGroup.style.display = (!isBusinessTrip && !isSickLeave) ? 'block' : 'none';
            customReasonGroup.style.display = (!isBusinessTrip && !isSickLeave && reasonSelect.value === '기타') ? 'block' : 'none';
            reasonSelect.required = (!isBusinessTrip && !isSickLeave);
            if (destinationInput) destinationInput.required = isBusinessTrip;
            if (tripContentTextarea) tripContentTextarea.required = isBusinessTrip;
            if (sickReasonTextarea) sickReasonTextarea.required = isSickLeave;
        });
        
        // 사유 선택 변경 시 처리
        reasonSelect.addEventListener('change', () => {
            if (reasonSelect.value === '기타') {
                customReasonGroup.style.display = 'block';
                applicationReasonTextarea.required = true;
            } else {
                customReasonGroup.style.display = 'none';
                applicationReasonTextarea.required = false;
            }
            // 반차 선택 시 시간 자동 설정
            if (reasonSelect.value === '오전반차') {
                startTimeSelect.value = '09:00';
                endTimeSelect.value = '13:00';
                calculateHours();
            } else if (reasonSelect.value === '오후반차') {
                startTimeSelect.value = '14:00';
                endTimeSelect.value = '18:00';
                calculateHours();
            } else if (reasonSelect.value === '하루연차') {
                startTimeSelect.value = '09:00';
                endTimeSelect.value = '18:00';
                calculateHours();
            }
        });
        
        // 폼 제출 이벤트
        applicationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (onSubmit) onSubmit();
        });

        // 돌아가기 버튼 클릭
        if (backButton) {
            backButton.addEventListener('click', () => {
                if (onBack) onBack();
            });
        }

        // 초기화 실행
        calculateHours();
        initDateInputs();
    }

    // 신청자 폼 이벤트 연결
    function initApplicationFormEvents() {
        initCommonApplicationFormEvents({
            formId: 'form-application',
            typeSelectId: 'application-type',
            startDateId: 'start-date',
            startTimeId: 'start-time',
            endDateId: 'end-date',
            endTimeId: 'end-time',
            reasonGroupId: 'reason-group',
            reasonSelectId: 'reason-select',
            customReasonGroupId: 'custom-reason-group',
            reasonTextareaId: 'application-reason',
            sickReasonGroupId: 'sick-reason-group',
            sickReasonTextareaId: 'sick-reason',
            destinationGroupId: 'destination-group',
            destinationInputId: 'application-destination',
            tripContentGroupId: 'trip-content-group',
            tripContentTextareaId: 'trip-content',
            calculatedHoursId: 'calculated-hours',
            userInputId: null,
            backButtonId: 'btn-back-to-dashboard',
            onSubmit: function() {
                // 기존 신청자 폼 제출 로직
                // ... (기존 코드 복사)
            },
            onBack: function() {
                AppState.currentView = 'dashboard';
                renderView();
            }
        });
    }

    // 관리자 폼 이벤트 연결
    function initAdminApplicationFormEvents() {
        // 사용자 자동완성 처리 (기존 코드 유지)
        if (AppState.userList && AppState.userList.length > 0) {
            const applicationUserInput = document.getElementById('admin-application-user');
            if (applicationUserInput) {
                let existingDatalist = document.getElementById('user-name-list');
                if (existingDatalist) existingDatalist.remove();
                const datalist = document.createElement('datalist');
                datalist.id = 'user-name-list';
                AppState.userList.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.name;
                    datalist.appendChild(option);
                });
                document.body.appendChild(datalist);
                applicationUserInput.setAttribute('list', 'user-name-list');
                applicationUserInput.addEventListener('change', () => {
                    const selectedName = applicationUserInput.value;
                    const selectedUser = AppState.userList.find(user => user.name === selectedName);
                    if (selectedUser) {
                        applicationUserInput.title = `${selectedUser.department}`;
                    } else {
                        applicationUserInput.title = '';
                    }
                });
            }
        }
        // 사이드바 버튼 이벤트 리스너 추가
        const sidebarPending = document.getElementById('sidebar-admin-pending');
        if (sidebarPending) sidebarPending.addEventListener('click', () => {
            AppState.currentView = 'adminDashboard';
            renderView();
        });
        const sidebarAll = document.getElementById('sidebar-admin-all-applications');
        if (sidebarAll) sidebarAll.addEventListener('click', () => {
            AppState.currentView = 'adminAllApplications';
            renderView();
        });
        const sidebarCreate = document.getElementById('sidebar-admin-create-application');
        if (sidebarCreate) sidebarCreate.addEventListener('click', () => {
            AppState.currentView = 'adminApplicationForm';
            renderView();
        });
        const sidebarDuty = document.getElementById('sidebar-admin-duty-status');
        if (sidebarDuty) sidebarDuty.addEventListener('click', () => {
            AppState.currentView = 'adminUserSelect';
            renderView();
        });
        const sidebarLogout = document.getElementById('sidebar-admin-logout');
        if (sidebarLogout) sidebarLogout.addEventListener('click', () => {
            AppState.currentView = 'login';
            AppState.userList = [];
            renderView();
        });
        // 햄버거 버튼 및 오버레이 이벤트 리스너 추가
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (hamburgerBtn && sidebar && overlay) {
            hamburgerBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                overlay.classList.toggle('open');
                hamburgerBtn.classList.toggle('active');
            });
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('open');
                hamburgerBtn.classList.remove('active');
            });
        }
        initCommonApplicationFormEvents({
            formId: 'admin-application-form',
            typeSelectId: 'admin-application-type',
            startDateId: 'admin-start-date',
            startTimeId: 'admin-start-time',
            endDateId: 'admin-end-date',
            endTimeId: 'admin-end-time',
            reasonGroupId: 'admin-reason-group',
            reasonSelectId: 'admin-reason-select',
            customReasonGroupId: 'admin-custom-reason-group',
            reasonTextareaId: 'admin-application-reason',
            sickReasonGroupId: 'admin-sick-reason-group',
            sickReasonTextareaId: 'admin-sick-reason',
            destinationGroupId: 'admin-destination-group',
            destinationInputId: 'admin-application-destination',
            tripContentGroupId: 'admin-trip-content-group',
            tripContentTextareaId: 'admin-trip-content',
            calculatedHoursId: 'admin-calculated-hours',
            userInputId: 'admin-application-user',
            backButtonId: 'btn-admin-back',
            onSubmit: function() {
                // 관리자 신청 등록 로직
                const applicationUserInput = document.getElementById('admin-application-user');
                const userName = applicationUserInput.value.trim();
                if (!userName) {
                    alert('신청자 이름을 입력하세요.');
                    applicationUserInput.focus();
                    return;
                }
                const applicationType = document.getElementById('admin-application-type').value;
                const startDate = `${document.getElementById('admin-start-date').value}T${document.getElementById('admin-start-time').value}`;
                const endDate = `${document.getElementById('admin-end-date').value}T${document.getElementById('admin-end-time').value}`;
                const reasonSelect = document.getElementById('admin-reason-select');
                const applicationReasonTextarea = document.getElementById('admin-application-reason');
                const sickReasonTextarea = document.getElementById('admin-sick-reason');
                const destinationInput = document.getElementById('admin-application-destination');
                const tripContentTextarea = document.getElementById('admin-trip-content');
            let reason = '';
                let destination = '';
                if (applicationType === '연차') {
                    if (reasonSelect.value === '기타') {
                        reason = applicationReasonTextarea.value.trim();
            } else {
                reason = reasonSelect.value;
                    }
                } else if (applicationType === '출장') {
                    reason = tripContentTextarea.value.trim();
                    destination = destinationInput.value.trim();
                } else if (applicationType === '병가') {
                    reason = sickReasonTextarea.value.trim();
                }
                // 사용자 ID 찾기
                const selectedUser = AppState.userList.find(user => user.name === userName);
                const userId = selectedUser ? selectedUser.id : null;
                // 시간 계산
            const start = new Date(startDate);
            const end = new Date(endDate);
            const startHour = start.getHours();
            const endHour = end.getHours();
                let workHours = 0;
            if (start.toDateString() === end.toDateString()) {
                if (startHour === 9 && endHour === 18) {
                    workHours = 8;
                } else {
                    workHours = endHour - startHour;
                }
            } else {
                if (startHour === 9) {
                    workHours += 8;
                } else {
                    workHours += 18 - startHour;
                }
                const daysBetween = Math.floor((end - start) / (1000 * 60 * 60 * 24));
                if (daysBetween > 0) {
                    workHours += daysBetween * 8;
                }
                if (endHour === 18) {
                    workHours += 8;
                } else {
                    workHours += endHour - 9;
                }
                if (startHour === 9 && endHour === 18 && daysBetween === 0) {
                    workHours = 8;
                }
            }
                // 신청 데이터 구성
                const applicationData = {
                    userName: userName,
                type: applicationType,
                    startDate: startDate,
                    endDate: endDate,
                    reason: reason,
                destination: applicationType === '출장' ? destination : null,
                    hours: workHours,
                    userId: userId
                };
                API.adminCreateApplication(applicationData)
                    .then(response => {
                if (response.success) {
                            alert('신청이 등록되었습니다.');
                            if (userId) {
                                loadUserDutyStatus(userId).then(() => {
                                    AppState.currentView = 'adminDutyStatus';
                    renderView();
                                });
                } else {
                                AppState.currentView = 'adminDashboard';
                                renderView();
                            }
                        } else {
                            alert('신청 등록 중 오류가 발생했습니다.');
                        }
                    })
                    .catch(error => {
                        console.error('API 오류:', error);
                        alert('신청 등록 중 오류가 발생했습니다.');
                    });
            },
            onBack: function() {
                AppState.currentView = 'adminDashboard';
            renderView();
            }
        });
    }

    /**
     * 내 신청 내역 화면 이벤트 초기화
     */
    const initMyApplicationsEvents = () => {
        // 취소 요청 버튼 클릭
        document.querySelectorAll('.btn-request-cancel').forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.getAttribute('data-id'));
                const reason = prompt('취소 요청 사유를 입력하세요:');
                
                if (reason !== null && reason.trim() !== '') {
                    if (confirm('정말 취소 요청하시겠습니까?')) {
                        API.requestCancel(id, reason).then(response => {
                            if (response.success) {
                                alert('취소 요청이 완료되었습니다.');
                                loadMyApplications().then(() => {
                                    document.getElementById('app').innerHTML = Templates.myApplicationsTemplate(AppState.applications);
                                    initMyApplicationsEvents();
                                });
                            } else {
                                alert('취소 요청 처리 중 오류가 발생했습니다.');
                            }
                        });
                    }
                } else if (reason !== null) {
                    alert('취소 요청 사유를 입력해야 합니다.');
                }
            });
        });
        
        // 대기중 상태 취소 버튼 클릭
        document.querySelectorAll('.btn-cancel').forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.getAttribute('data-id'));
                if (confirm('정말 취소하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                    API.cancelApplication(id).then(response => {
                        if (response.success) {
                            alert('신청이 취소되었습니다.');
                            loadMyApplications().then(() => {
                                document.getElementById('app').innerHTML = Templates.myApplicationsTemplate(AppState.applications);
                                initMyApplicationsEvents();
                            });
                        } else {
                            alert('취소 처리 중 오류가 발생했습니다.');
                        }
                    });
                }
            });
        });
        
        // 반려 사유 보기 버튼 클릭
        document.querySelectorAll('.btn-show-reject-reason').forEach(button => {
            button.addEventListener('click', () => {
                const reason = button.getAttribute('data-reason');
                const modal = document.getElementById('reject-reason-modal');
                const reasonText = document.getElementById('reject-reason-text');
                
                // 모달에 반려 사유 표시
                reasonText.textContent = reason;
                modal.style.display = 'block';
            });
        });
        
        // 모달 닫기 버튼 클릭
        const closeBtn = document.querySelector('#reject-reason-modal .close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('reject-reason-modal').style.display = 'none';
            });
        }
        
        // 모달 외부 클릭 시 닫기
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('reject-reason-modal');
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // 대시보드로 돌아가기 버튼 클릭
        document.getElementById('btn-back-to-dashboard').addEventListener('click', () => {
            AppState.currentView = 'dashboard';
            renderView();
        });
    };

    /**
     * 관리자 대시보드 화면 이벤트 초기화
     */
    const initAdminDashboardEvents = () => {
        // 햄버거 버튼 클릭 이벤트
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        if (hamburgerBtn && sidebar && overlay) {
            hamburgerBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                overlay.classList.toggle('open');
                hamburgerBtn.classList.toggle('active');
            });
            
            // 오버레이 클릭 시 사이드바 닫기
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('open');
                hamburgerBtn.classList.remove('active');
            });
        }
        
        // 승인 버튼 클릭
        document.querySelectorAll('.btn-approve').forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.getAttribute('data-id'));
                if (confirm('이 신청을 승인하시겠습니까?')) {
                    API.approveApplication(id).then(response => {
                        if (response.success) {
                            alert('승인이 완료되었습니다.');
                            loadPendingApplications().then(() => {
                                document.getElementById('app').innerHTML = Templates.adminDashboardTemplate(AppState.pendingApplications);
                                initAdminDashboardEvents();
                            });
                        } else {
                            alert('승인 처리 중 오류가 발생했습니다.');
                        }
                    });
                }
            });
        });
        
        // 반려 버튼 클릭
        document.querySelectorAll('.btn-reject').forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.getAttribute('data-id'));
                const reason = prompt('반려 사유를 입력하세요:');
                
                if (reason !== null) {
                    API.rejectApplication(id, reason).then(response => {
                        if (response.success) {
                            alert('반려가 완료되었습니다.');
                            loadPendingApplications().then(() => {
                                document.getElementById('app').innerHTML = Templates.adminDashboardTemplate(AppState.pendingApplications);
                                initAdminDashboardEvents();
                            });
                        } else {
                            alert('반려 처리 중 오류가 발생했습니다.');
                        }
                    });
                }
            });
        });
        
        // 사이드바 메뉴 이벤트
        document.getElementById('sidebar-admin-pending').addEventListener('click', () => {
            AppState.currentView = 'adminDashboard';
            renderView();
        });
        
        document.getElementById('sidebar-admin-all-applications').addEventListener('click', () => {
            AppState.currentView = 'adminAllApplications';
            renderView();
        });
        
        document.getElementById('sidebar-admin-create-application').addEventListener('click', () => {
            AppState.currentView = 'adminApplicationForm';
            renderView();
        });
        
        document.getElementById('sidebar-admin-duty-status').addEventListener('click', () => {
            AppState.currentView = 'adminUserSelect';
            renderView();
        });
        
        document.getElementById('sidebar-admin-logout').addEventListener('click', () => {
            AppState.currentView = 'login';
            AppState.pendingApplications = [];
            renderView();
        });
    };

    /**
     * 관리자 전체 신청 내역 화면 이벤트 초기화
     */
    const initAdminAllApplicationsEvents = () => {
        // 햄버거 버튼 클릭 이벤트
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        if (hamburgerBtn && sidebar && overlay) {
            hamburgerBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                overlay.classList.toggle('open');
                hamburgerBtn.classList.toggle('active');
            });
            
            // 오버레이 클릭 시 사이드바 닫기
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('open');
                hamburgerBtn.classList.remove('active');
            });
        }
        
        // 반려 사유 보기 버튼 클릭
        document.querySelectorAll('.btn-show-reject-reason').forEach(button => {
            button.addEventListener('click', () => {
                const reason = button.getAttribute('data-reason');
                const modal = document.getElementById('reject-reason-modal');
                const reasonText = document.getElementById('reject-reason-text');
                
                reasonText.textContent = reason;
                modal.style.display = 'block';
            });
        });
        
        // 모달 닫기 버튼 클릭
        const closeBtn = document.querySelector('#reject-reason-modal .close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('reject-reason-modal').style.display = 'none';
            });
        }
        
        // 모달 외부 클릭 시 닫기
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('reject-reason-modal');
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // 사이드바 메뉴 이벤트
        document.getElementById('sidebar-admin-pending').addEventListener('click', () => {
            AppState.currentView = 'adminDashboard';
            renderView();
        });
        
        document.getElementById('sidebar-admin-all-applications').addEventListener('click', () => {
            AppState.currentView = 'adminAllApplications';
            renderView();
        });
        
        document.getElementById('sidebar-admin-create-application').addEventListener('click', () => {
            AppState.currentView = 'adminApplicationForm';
            renderView();
        });
        
        document.getElementById('sidebar-admin-duty-status').addEventListener('click', () => {
            AppState.currentView = 'adminUserSelect';
            renderView();
        });
        
        document.getElementById('sidebar-admin-logout').addEventListener('click', () => {
            AppState.currentView = 'login';
            AppState.allApplications = [];
            renderView();
        });
    };

    /**
     * 관리자 사용자 선택 화면 이벤트 초기화
     */
    const initAdminUserSelectEvents = () => {
        // 햄버거 버튼 클릭 이벤트
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        if (hamburgerBtn && sidebar && overlay) {
            hamburgerBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                overlay.classList.toggle('open');
                hamburgerBtn.classList.toggle('active');
            });
            
            // 오버레이 클릭 시 사이드바 닫기
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('open');
                hamburgerBtn.classList.remove('active');
            });
        }
        
        // 사용자 카드 클릭 이벤트
        document.querySelectorAll('.user-card').forEach(card => {
            card.addEventListener('click', () => {
                const userId = parseInt(card.getAttribute('data-user-id'));
                
                loadUserDutyStatus(userId).then(() => {
                    AppState.currentView = 'adminDutyStatus';
                    renderView();
                });
            });
        });
        
        // 처리할 신청 화면으로 이동 버튼 클릭
        document.getElementById('sidebar-admin-pending').addEventListener('click', () => {
            AppState.currentView = 'adminDashboard';
            renderView();
        });
        
        // 전체 신청 내역 버튼 클릭
        document.getElementById('sidebar-admin-all-applications').addEventListener('click', () => {
            AppState.currentView = 'adminAllApplications';
            renderView();
        });
        
        // 신청 등록하기 버튼 클릭
        document.getElementById('sidebar-admin-create-application').addEventListener('click', () => {
            AppState.currentView = 'adminApplicationForm';
            renderView();
        });
        
        // 로그아웃 버튼 클릭
        document.getElementById('sidebar-admin-logout').addEventListener('click', () => {
            AppState.currentView = 'login';
            AppState.userList = [];
            renderView();
        });
    };
    
    /**
     * 관리자 개인별 복무상황부 화면 이벤트 초기화
     */
    const initAdminDutyStatusEvents = () => {
        // 햄버거 버튼 클릭 이벤트
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        if (hamburgerBtn && sidebar && overlay) {
            hamburgerBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                overlay.classList.toggle('open');
                hamburgerBtn.classList.toggle('active');
            });
            
            // 오버레이 클릭 시 사이드바 닫기
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('open');
                hamburgerBtn.classList.remove('active');
            });
        }
        
        // 처리할 신청 화면으로 이동 버튼 클릭
        document.getElementById('sidebar-admin-pending').addEventListener('click', () => {
            AppState.currentView = 'adminDashboard';
            renderView();
        });
        
        // 전체 신청 내역 버튼 클릭
        document.getElementById('sidebar-admin-all-applications').addEventListener('click', () => {
            AppState.currentView = 'adminAllApplications';
            renderView();
        });
        
        // 신청 등록하기 버튼 클릭
        document.getElementById('sidebar-admin-create-application').addEventListener('click', () => {
            AppState.currentView = 'adminApplicationForm';
            renderView();
        });
        
        // 개인별 복무상황부 버튼 클릭
        document.getElementById('sidebar-admin-duty-status').addEventListener('click', () => {
            AppState.currentView = 'adminUserSelect';
            renderView();
        });
        
        // 사용자 선택으로 돌아가기 버튼 클릭
        document.getElementById('btn-back-to-user-select').addEventListener('click', () => {
            AppState.currentView = 'adminUserSelect';
            renderView();
        });
        
        // 로그아웃 버튼 클릭
        document.getElementById('sidebar-admin-logout').addEventListener('click', () => {
            AppState.currentView = 'login';
            AppState.currentUserDutyStatus = null;
            renderView();
        });
    };

    // 햄버거 버튼/오버레이 반응형 사이드바 토글 (모든 화면에서 동작)
    function initSidebarHamburgerEvents() {
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (hamburgerBtn && sidebar && overlay) {
            hamburgerBtn.onclick = function() {
                sidebar.classList.add('open');
                overlay.style.display = 'block';
            };
            overlay.onclick = function() {
                sidebar.classList.remove('open');
                overlay.style.display = 'none';
            };
        }
    }

    // 앱 초기화 및 첫 화면 렌더링
    renderView();
}); 