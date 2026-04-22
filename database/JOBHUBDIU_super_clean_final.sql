-- =====================================================
-- DIUJOBHUB - super clean import file
-- =====================================================

CREATE DATABASE IF NOT EXISTS `DIUJOBHUB`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `DIUJOBHUB`;

-- =====================================================
-- DIUJOBHUB - import version with safe drop order
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET NAMES utf8mb4;

-- Drop child tables first, then parent tables
DROP TABLE IF EXISTS `saved_jobs`;
DROP TABLE IF EXISTS `applications`;
DROP TABLE IF EXISTS `candidates`;
DROP TABLE IF EXISTS `user_profiles`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `system_settings`;
DROP TABLE IF EXISTS `users`;

SET NAMES utf8mb4;

-- =====================================================
-- Table: users
-- =====================================================
CREATE TABLE `users` (
    `id`        VARCHAR(50)  NOT NULL,
    `name`      VARCHAR(100) NOT NULL,
    `email`     VARCHAR(100) NOT NULL,
    `password`  VARCHAR(255) NOT NULL,
    `role`      VARCHAR(20)  NOT NULL COMMENT 'seeker | employer | admin',
    `initials`  VARCHAR(5)   NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `initials`) VALUES
('u1', 'Alex Morgan',  'seeker@demo.com',   'demo123', 'seeker',   'AM'),
('u2', 'Acme Inc.',    'employer@demo.com', 'demo123', 'employer', 'AI'),
('u3', 'System Admin', 'admin@demo.com',    'demo123', 'admin',    'SA');

-- =====================================================
-- Table: user_profiles
-- =====================================================
CREATE TABLE `user_profiles` (
    `id`           INT          NOT NULL AUTO_INCREMENT,
    `user_id`      VARCHAR(50)  DEFAULT NULL,
    `company_name` VARCHAR(150) DEFAULT NULL,
    `university`   VARCHAR(150) DEFAULT NULL,
    `cgpa`         FLOAT        DEFAULT NULL,
    `semester`     INT          DEFAULT NULL,
    `experience`   TEXT         DEFAULT NULL,
    `skills_json`  JSON         DEFAULT NULL,
    `courses_json` JSON         DEFAULT NULL,
    `phone`        VARCHAR(20)  DEFAULT NULL,
    `reg_id`       VARCHAR(50)  DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_up_user` (`user_id`),
    CONSTRAINT `fk_up_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: system_settings
-- =====================================================
CREATE TABLE `system_settings` (
    `setting_key`   VARCHAR(50) NOT NULL,
    `setting_value` JSON        DEFAULT NULL,
    PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `system_settings` (`setting_key`, `setting_value`) VALUES
('ai_config', '{"provider":"local","apiKey":"","model":"","ollamaEndpoint":"http://localhost:11434","temperature":0.7,"maxTokens":1024,"scoreThresholds":{},"autoReject":true,"enableRecommendations":true}');

-- =====================================================
-- Table: jobs
-- =====================================================
CREATE TABLE `jobs` (
    `id`               VARCHAR(50)  NOT NULL,
    `title`            VARCHAR(150) DEFAULT NULL,
    `company`          VARCHAR(100) DEFAULT NULL,
    `logo`             VARCHAR(10)  DEFAULT NULL,
    `logoBg`           VARCHAR(100) DEFAULT NULL,
    `location`         VARCHAR(100) DEFAULT NULL,
    `type`             VARCHAR(50)  DEFAULT NULL,
    `level`            VARCHAR(50)  DEFAULT NULL,
    `salary`           VARCHAR(100) DEFAULT NULL,
    `posted`           VARCHAR(50)  DEFAULT NULL,
    `description`      TEXT         DEFAULT NULL,
    `applicants`       INT          NOT NULL DEFAULT 0,
    `remote`           TINYINT(1)   NOT NULL DEFAULT 0,
    `tags`             JSON         DEFAULT NULL,
    `responsibilities` JSON         DEFAULT NULL,
    `requirements`     JSON         DEFAULT NULL,
    `views`            INT          NOT NULL DEFAULT 0,
    `status`           VARCHAR(50)  NOT NULL DEFAULT 'Active',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `jobs` (`id`, `title`, `company`, `logo`, `logoBg`, `location`, `type`, `level`, `salary`, `posted`, `description`, `applicants`, `remote`, `tags`, `responsibilities`, `requirements`, `views`, `status`) VALUES
('1',  'Senior Product Designer',     'Linear',    'L', 'from-violet-500 to-fuchsia-500', 'San Francisco, CA', 'Full-time', 'Senior', '$160k - $210k',   '2 days ago', 'Shape the future of project management...', 84,  0, '["Figma", "Design Systems", "Prototyping"]', '["Lead end-to-end design", "Partner with engineering"]', '["5+ years designing"]',        1200, 'Active'),
('2',  'Frontend Engineer, Platform', 'Vercel',    'V', 'from-slate-800 to-slate-600',    'Remote',            'Remote',    'Mid',    '$130k - $180k',   '1 day ago',  'Build the dashboard...',                    212, 1, '["React", "Next.js"]',                      '["Develop core dashboard"]',                            '["3+ years with React"]',        3200, 'Active'),
('3',  'Staff ML Engineer',           'Anthropic', 'A', 'from-amber-500 to-orange-500',   'London, UK',        'Full-time', 'Lead',   'GBP 200k - 280k', '3 days ago', 'Push the frontier...',                      489, 0, '["PyTorch", "LLMs"]',                       '["Design and train large-scale models"]',               '["PhD or equivalent"]',          5400, 'Active'),
('4',  'Product Manager, Growth',     'Notion',    'N', 'from-zinc-700 to-zinc-900',      'New York, NY',      'Full-time', 'Senior', '$170k - $220k',   '5 days ago', 'Own the activation funnel...',              156, 0, '["Growth", "Experimentation"]',             '["Own the new-user activation funnel"]',                '["5+ years in PM"]',             1800, 'Active'),
('5',  'Brand Designer',              'Stripe',    'S', 'from-indigo-500 to-purple-500',  'Dublin, IE',        'Contract',  'Mid',    'EUR 80 - 120 / hr', '1 week ago', 'Help craft the visual identity...',          67, 1, '["Branding", "Illustration"]',              '["Design brand campaigns end-to-end"]',                 '["4+ years brand"]',              900, 'Active'),
('6',  'iOS Engineer',                'Arc',       'A', 'from-pink-500 to-rose-500',      'Remote',            'Full-time', 'Senior', '$150k - $200k',   '4 days ago', 'Reimagine browsing on mobile...',            98, 1, '["Swift", "SwiftUI"]',                      '["Architect and build the iOS app"]',                   '["5+ years shipping iOS apps"]', 1100, 'Active'),
('e1', 'Senior Backend Engineer',     'Acme Inc.', 'A', 'from-blue-500 to-cyan-500',      'Remote',            'Full-time', 'Senior', '$140k - $190k',   '5d ago',     'Backend engineering...',                    142, 1, '[]',                                        '[]',                                                    '[]',                             2840, 'Active'),
('e2', 'Product Designer',            'Acme Inc.', 'A', 'from-blue-500 to-cyan-500',      'Remote',            'Full-time', 'Mid',    '$100k - $140k',   '1w ago',     'Design...',                                  89, 1, '[]',                                        '[]',                                                    '[]',                             1920, 'Active'),
('e3', 'Marketing Lead',              'Acme Inc.', 'A', 'from-blue-500 to-cyan-500',      'Remote',            'Full-time', 'Lead',   '$120k - $160k',   '2w ago',     'Marketing...',                               34, 1, '[]',                                        '[]',                                                    '[]',                              612, 'Draft'),
('e4', 'DevOps Engineer',             'Acme Inc.', 'A', 'from-blue-500 to-cyan-500',      'Remote',            'Full-time', 'Mid',    '$130k - $170k',   '3w ago',     'Devops...',                                  67, 1, '[]',                                        '[]',                                                    '[]',                             1140, 'Closed');

-- =====================================================
-- Table: applications
-- =====================================================
CREATE TABLE `applications` (
    `id`         INT         NOT NULL AUTO_INCREMENT,
    `user_id`    VARCHAR(50) DEFAULT NULL,
    `job_id`     VARCHAR(50) DEFAULT NULL,
    `status`     VARCHAR(50) DEFAULT NULL,
    `applied_at` VARCHAR(50) DEFAULT NULL,
    `stage`      INT         DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_app_user` (`user_id`),
    KEY `fk_app_job`  (`job_id`),
    CONSTRAINT `fk_app_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_app_job`
        FOREIGN KEY (`job_id`)  REFERENCES `jobs`  (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `applications` (`user_id`, `job_id`, `status`, `applied_at`, `stage`) VALUES
('u1', '1', 'Interviewing', 'Apr 2',  3),
('u1', '4', 'Applied',      'Apr 8',  1),
('u1', '6', 'In Review',    'Apr 12', 2);

-- =====================================================
-- Table: saved_jobs
-- =====================================================
CREATE TABLE `saved_jobs` (
    `id`       INT         NOT NULL AUTO_INCREMENT,
    `user_id`  VARCHAR(50) NOT NULL,
    `job_id`   VARCHAR(50) NOT NULL,
    `saved_at` TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_saved_user_job` (`user_id`, `job_id`),
    KEY `fk_saved_user` (`user_id`),
    KEY `fk_saved_job`  (`job_id`),
    CONSTRAINT `fk_saved_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_saved_job`
        FOREIGN KEY (`job_id`)  REFERENCES `jobs`  (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `saved_jobs` (`user_id`, `job_id`) VALUES
('u1', '2'),
('u1', '3'),
('u1', '5');

-- =====================================================
-- Table: candidates
-- =====================================================
CREATE TABLE `candidates` (
    `id`          VARCHAR(50)  NOT NULL,
    `name`        VARCHAR(100) DEFAULT NULL,
    `initials`    VARCHAR(10)  DEFAULT NULL,
    `role`        VARCHAR(100) DEFAULT NULL,
    `job_id`      VARCHAR(50)  DEFAULT NULL,
    `job_title`   VARCHAR(150) DEFAULT NULL,
    `match_score` INT          DEFAULT NULL,
    `experience`  VARCHAR(50)  DEFAULT NULL,
    `location`    VARCHAR(100) DEFAULT NULL,
    `applied_at`  VARCHAR(50)  DEFAULT NULL,
    `status`      VARCHAR(50)  DEFAULT NULL,
    `skills`      JSON         DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_cand_job` (`job_id`),
    CONSTRAINT `fk_cand_job`
        FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `candidates` (`id`, `name`, `initials`, `role`, `job_id`, `job_title`, `match_score`, `experience`, `location`, `applied_at`, `status`, `skills`) VALUES
('a1', 'Sara Chen',     'SC', 'Senior Backend Engineer', 'e1', 'Senior Backend Engineer', 96, '7 yrs', 'Berlin, DE', '2h ago', 'Shortlisted',  '["Go", "Postgres", "K8s"]'),
('a2', 'Marcus Lee',    'ML', 'Product Designer',        'e2', 'Product Designer',        91, '5 yrs', 'Remote',     '5h ago', 'New',          '["Figma", "Design Systems"]'),
('a3', 'Priya Patel',   'PP', 'Backend Engineer',        'e1', 'Senior Backend Engineer', 88, '6 yrs', 'London, UK', '1d ago', 'Interviewing', '["Node", "AWS", "TypeScript"]'),
('a4', 'Diego Alvarez', 'DA', 'Designer',                'e2', 'Product Designer',        84, '4 yrs', 'Madrid, ES', '1d ago', 'New',          '["Figma", "Motion"]'),
('a5', 'Yuki Tanaka',   'YT', 'Backend Engineer',        'e1', 'Senior Backend Engineer', 79, '5 yrs', 'Tokyo, JP',  '2d ago', 'New',          '["Rust", "gRPC"]'),
('a6', 'Ana Costa',     'AC', 'Senior Designer',         'e2', 'Product Designer',        92, '8 yrs', 'Lisbon, PT', '3d ago', 'Shortlisted',  '["Figma", "Branding"]');

SET FOREIGN_KEY_CHECKS = 1;
