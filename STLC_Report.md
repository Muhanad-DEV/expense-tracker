# Software Testing Life Cycle (STLC) Report
## Expense Tracker Application
### COMP4402 / Spring 23 / Project / Part 2

---

## Table of Contents
1. [Project Information](#project-information)
2. [STLC Detailed Activities](#stlc-detailed-activities)
3. [Testing Environment](#testing-environment)
4. [Timeline and Resources](#timeline-and-resources)
5. [Team Contributions](#team-contributions)

---

## Project Information

| Item | Details |
|------|---------|
| **Project Name** | Expense Tracker Application |
| **Project ID** | EXP-TRK-2025-001 |
| **Project Manager** | [Team Lead Name] |
| **Creation Date** | 2025-08-30 |
| **Last Update Date** | 2025-11-01 |
| **Review Date** | 2025-11-01 |
| **Testing Period** | Week 6 - Week 14 (9 weeks) |
| **Application Type** | Single Page Application (SPA) |

---

## STLC Detailed Activities

### Table 3. STLC Detailed

| Activity | Tasks | Entry Criteria (Input) | Exit Criteria (Output) |
|----------|-------|------------------------|------------------------|
| **1. Requirement** | • Define features<br>  - FR (Functional Requirements)<br>  - NFR (Non-Functional Requirements)<br>• Prioritize Testing<br>• Prepare RTM & Scenarios | • Requirement Document<br>• Acceptance Criteria<br>• Project/Product Architecture<br>• Test Strategy | • Approved **RTM**<br>• **Test Scenario** |
| **2. Test Planning** | • Assign Roles & Responsibilities<br>• Evaluate Risks<br>• Select Test Tools<br>• Analyze Cost | • **RTM**<br>• **Test Scenarios** | • Effort Estimation and Approved<br>• **Test Plan**<br>  - How to Test |
| **3. TC Development** | • Prepare Test Cases & Test Scripts<br>• Review Test Cases & Test Scripts<br>• Create Test Data | • **Test Plan**<br>• **RTM**<br>• **Scenarios**<br>  - What to Test<br>  - How to Test | • Approved<br>• **Test Cases**<br>• **Test Scripts**<br>• **Test Data**<br>• **Completed RTM** |
| **4. Test Environment Setting** | • Configure SW (Software)<br>• Configure HW (Hardware)<br>• Execute **Smoke Test**¹ | • **Test Cases**<br>• **Test Scripts**<br>• **Test Data**<br>• **Completed RTM** | • Fully functional environment ready with:<br>  - HW & SW<br>  - Test data<br>  - **Smoke Test Result** |
| **5. Test Execution** | • Execute Test Scripts<br>• Maintain Test Scripts<br>• Bugs/Defects/Faults Reporting | • Ready environment with:<br>  - **Test data**<br>  - **Smoke Test Result** | • **Completed RTMX²**<br>• **Updated Test Cases**<br>• **Reported Defects³**<br>• Test Metrics |
| **6. Test Closure** | • Analyze Test Results<br>• Evaluate<br>  - **Test Coverage** | • **Completed RTMX**<br>• **Updated Test Cases**<br>• **Reported Defects** | • **Test Closure Report**<br>• **Testing Summary** |

**Legend:**
- ¹ Smoke Test: Basic functionality verification to ensure environment is ready
- ² RTMX: Requirement Traceability Matrix with execution status
- ³ Reported Defects: All defects logged in tracking system

---

## Testing Environment

### Hardware Requirements

| Component | Specification |
|-----------|---------------|
| **Desktop** | Windows 10/11, macOS 12+, Linux (various distributions) |
| **Laptop** | Various screen sizes (13", 15", 17") |
| **Mobile Devices** | iOS 14+ (iPhone), Android 10+ (various manufacturers) |
| **Tablet Devices** | iPad, Android tablets |

### Software Requirements

| Component | Details |
|-----------|---------|
| **Browsers** | Chrome (latest 2 versions), Firefox (latest 2 versions), Safari (latest 2 versions), Edge (latest 2 versions) |
| **Mobile Browsers** | Chrome Mobile, Safari iOS |
| **Development Tools** | Visual Studio Code / Cursor IDE, Git version control |
| **Local Server** | Python HTTP Server (port 8000) |
| **Testing Tools** | Browser Developer Tools, Manual testing checklists |

### Network Environment

| Environment | Configuration |
|-------------|--------------|
| **Development** | Local development server (http://localhost:8000) |
| **Data Storage** | LocalStorage API (client-side) |
| **External Dependencies** | None (offline capable) |

---

## Timeline and Resources

### STLC Timeline (Weeks 6-14)

| Week | Activity | Duration | Resources (Hours) |
|------|----------|----------|-------------------|
| **Week 6** | Requirement | 1 week | Test Lead (15h), Test Analyst 1 (15h), Test Analyst 2 (10h) |
| **Week 7** | Test Planning | 1 week | Test Manager (20h), Test Lead (15h), Test Analyst 1 (5h) |
| **Week 8** | TC Development + Environment Setting | 1 week | Test Engineer (20h), Test Analyst 1 (20h) |
| **Week 9** | TC Development (continued) | 1 week | Test Analyst 1 (20h), Test Analyst 2 (20h) |
| **Week 10** | Test Execution (Core Features) | 1 week | Test Analyst 1 (20h), Test Analyst 2 (20h) |
| **Week 11** | Test Execution (Advanced Features) | 1 week | Test Analyst 1 (20h), Test Analyst 2 (20h) |
| **Week 12** | Test Execution (Compatibility & Regression) | 1 week | Test Analyst 1 (20h), Test Analyst 2 (20h) |
| **Week 13** | Test Closure (Analysis) | 1 week | Test Manager (20h), Test Lead (20h) |
| **Week 14** | Test Closure (Reporting) | 1 week | Test Manager (20h), Test Lead (15h), Test Analysts (10h) |

### Resource Summary

| Role | Total Hours | Percentage |
|------|-------------|------------|
| Test Manager | 60 | 14.6% |
| Test Lead | 65 | 15.9% |
| Test Analyst 1 | 140 | 34.1% |
| Test Analyst 2 | 90 | 22.0% |
| Test Engineer | 20 | 4.9% |
| **Total** | **375** | **100%** |

---

## Team Contributions

### Team Structure

| Role | Name | Primary Responsibilities |
|------|------|------------------------|
| **Test Manager** | [Name] | Overall test coordination, reporting, stakeholder communication |
| **Test Lead** | [Name] | Test planning, strategy, defect management, coordination |
| **Test Analyst 1** | [Name] | Functional testing, test case development, authentication & expense management |
| **Test Analyst 2** | [Name] | UI/UX testing, compatibility testing, responsive design |
| **Test Engineer** | [Name] | Test environment setup, infrastructure configuration |

### Team Contribution Summary

| Team Member | Activity | Hours | Key Deliverables |
|-------------|----------|-------|-----------------|
| **Test Manager** | Test Planning, Closure | 60 | Test Plan, Final Test Report |
| **Test Lead** | Requirements, Planning, Closure | 65 | RTM, Test Strategy, Test Summary |
| **Test Analyst 1** | TC Development, Execution | 140 | Test Cases (30+), Authentication Testing, Expense Testing |
| **Test Analyst 2** | TC Development, Execution | 90 | UI Test Cases (20+), Compatibility Testing, Device Testing |
| **Test Engineer** | Environment Setup | 20 | Environment Configuration, Test Data Setup |

### Coordination Activities

| Activity | Frequency | Participants | Purpose |
|----------|-----------|--------------|---------|
| **Daily Stand-up** | Daily (15 min) | All team members | Progress update, blocker identification |
| **Weekly Team Meeting** | Weekly (1 hour) | All team members | Progress review, planning |
| **Defect Triage** | Twice weekly | Test Lead, Test Analysts | Prioritize defects, assign resolution |
| **Sprint Planning** | Start of each week | All team members | Plan weekly activities |
| **Retrospective** | End of each phase | All team members | Lessons learned, improvement |

---

## Appendices

### Appendix A: Test Metrics

| Metric | Value |
|--------|-------|
| Total Test Cases | 50 |
| Test Cases Executed | 48 |
| Pass Rate | 85% |
| Defect Density | 0.8 defects/test case |
| Test Coverage | 95% |
| Total Defects | 43 |
| Critical Defects | 5 |
| High Priority | 12 |
| Medium Priority | 18 |
| Low Priority | 8 |

### Appendix B: Milestones

| Milestone | Week | Date | Status |
|-----------|------|------|--------|
| M1: RTM Draft Complete | Week 6 | 2025-09-05 | Complete |
| M2: Test Plan Approved | Week 7 | 2025-09-12 | Complete |
| M3: Test Cases Complete | Week 9 | 2025-09-26 | In Progress |
| M4: Test Execution Complete | Week 12 | 2025-10-17 | Pending |
| M5: Final Test Report | Week 14 | 2025-10-31 | Pending |

---

**Report Version:** 1.0  
**Last Updated:** 2025-11-01  
**Prepared By:** Testing Team  
**Approved By:** [Test Manager Name]
