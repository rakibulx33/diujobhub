-- =====================================================
-- DIUJOBHUB - Audit Log: Table, View, and Triggers
-- =====================================================

USE `DIUJOBHUB`;

-- =====================================================
-- Table: audit_log (stores every important event)
-- =====================================================
DROP TABLE IF EXISTS `audit_log`;

CREATE TABLE `audit_log` (
    `id`          INT          NOT NULL AUTO_INCREMENT,
    `action`      VARCHAR(50)  NOT NULL COMMENT 'INSERT | UPDATE | DELETE',
    `table_name`  VARCHAR(100) NOT NULL,
    `record_id`   VARCHAR(50)  DEFAULT NULL,
    `user_id`     VARCHAR(50)  DEFAULT NULL,
    `old_data`    JSON         DEFAULT NULL,
    `new_data`    JSON         DEFAULT NULL,
    `description` VARCHAR(255) DEFAULT NULL,
    `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_audit_table` (`table_name`),
    KEY `idx_audit_action` (`action`),
    KEY `idx_audit_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- View: v_audit_log_details (enriched view with user name)
-- =====================================================
DROP VIEW IF EXISTS `v_audit_log_details`;

CREATE VIEW `v_audit_log_details` AS
SELECT
    a.id,
    a.action,
    a.table_name,
    a.record_id,
    a.user_id,
    COALESCE(u.name, 'System') AS user_name,
    a.old_data,
    a.new_data,
    a.description,
    a.created_at
FROM `audit_log` a
LEFT JOIN `users` u ON a.user_id = u.id
ORDER BY a.created_at DESC;

-- =====================================================
-- Triggers: users table
-- =====================================================
DROP TRIGGER IF EXISTS `trg_users_insert`;
DELIMITER //
CREATE TRIGGER `trg_users_insert`
AFTER INSERT ON `users`
FOR EACH ROW
BEGIN
    INSERT INTO `audit_log` (`action`, `table_name`, `record_id`, `user_id`, `new_data`, `description`)
    VALUES (
        'INSERT',
        'users',
        NEW.id,
        NEW.id,
        JSON_OBJECT('name', NEW.name, 'email', NEW.email, 'role', NEW.role),
        CONCAT('New user registered: ', NEW.name, ' (', NEW.role, ')')
    );
END //
DELIMITER ;

DROP TRIGGER IF EXISTS `trg_users_update`;
DELIMITER //
CREATE TRIGGER `trg_users_update`
AFTER UPDATE ON `users`
FOR EACH ROW
BEGIN
    INSERT INTO `audit_log` (`action`, `table_name`, `record_id`, `user_id`, `old_data`, `new_data`, `description`)
    VALUES (
        'UPDATE',
        'users',
        NEW.id,
        NEW.id,
        JSON_OBJECT('name', OLD.name, 'email', OLD.email, 'role', OLD.role),
        JSON_OBJECT('name', NEW.name, 'email', NEW.email, 'role', NEW.role),
        CONCAT('User updated: ', NEW.name)
    );
END //
DELIMITER ;

DROP TRIGGER IF EXISTS `trg_users_delete`;
DELIMITER //
CREATE TRIGGER `trg_users_delete`
AFTER DELETE ON `users`
FOR EACH ROW
BEGIN
    INSERT INTO `audit_log` (`action`, `table_name`, `record_id`, `user_id`, `old_data`, `description`)
    VALUES (
        'DELETE',
        'users',
        OLD.id,
        OLD.id,
        JSON_OBJECT('name', OLD.name, 'email', OLD.email, 'role', OLD.role),
        CONCAT('User deleted: ', OLD.name)
    );
END //
DELIMITER ;

-- =====================================================
-- Triggers: jobs table
-- =====================================================
DROP TRIGGER IF EXISTS `trg_jobs_insert`;
DELIMITER //
CREATE TRIGGER `trg_jobs_insert`
AFTER INSERT ON `jobs`
FOR EACH ROW
BEGIN
    INSERT INTO `audit_log` (`action`, `table_name`, `record_id`, `new_data`, `description`)
    VALUES (
        'INSERT',
        'jobs',
        NEW.id,
        JSON_OBJECT('title', COALESCE(NEW.title,''), 'company', COALESCE(NEW.company,''), 'status', COALESCE(NEW.status,'')),
        CONCAT('New job posted: ', COALESCE(NEW.title,'Untitled'), ' at ', COALESCE(NEW.company,'Unknown'))
    );
END //
DELIMITER ;

DROP TRIGGER IF EXISTS `trg_jobs_update`;
DELIMITER //
CREATE TRIGGER `trg_jobs_update`
AFTER UPDATE ON `jobs`
FOR EACH ROW
BEGIN
    INSERT INTO `audit_log` (`action`, `table_name`, `record_id`, `old_data`, `new_data`, `description`)
    VALUES (
        'UPDATE',
        'jobs',
        NEW.id,
        JSON_OBJECT('title', COALESCE(OLD.title,''), 'status', COALESCE(OLD.status,'')),
        JSON_OBJECT('title', COALESCE(NEW.title,''), 'status', COALESCE(NEW.status,'')),
        CONCAT('Job updated: ', COALESCE(NEW.title,'Untitled'))
    );
END //
DELIMITER ;

DROP TRIGGER IF EXISTS `trg_jobs_delete`;
DELIMITER //
CREATE TRIGGER `trg_jobs_delete`
AFTER DELETE ON `jobs`
FOR EACH ROW
BEGIN
    INSERT INTO `audit_log` (`action`, `table_name`, `record_id`, `old_data`, `description`)
    VALUES (
        'DELETE',
        'jobs',
        OLD.id,
        JSON_OBJECT('title', COALESCE(OLD.title,''), 'company', COALESCE(OLD.company,'')),
        CONCAT('Job deleted: ', COALESCE(OLD.title,'Untitled'))
    );
END //
DELIMITER ;

-- =====================================================
-- Triggers: applications table
-- =====================================================
DROP TRIGGER IF EXISTS `trg_applications_insert`;
DELIMITER //
CREATE TRIGGER `trg_applications_insert`
AFTER INSERT ON `applications`
FOR EACH ROW
BEGIN
    INSERT INTO `audit_log` (`action`, `table_name`, `record_id`, `user_id`, `new_data`, `description`)
    VALUES (
        'INSERT',
        'applications',
        CAST(NEW.id AS CHAR),
        NEW.user_id,
        JSON_OBJECT('job_id', COALESCE(NEW.job_id,''), 'status', COALESCE(NEW.status,'')),
        CONCAT('New application submitted for job ', COALESCE(NEW.job_id,''))
    );
END //
DELIMITER ;

DROP TRIGGER IF EXISTS `trg_applications_update`;
DELIMITER //
CREATE TRIGGER `trg_applications_update`
AFTER UPDATE ON `applications`
FOR EACH ROW
BEGIN
    INSERT INTO `audit_log` (`action`, `table_name`, `record_id`, `user_id`, `old_data`, `new_data`, `description`)
    VALUES (
        'UPDATE',
        'applications',
        CAST(NEW.id AS CHAR),
        NEW.user_id,
        JSON_OBJECT('status', COALESCE(OLD.status,''), 'stage', OLD.stage),
        JSON_OBJECT('status', COALESCE(NEW.status,''), 'stage', NEW.stage),
        CONCAT('Application status changed: ', COALESCE(OLD.status,''), ' → ', COALESCE(NEW.status,''))
    );
END //
DELIMITER ;

-- =====================================================
-- Seed: sample audit entries for demo
-- =====================================================
INSERT INTO `audit_log` (`action`, `table_name`, `record_id`, `user_id`, `new_data`, `description`, `created_at`) VALUES
('INSERT', 'users',        'u1', 'u1', '{"name":"Alex Morgan","email":"seeker@demo.com","role":"seeker"}',     'New user registered: Alex Morgan (seeker)',        NOW() - INTERVAL 7 DAY),
('INSERT', 'users',        'u2', 'u2', '{"name":"Acme Inc.","email":"employer@demo.com","role":"employer"}',    'New user registered: Acme Inc. (employer)',        NOW() - INTERVAL 7 DAY),
('INSERT', 'users',        'u3', 'u3', '{"name":"System Admin","email":"admin@demo.com","role":"admin"}',      'New user registered: System Admin (admin)',         NOW() - INTERVAL 7 DAY),
('INSERT', 'jobs',         'e1', NULL, '{"title":"Senior Backend Engineer","company":"Acme Inc."}',             'New job posted: Senior Backend Engineer at Acme Inc.', NOW() - INTERVAL 5 DAY),
('INSERT', 'jobs',         'e2', NULL, '{"title":"Product Designer","company":"Acme Inc."}',                    'New job posted: Product Designer at Acme Inc.',       NOW() - INTERVAL 4 DAY),
('INSERT', 'applications', '1',  'u1', '{"job_id":"1","status":"Interviewing"}',                               'New application submitted for job 1',              NOW() - INTERVAL 3 DAY),
('UPDATE', 'applications', '1',  'u1', '{"status":"Applied","stage":1}',                                       'Application status changed: Applied → Interviewing', NOW() - INTERVAL 2 DAY),
('INSERT', 'applications', '2',  'u1', '{"job_id":"4","status":"Applied"}',                                    'New application submitted for job 4',              NOW() - INTERVAL 1 DAY);
