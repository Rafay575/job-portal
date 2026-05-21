-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 14, 2026 at 06:19 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hayaibu_talent`
--

-- --------------------------------------------------------

--
-- Table structure for table `email_template`
--

CREATE TABLE `email_template` (
  `id` int(11) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `template` text NOT NULL,
  `variables` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`variables`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `email_template`
--

INSERT INTO `email_template` (`id`, `slug`, `subject`, `template`, `variables`, `created_at`, `updated_at`) VALUES
(5, 'otp_code', 'Your OTP Code', '<h1 style=\"text-align: center;\">🔐 Verify Your Email</h1><p style=\"text-align: center;\"></p><h4 style=\"text-align: center;\">One-Time Password</h4><p style=\"text-align: center;\">Use the secure verification code below. This code is valid for the next <strong>5 minutes</strong>.</p><p style=\"text-align: center;\"></p><h4 style=\"text-align: center;\">Verification Code</h4><h1 style=\"text-align: center;\">${otp}</h1><p style=\"text-align: center;\"></p><p style=\"text-align: center;\">If you didn’t request this code, you can safely ignore this email.</p><p style=\"text-align: center;\">© 2026 <strong>Hayaibu Talent</strong></p>', '[\"email\",\"otp\"]', '2026-04-13 13:01:57', '2026-04-14 14:17:09'),
(6, 'form_submission', 'Form Submitted Successfully', '<h1 style=\"text-align: center;\">✅ Submission Successful</h1><p style=\"text-align: center;\"></p><p style=\"text-align: center;\">Thank you <strong>${name}</strong>, your form has been submitted successfully.</p><p style=\"text-align: center;\">Our team will contact you soon.</p><h4 style=\"text-align: center;\"></h4><p style=\"text-align: center;\">Name: <strong>${name}</strong></p><p style=\"text-align: center;\">Email:<strong> ${email}</strong></p><p style=\"text-align: center;\"></p><p style=\"text-align: center;\">We will review your submission and get back to you shortly.</p><p style=\"text-align: center;\">© 2026 <strong>Hayaibu Talent</strong></p>', '[\"userId\",\"otp\",\"name\",\"submittedAt\"]', '2026-04-13 13:04:09', '2026-04-14 14:51:14'),
(7, 'approval_pending', 'Approval Pending', '<h1 style=\"text-align: center;\">⏳ Approval Pending</h1><p style=\"text-align: center;\"></p><p style=\"text-align: center;\">Hello <strong>${name}</strong>,Your submission is currently under review by our admin team. You are not yet eligible to proceed to the next step until approval is granted.</p><h3 style=\"text-align: center;\"></h3><p style=\"text-align: center;\">Name:<strong> ${name}</strong></p><p style=\"text-align: center;\">Email: <strong>${email}</strong></p><p style=\"text-align: center;\">Status: <strong>Pending Approval</strong></p><p style=\"text-align: center;\"></p><p style=\"text-align: center;\">⚠️ You will not be able to proceed until the admin approves your application.</p><p style=\"text-align: center;\">You will be notified immediately once your application is reviewed.</p><p style=\"text-align: center;\">© 2026 <strong>Hayaibu Talent</strong></p>', '[\"name\",\"email\"]', '2026-04-13 13:07:13', '2026-04-14 14:44:44'),
(8, 'application_approved', 'Application Approved ', '<h1 style=\"text-align: center;\">🎉 Congratulations ${name}!</h1><p style=\"text-align: center;\"></p><p style=\"text-align: center;\">Your application has been <strong>approved</strong> by our admin team.</p><p style=\"text-align: center;\">You can now proceed to the next steps and complete your profile.</p><p style=\"text-align: center;\"></p><p style=\"text-align: center;\">👉 Go to Dashboard: <strong>${dashboardUrl}</strong></p><p style=\"text-align: center;\"></p><p style=\"text-align: center;\">We’re excited to have you onboard!</p><p style=\"text-align: center;\">© 2026 <strong>Hayaibu Talent</strong></p>', '[\"email\",\"name\"]', '2026-04-13 13:08:21', '2026-04-14 14:51:36'),
(9, 'application_rejected', 'Application Rejected', '<h1 style=\"text-align: center;\">❌ Application Not Approved</h1><p style=\"text-align: center;\"></p><p style=\"text-align: center;\">Dear<strong> ${name}</strong>,</p><p style=\"text-align: center;\">Unfortunately your application was <strong>not approved</strong> at this time. This may be due to incorrect or incomplete information. Please review your details carefully and resubmit your application.</p><p style=\"text-align: center;\"></p><p style=\"text-align: center;\">👉 Review Application:<strong> ${dashboardUrl}</strong></p><p style=\"text-align: center;\"></p><p style=\"text-align: center;\">You can contact support if you believe this was a mistake.</p><p style=\"text-align: center;\">© 2026<strong> Hayaibu Talent</strong></p>', '[\"email\",\"name\"]', '2026-04-13 13:09:32', '2026-04-14 14:51:47'),
(10, 'account_created', 'Account Created Successfully ', '<h1 style=\"text-align: center;\">👤</h1><h1 style=\"text-align: center;\">Welcome, ${name}!</h1><p style=\"text-align: center;\"></p><p style=\"text-align: center;\">Your account has been <strong>created successfully</strong>.</p><p style=\"text-align: center;\">You can now log in and start using your dashboard.</p><p style=\"text-align: center;\"></p><p style=\"text-align: center;\">👉 Login here:<strong> ${loginUrl}</strong></p><p style=\"text-align: center;\"></p><p style=\"text-align: center;\">If you did not create this account, please contact support immediately <strong>support@hayaibutalent.com</strong></p><p style=\"text-align: center;\">© 2026 <strong>Hayaibu Talent</strong></p>', '[\"email\",\"name\"]', '2026-04-13 13:12:24', '2026-05-11 12:41:06');

-- --------------------------------------------------------

--
-- Table structure for table `employee_background`
--

CREATE TABLE `employee_background` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `has_convictions` tinyint(1) DEFAULT 0,
  `conviction_details` text DEFAULT NULL,
  `has_unspent_convictions` tinyint(1) DEFAULT 0,
  `unspent_details` text DEFAULT NULL,
  `fitness_investigation` tinyint(1) DEFAULT 0,
  `removed_from_register` tinyint(1) DEFAULT 0,
  `crb` tinyint(1) DEFAULT 0,
  `surname` varchar(100) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `crb_file_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_background`
--

INSERT INTO `employee_background` (`id`, `user_id`, `has_convictions`, `conviction_details`, `has_unspent_convictions`, `unspent_details`, `fitness_investigation`, `removed_from_register`, `crb`, `surname`, `dob`, `crb_file_path`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'dummy', 1, 'dummy', 1, 1, 1, 'dummy', '2026-03-04', '/uploads/1774887507766-SMP-Feedback.pdf', '2026-03-30 16:15:50', '2026-04-02 16:10:01'),
(5, 50, 0, NULL, 0, NULL, 1, 1, 1, 'Atif qadeer', '2026-05-08', '/uploads/1778770671306-abdullahsajjadresume.pdf', '2026-05-14 11:18:18', '2026-05-14 15:24:13');

-- --------------------------------------------------------

--
-- Table structure for table `employee_basic_information`
--

CREATE TABLE `employee_basic_information` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` varchar(200) NOT NULL DEFAULT 'permanent',
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `postcode` varchar(20) NOT NULL,
  `nationality` varchar(50) NOT NULL,
  `immigration_status` enum('citizen','settled','pre-settled','visa','other') NOT NULL,
  `immigration_expiry` date NOT NULL,
  `work_permit` tinyint(1) NOT NULL DEFAULT 0,
  `name_changed` tinyint(1) NOT NULL DEFAULT 0,
  `previous_name` varchar(100) DEFAULT NULL,
  `changed_to` varchar(100) DEFAULT NULL,
  `cv_file_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_basic_information`
--

INSERT INTO `employee_basic_information` (`id`, `user_id`, `type`, `full_name`, `email`, `phone`, `address`, `postcode`, `nationality`, `immigration_status`, `immigration_expiry`, `work_permit`, `name_changed`, `previous_name`, `changed_to`, `cv_file_path`, `created_at`, `updated_at`) VALUES
(61, 50, 'agency-work', 'Atif', 'atif@gmail.com', '43984938483', 'diowjdiwjdj', '302mkm', 'kwoskowkskdo', 'pre-settled', '2026-05-08', 0, 0, NULL, NULL, '/uploads/1778771584342-1778685294862-cvs_rejected_(1).pdf', '2026-05-14 15:12:12', '2026-05-14 15:24:09');

-- --------------------------------------------------------

--
-- Table structure for table `employee_declaration`
--

CREATE TABLE `employee_declaration` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `declaration_confirmed` tinyint(1) DEFAULT 0,
  `signature_file` varchar(255) DEFAULT NULL,
  `declaration_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_declaration`
--

INSERT INTO `employee_declaration` (`id`, `user_id`, `declaration_confirmed`, `signature_file`, `declaration_date`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '/uploads/1775146692716-AbdullahSajjadResume.pdf', '2026-03-06', '2026-03-31 11:17:01', '2026-04-02 16:18:18'),
(10, 50, 1, '/uploads/1778771650087-1778685294862-cvs_rejected_(1).pdf', '2026-05-08', '2026-05-14 15:14:10', '2026-05-14 15:14:10');

-- --------------------------------------------------------

--
-- Table structure for table `employee_documents`
--

CREATE TABLE `employee_documents` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `passport` varchar(255) DEFAULT NULL,
  `driving_licence` varchar(255) DEFAULT NULL,
  `proof_id1` varchar(255) DEFAULT NULL,
  `proof_id2` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_documents`
--

INSERT INTO `employee_documents` (`id`, `user_id`, `passport`, `driving_licence`, `proof_id1`, `proof_id2`, `created_at`, `updated_at`) VALUES
(1, 1, '/uploads/1774954397448-School_Based_LMS_Documentation.pdf', '/uploads/1774954397451-seafood_marketplace_requirements (2).pdf', '/uploads/1774954397454-SMP-Feedback.pdf', '/uploads/1774955574406-SMP-Feedback.pdf', '2026-03-31 10:53:17', '2026-04-02 16:10:27'),
(6, 50, '/uploads/1778770691824-abdullahsajjadresume.pdf', '/uploads/1778770691828-abdullahsajjadresume.pdf', '/uploads/1778770691830-abdullahsajjadresume.pdf', '/uploads/1778770691832-abdullahsajjadresume.pdf', '2026-05-14 11:38:27', '2026-05-14 14:58:12');

-- --------------------------------------------------------

--
-- Table structure for table `employee_educations`
--

CREATE TABLE `employee_educations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `entry_type` enum('education','gap') NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `qualification_type` varchar(100) DEFAULT NULL,
  `qualification_title` varchar(255) DEFAULT NULL,
  `institution_name` varchar(255) DEFAULT NULL,
  `institution_country` varchar(100) DEFAULT NULL,
  `awarding_body` varchar(255) DEFAULT NULL,
  `grade_or_result` varchar(50) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `completed` tinyint(1) DEFAULT 0,
  `has_professional_registration` tinyint(1) DEFAULT 0,
  `registration_body` varchar(255) DEFAULT NULL,
  `registration_number` varchar(100) DEFAULT NULL,
  `registration_expiry` date DEFAULT NULL,
  `certificate_file` text DEFAULT NULL,
  `additional_notes` text DEFAULT NULL,
  `gap_from` date DEFAULT NULL,
  `gap_to` date DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_educations`
--

INSERT INTO `employee_educations` (`id`, `user_id`, `entry_type`, `sort_order`, `qualification_type`, `qualification_title`, `institution_name`, `institution_country`, `awarding_body`, `grade_or_result`, `start_date`, `end_date`, `completed`, `has_professional_registration`, `registration_body`, `registration_number`, `registration_expiry`, `certificate_file`, `additional_notes`, `gap_from`, `gap_to`, `reason`, `created_at`, `updated_at`) VALUES
(42, 1, 'education', 1, 'A-Level', 'qsqs', 'sqqs', 'United Kingdomsqs', 'sqs', 'sqsq', '2026-03-02', '2026-03-21', 1, 1, 'hello', 'hello', '2026-04-17', '/uploads/1774971890840-AbdullahSajjadResume.pdf', 'hello', NULL, NULL, NULL, '2026-04-02 16:10:43', '2026-04-02 16:10:43'),
(43, 1, 'gap', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, '2026-02-27', '2026-03-24', 'hello', '2026-04-02 16:10:43', '2026-04-02 16:10:43'),
(44, 1, 'education', 3, 'Foundation Degree', 'Proident quia aut v', 'Laborum Ut porro eu', 'Ut qui nesciunt mod', 'Ducimus velit ab p', 'Laudantium voluptas', '1977-08-30', '1978-02-20', 1, 1, 'hello', 'hello', '2026-04-03', '/uploads/1774971890837-AbdullahSajjadResume.pdf', 'hello', NULL, NULL, NULL, '2026-04-02 16:10:43', '2026-04-02 16:10:43'),
(90, 50, 'education', 1, 'GCSE / O-Level', 'bla', 'bla', 'bla', 'bla', 'bla', '2026-05-07', '2026-05-07', 1, 1, 'blaz', 'bla', '2026-05-09', '/uploads/1778770705592-abdullahsajjadresume.pdf', 'bla', NULL, NULL, NULL, '2026-05-14 14:58:25', '2026-05-14 14:58:25'),
(91, 50, 'gap', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, '2026-05-06', '2026-05-16', 'bla', '2026-05-14 14:58:25', '2026-05-14 14:58:25'),
(92, 50, 'education', 3, 'A-Level', 'bla', 'bla', 'bla', 'bla', 'bla', '2026-05-01', '2026-05-14', 1, 0, NULL, NULL, NULL, '/uploads/1778770705707-abdullahsajjadresume.pdf', 'bla', NULL, NULL, NULL, '2026-05-14 14:58:25', '2026-05-14 14:58:25');

-- --------------------------------------------------------

--
-- Table structure for table `employee_experience`
--

CREATE TABLE `employee_experience` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `kind` enum('experience','gap') NOT NULL,
  `sort_order` int(11) NOT NULL,
  `employer_name` varchar(255) DEFAULT NULL,
  `job_title` varchar(255) DEFAULT NULL,
  `duties` text DEFAULT NULL,
  `date_from` date DEFAULT NULL,
  `date_to` date DEFAULT NULL,
  `gap_from` date DEFAULT NULL,
  `gap_to` date DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_experience`
--

INSERT INTO `employee_experience` (`id`, `user_id`, `kind`, `sort_order`, `employer_name`, `job_title`, `duties`, `date_from`, `date_to`, `gap_from`, `gap_to`, `reason`, `created_at`, `updated_at`) VALUES
(20, 1, 'experience', 1, 'Dolor quos ea offici', 'Id sed numquam id po', 'Eaque quae in corrup', '2003-07-25', '2005-02-16', NULL, NULL, NULL, '2026-04-02 16:10:54', '2026-04-02 16:10:54'),
(21, 1, 'gap', 2, NULL, NULL, NULL, NULL, NULL, '1991-07-23', '1999-10-10', 'Officia eos possimu', '2026-04-02 16:10:54', '2026-04-02 16:10:54'),
(30, 50, 'experience', 1, 'gtgtgt', 'tgtgt', 'gtgtg', '2026-05-06', '2026-05-08', NULL, NULL, NULL, '2026-05-14 14:58:37', '2026-05-14 14:58:37');

-- --------------------------------------------------------

--
-- Table structure for table `employee_experience_areas`
--

CREATE TABLE `employee_experience_areas` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `mental_health` tinyint(1) DEFAULT 0,
  `learning_disabilities` tinyint(1) DEFAULT 0,
  `drug_and_alcohol` tinyint(1) DEFAULT 0,
  `housing` tinyint(1) DEFAULT 0,
  `elderly` tinyint(1) DEFAULT 0,
  `children_young_people` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_experience_areas`
--

INSERT INTO `employee_experience_areas` (`id`, `user_id`, `mental_health`, `learning_disabilities`, `drug_and_alcohol`, `housing`, `elderly`, `children_young_people`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 0, 0, 0, 1, '2026-03-31 17:45:09', '2026-04-02 16:10:54'),
(5, 50, 1, 0, 0, 0, 0, 0, '2026-05-14 13:47:27', '2026-05-14 14:58:37');

-- --------------------------------------------------------

--
-- Table structure for table `employee_health`
--

CREATE TABLE `employee_health` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `absent_days` varchar(50) DEFAULT NULL,
  `absence_periods` varchar(50) DEFAULT NULL,
  `on_medication` tinyint(1) DEFAULT 0,
  `medication_details` text DEFAULT NULL,
  `health_treatment` tinyint(1) DEFAULT 0,
  `treatment_details` text DEFAULT NULL,
  `medical_condition` tinyint(1) DEFAULT 0,
  `condition_details` text DEFAULT NULL,
  `disabled` tinyint(1) DEFAULT 0,
  `impairment_type` varchar(255) DEFAULT NULL,
  `night_shift_fit` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_health`
--

INSERT INTO `employee_health` (`id`, `user_id`, `absent_days`, `absence_periods`, `on_medication`, `medication_details`, `health_treatment`, `treatment_details`, `medical_condition`, `condition_details`, `disabled`, `impairment_type`, `night_shift_fit`, `created_at`, `updated_at`) VALUES
(1, 1, 'yes alot', '10', 1, 'heart issue', 1, 'yes brain ', 1, 'yes fungal', 1, 'helo', 1, '2026-03-30 16:47:31', '2026-03-30 16:48:11'),
(5, 50, 'dd', 'dwd', 1, 'wd', 1, 'dwdw', 1, 'dwdw', 1, 'wdd', 1, '2026-05-14 11:30:57', '2026-05-14 14:57:54');

-- --------------------------------------------------------

--
-- Table structure for table `employee_questions`
--

CREATE TABLE `employee_questions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `availability_issue` tinyint(1) DEFAULT 0,
  `overtime` tinyint(1) DEFAULT 0,
  `hours_avoid` varchar(50) NOT NULL,
  `notice_period` varchar(50) NOT NULL,
  `applied_before` tinyint(1) DEFAULT 0,
  `applied_details` text DEFAULT NULL,
  `work_restrictions` tinyint(1) DEFAULT 0,
  `restriction_details` text DEFAULT NULL,
  `worked_before` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_questions`
--

INSERT INTO `employee_questions` (`id`, `user_id`, `availability_issue`, `overtime`, `hours_avoid`, `notice_period`, `applied_before`, `applied_details`, `work_restrictions`, `restriction_details`, `worked_before`, `created_at`, `updated_at`) VALUES
(2, 1, 1, 1, 'Day shift', '1 week', 1, 'Web Development', 1, 'No Details of Restrictions', 1, '2026-03-30 15:30:31', '2026-03-30 15:31:14'),
(6, 50, 1, 1, '7 hours', '1 week', 1, 'web developer', 1, 'no ', 1, '2026-05-14 11:17:36', '2026-05-14 15:24:10');

-- --------------------------------------------------------

--
-- Table structure for table `employee_registration`
--

CREATE TABLE `employee_registration` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `is_nurse` tinyint(1) DEFAULT 0,
  `professional_body` varchar(255) DEFAULT NULL,
  `registration_type` varchar(100) DEFAULT NULL,
  `registration_number` varchar(100) DEFAULT NULL,
  `registration_expiry` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_registration`
--

INSERT INTO `employee_registration` (`id`, `user_id`, `is_nurse`, `professional_body`, `registration_type`, `registration_number`, `registration_expiry`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'no body', 'job', '333', '2026-03-03', '2026-03-30 17:03:38', '2026-04-02 16:10:15'),
(6, 50, 1, 'dwdw', 'dwdw', 'dwdw', '2026-05-07', '2026-05-14 11:31:31', '2026-05-14 14:57:56');

-- --------------------------------------------------------

--
-- Table structure for table `employee_statement`
--

CREATE TABLE `employee_statement` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `supporting_statement` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_statement`
--

INSERT INTO `employee_statement` (`id`, `user_id`, `supporting_statement`, `created_at`, `updated_at`) VALUES
(1, 1, 'This is the statements', '2026-03-31 11:00:01', '2026-04-02 16:10:56'),
(6, 50, 'huhhu', '2026-05-14 14:58:41', '2026-05-14 14:58:41');

-- --------------------------------------------------------

--
-- Table structure for table `employee_trainings`
--

CREATE TABLE `employee_trainings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `duration` varchar(100) NOT NULL,
  `completion_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_trainings`
--

INSERT INTO `employee_trainings` (`id`, `user_id`, `title`, `provider`, `duration`, `completion_date`, `created_at`, `updated_at`) VALUES
(8, 1, 'web dev', 'hamza', '3 months', '2026-02-27', '2026-04-02 16:10:28', '2026-04-02 16:10:28'),
(9, 1, 'ai', 'basit', '2 months', '2026-03-02', '2026-04-02 16:10:28', '2026-04-02 16:10:28'),
(18, 50, 'ojojoj', 'kojoj', 'ojojo', '2026-05-07', '2026-05-14 14:58:14', '2026-05-14 14:58:14');

-- --------------------------------------------------------

--
-- Table structure for table `otp_verifications`
--

CREATE TABLE `otp_verifications` (
  `id` int(11) NOT NULL,
  `email` varchar(150) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `type` enum('register','reset') DEFAULT 'register',
  `meta_value` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `otp_verifications`
--

INSERT INTO `otp_verifications` (`id`, `email`, `otp`, `expires_at`, `created_at`, `type`, `meta_value`) VALUES
(109, 'abdullahmug2332@gmail.com', '871928', '2026-05-12 21:36:31', '2026-05-12 16:26:31', 'reset', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `role` varchar(200) NOT NULL DEFAULT 'employee',
  `name` varchar(250) NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_approved` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role`, `name`, `email`, `password`, `is_verified`, `created_at`, `is_approved`) VALUES
(1, 'admin', 'abdullah sajjad', 'abdullahmug2332@gmail.com', '$2a$10$btGv9/QJbjRo5sfs8kevPuRnqWk0Qldma08tXJVhVVXPLbLpJme3S', 1, '2026-02-02 14:12:33', 'approved'),
(50, 'employee', 'Atif Qadeer', 'atifqadeer26@gmail.com', '$2a$10$btGv9/QJbjRo5sfs8kevPuRnqWk0Qldma08tXJVhVVXPLbLpJme3S', 1, '2026-02-02 14:12:33', 'approved');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `email_template`
--
ALTER TABLE `email_template`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `employee_background`
--
ALTER TABLE `employee_background`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_employee_background_user` (`user_id`);

--
-- Indexes for table `employee_basic_information`
--
ALTER TABLE `employee_basic_information`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user` (`user_id`);

--
-- Indexes for table `employee_declaration`
--
ALTER TABLE `employee_declaration`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user` (`user_id`);

--
-- Indexes for table `employee_documents`
--
ALTER TABLE `employee_documents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user` (`user_id`);

--
-- Indexes for table `employee_educations`
--
ALTER TABLE `employee_educations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_user_sort` (`user_id`,`sort_order`);

--
-- Indexes for table `employee_experience`
--
ALTER TABLE `employee_experience`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_sort` (`user_id`,`sort_order`);

--
-- Indexes for table `employee_experience_areas`
--
ALTER TABLE `employee_experience_areas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `employee_health`
--
ALTER TABLE `employee_health`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_employee_health_user` (`user_id`);

--
-- Indexes for table `employee_questions`
--
ALTER TABLE `employee_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_employ_questions_user` (`user_id`);

--
-- Indexes for table `employee_registration`
--
ALTER TABLE `employee_registration`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_employee_registration_user` (`user_id`);

--
-- Indexes for table `employee_statement`
--
ALTER TABLE `employee_statement`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user` (`user_id`);

--
-- Indexes for table `employee_trainings`
--
ALTER TABLE `employee_trainings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `otp_verifications`
--
ALTER TABLE `otp_verifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_users_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `email_template`
--
ALTER TABLE `email_template`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `employee_background`
--
ALTER TABLE `employee_background`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `employee_basic_information`
--
ALTER TABLE `employee_basic_information`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `employee_declaration`
--
ALTER TABLE `employee_declaration`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `employee_documents`
--
ALTER TABLE `employee_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `employee_educations`
--
ALTER TABLE `employee_educations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `employee_experience`
--
ALTER TABLE `employee_experience`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `employee_experience_areas`
--
ALTER TABLE `employee_experience_areas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `employee_health`
--
ALTER TABLE `employee_health`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `employee_questions`
--
ALTER TABLE `employee_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `employee_registration`
--
ALTER TABLE `employee_registration`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `employee_statement`
--
ALTER TABLE `employee_statement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `employee_trainings`
--
ALTER TABLE `employee_trainings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `otp_verifications`
--
ALTER TABLE `otp_verifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `employee_background`
--
ALTER TABLE `employee_background`
  ADD CONSTRAINT `fk_employee_background_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_basic_information`
--
ALTER TABLE `employee_basic_information`
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_declaration`
--
ALTER TABLE `employee_declaration`
  ADD CONSTRAINT `fk_employee_declaration_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_documents`
--
ALTER TABLE `employee_documents`
  ADD CONSTRAINT `fk_employee_documents_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employee_educations`
--
ALTER TABLE `employee_educations`
  ADD CONSTRAINT `fk_employee_education_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employee_experience`
--
ALTER TABLE `employee_experience`
  ADD CONSTRAINT `employee_experience_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_experience_areas`
--
ALTER TABLE `employee_experience_areas`
  ADD CONSTRAINT `employee_experience_areas_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_health`
--
ALTER TABLE `employee_health`
  ADD CONSTRAINT `fk_employee_health_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_questions`
--
ALTER TABLE `employee_questions`
  ADD CONSTRAINT `fk_employ_questions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_registration`
--
ALTER TABLE `employee_registration`
  ADD CONSTRAINT `fk_employee_registration_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_statement`
--
ALTER TABLE `employee_statement`
  ADD CONSTRAINT `fk_employee_statement_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employee_trainings`
--
ALTER TABLE `employee_trainings`
  ADD CONSTRAINT `fk_employee_trainings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
