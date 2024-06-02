// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EducationToken is ERC20, ERC20Burnable, Ownable {
    constructor(uint256 initialSupply) ERC20("EducationToken", "EDU") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

contract EducationPlatform is Ownable, ReentrancyGuard {
    EducationToken public token;
    uint256 public courseIdCounter;
    uint256 public registrationFee;
    uint256 public stakingFee = 1 * 10 ** 18; // 1 EDU token
    uint256 public inactivityPeriod = 180 days; // 6 months

    struct Course {
        uint256 id;
        string title;
        string description;
        address creator;
        address[] instructors;
        bool isActive;
        uint256 lastUpdated;
    }

    struct Enrollment {
        address student;
        uint256 courseId;
        bool paymentReceived;
        uint256 lastActive;
    }

    mapping(uint256 => Course) public courses;
    mapping(address => mapping(uint256 => bool)) public instructorStakes;
    mapping(address => mapping(uint256 => uint256)) public instructorLastCheckIn;
    mapping(address => mapping(uint256 => bool)) public courseCompletions;
    mapping(uint256 => Enrollment[]) public enrollments;  // Mapping of courseId to enrollments

    event CourseCreated(uint256 id, string title, address creator);
    event InstructorStaked(address instructor, uint256 courseId);
    event InstructorUnstaked(address instructor, uint256 courseId);
    event CourseCompleted(uint256 courseId, address student);
    event StudentEnrolled(address student, uint256 courseId, uint256 feePaid);
    event InstructorAssigned(uint256 courseId, address student, address instructor);
    event CourseInactivated(uint256 courseId, address creator);
    event InstructorCheckedIn(address instructor, uint256 courseId);
    event FeesDistributed(uint256 courseId, uint256 communityShare, uint256 instructorShare, uint256 creatorShare);
    event StudentRemoved(address student, uint256 courseId);
    event InstructorRemoved(address instructor, uint256 courseId);

    constructor(EducationToken _token, uint256 _registrationFee) Ownable(msg.sender) {
        token = _token;
        registrationFee = _registrationFee;
    }

    function createCourse(string memory title, string memory description) public {
        require(token.balanceOf(msg.sender) >= stakingFee, "Insufficient balance to create course");
        require(token.allowance(msg.sender, address(this)) >= stakingFee, "Token allowance too low");

        // Transfer the staking fee to the contract
        require(token.transferFrom(msg.sender, address(this), stakingFee), "Token transfer failed");

        Course memory newCourse = Course({
            id: courseIdCounter,
            title: title,
            description: description,
            creator: msg.sender,
            instructors: new address,
            isActive: true,
            lastUpdated: block.timestamp
        });

        courses[courseIdCounter] = newCourse;
        emit CourseCreated(courseIdCounter, title, msg.sender);
        courseIdCounter++;
    }

    function stakeAsInstructor(uint256 courseId) public {
        require(courses[courseId].isActive, "Course is not active");
        require(!instructorStakes[msg.sender][courseId], "Already staked as instructor");
        require(token.balanceOf(msg.sender) >= stakingFee, "Insufficient balance to stake as instructor");
        require(token.allowance(msg.sender, address(this)) >= stakingFee, "Token allowance too low");

        // Transfer the staking fee to the contract
        require(token.transferFrom(msg.sender, address(this), stakingFee), "Token transfer failed");

        instructorStakes[msg.sender][courseId] = true;
        instructorLastCheckIn[msg.sender][courseId] = block.timestamp;
        courses[courseId].instructors.push(msg.sender);
        courses[courseId].lastUpdated = block.timestamp;
        emit InstructorStaked(msg.sender, courseId);
    }

    function unstakeAsInstructor(uint256 courseId) public {
        require(courses[courseId].isActive, "Course is not active");
        require(instructorStakes[msg.sender][courseId], "You are not staked as an instructor for this course");

        instructorStakes[msg.sender][courseId] = false;
        removeInstructor(msg.sender, courseId);
        courses[courseId].lastUpdated = block.timestamp;
        emit InstructorUnstaked(msg.sender, courseId);
    }

    function enrollInCourse(uint256 courseId) public nonReentrant {
        require(courses[courseId].isActive, "Course is not active");
        require(token.balanceOf(msg.sender) >= registrationFee, "Insufficient balance to enroll");
        require(token.allowance(msg.sender, address(this)) >= registrationFee, "Token allowance too low");

        // Transfer the enrollment fee to the contract
        require(token.transferFrom(msg.sender, address(this), registrationFee), "Token transfer failed");

        enrollments[courseId].push(Enrollment({
            student: msg.sender,
            courseId: courseId,
            paymentReceived: true,
            lastActive: block.timestamp
        }));

        distributeFees(courseId);

        emit StudentEnrolled(msg.sender, courseId, registrationFee);
    }

    function distributeFees(uint256 courseId) internal {
        uint256 communityShare = registrationFee * 50 / 100;
        uint256 instructorShare = registrationFee * 25 / 100;
        uint256 creatorShare = registrationFee * 25 / 100;

        // Distribute shares
        require(token.transfer(courses[courseId].creator, creatorShare), "Token transfer to creator failed");

        for (uint256 i = 0; i < courses[courseId].instructors.length; i++) {
            require(token.transfer(courses[courseId].instructors[i], instructorShare / courses[courseId].instructors.length), "Token transfer to instructor failed");
        }

        // Mint community share
        token.mint(address(this), communityShare);

        // Burn a portion of the newly minted community share to control inflation
        uint256 burnAmount = communityShare * 20 / 100; // Burn 20% of the newly minted community share
        token.burn(burnAmount);

        emit FeesDistributed(courseId, communityShare, instructorShare, creatorShare);
    }

    function attestCourseCompletion(uint256 courseId, address student) public {
        require(instructorStakes[msg.sender][courseId], "Only an instructor can mark course as complete");
        require(msg.sender != student, "Instructor cannot approve their own course completion");

        // Remove student from enrollments
        for (uint256 i = 0; i < enrollments[courseId].length; i++) {
            if (enrollments[courseId][i].student == student) {
                enrollments[courseId][i] = enrollments[courseId][enrollments[courseId].length - 1];
                enrollments[courseId].pop();
                break;
            }
        }

        // Mark course as completed for student
        courseCompletions[student][courseId] = true;

        // Reward student with 5 EDU tokens
        token.mint(student, 5 * 10 ** 18); // 5 EDU tokens

        emit CourseCompleted(courseId, student);
    }

    function markCourseInactive(uint256 courseId) public {
        require(courses[courseId].creator == msg.sender, "Only the course creator can mark it as inactive");
        require(courses[courseId].isActive, "Course is already inactive");
        require(enrollments[courseId].length == 0, "Course has enrolled students");

        courses[courseId].isActive = false;
        removeAllInstructors(courseId);
        emit CourseInactivated(courseId, msg.sender);
    }

    function removeAllInstructors(uint256 courseId) internal {
        for (uint256 i = courses[courseId].instructors.length; i > 0; i--) {
            address instructor = courses[courseId].instructors[i - 1];
            instructorStakes[instructor][courseId] = false;
            courses[courseId].instructors.pop();
            emit InstructorRemoved(instructor, courseId);
        }
    }

    function removeInactiveInstructors(uint256 courseId) public onlyOwner {
        require(courses[courseId].isActive, "Course is not active");
        for (uint256 i = 0; i < courses[courseId].instructors.length; i++) {
            address instructor = courses[courseId].instructors[i];
            if (block.timestamp > instructorLastCheckIn[instructor][courseId] + inactivityPeriod) {
                instructorStakes[instructor][courseId] = false;
                removeInstructor(instructor, courseId);
            }
        }
    }

    function removeInactiveStudents(uint256 courseId) public onlyOwner {
        require(courses[courseId].isActive, "Course is not active");
        for (uint256 i = 0; i < enrollments[courseId].length; i++) {
            Enrollment storage enrollment = enrollments[courseId][i];
            if (block.timestamp > enrollment.lastActive + inactivityPeriod) {
                enrollments[courseId][i] = enrollments[courseId][enrollments[courseId].length - 1];
                enrollments[courseId].pop();
                emit StudentRemoved(enrollment.student, courseId);
            }
        }
    }

    function checkIn(uint256 courseId) public {
        require(instructorStakes[msg.sender][courseId], "You are not staked as an instructor for this course");
        instructorLastCheckIn[msg.sender][courseId] = block.timestamp;
        emit InstructorCheckedIn(msg.sender, courseId);
    }

    function removeInstructor(address instructor, uint256 courseId) internal {
        uint256 length = courses[courseId].instructors.length;
        for (uint256 i = 0; i < length; i++) {
            if (courses[courseId].instructors[i] == instructor) {
                courses[courseId].instructors[i] = courses[courseId].instructors[length - 1];
                courses[courseId].instructors.pop();
                emit InstructorRemoved(instructor, courseId);
                break;
            }
        }
    }
}
