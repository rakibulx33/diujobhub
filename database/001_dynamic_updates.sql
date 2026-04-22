CREATE TABLE IF NOT EXISTS `job_roles` (
    `id` VARCHAR(50) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `description` TEXT NOT NULL,
    `required_courses` JSON NOT NULL,
    `preferred_skills` JSON NOT NULL,
    `min_semester` INT NOT NULL,
    `default_threshold` INT NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `job_roles` (`id`, `title`, `description`, `required_courses`, `preferred_skills`, `min_semester`, `default_threshold`) VALUES
('app-developer', 'App Developer', 'Build native and cross-platform mobile applications for iOS and Android.', '["Programming Fundamentals","Object Oriented Programming","Data Structures","Algorithms","Database Management","Mobile App Development","UI/UX Design","Software Engineering"]', '["Flutter","React Native","Swift","Kotlin","Dart","Firebase","REST API","Git"]', 5, 60),
('web-developer', 'Web Developer', 'Design and develop responsive, modern web applications and services.', '["Programming Fundamentals","Object Oriented Programming","Data Structures","Database Management","Web Technologies","Software Engineering","Computer Networks"]', '["React","Next.js","TypeScript","Node.js","HTML/CSS","Tailwind CSS","MongoDB","Git"]', 4, 55),
('data-scientist', 'Data Scientist', 'Analyze complex data sets to derive actionable insights using statistical and ML methods.', '["Programming Fundamentals","Data Structures","Algorithms","Statistics & Probability","Linear Algebra","Machine Learning","Database Management","Data Mining"]', '["Python","Pandas","NumPy","Scikit-learn","TensorFlow","SQL","Jupyter","Tableau"]', 6, 65),
('ml-engineer', 'ML Engineer', 'Design, build, and deploy machine learning models at scale.', '["Programming Fundamentals","Data Structures","Algorithms","Linear Algebra","Statistics & Probability","Machine Learning","Deep Learning","Artificial Intelligence"]', '["Python","PyTorch","TensorFlow","MLOps","Docker","AWS/GCP","Kubernetes","Git"]', 7, 70),
('qa-engineer', 'QA Engineer', 'Ensure software quality through manual and automated testing strategies.', '["Programming Fundamentals","Object Oriented Programming","Software Engineering","Software Testing","Database Management","Web Technologies"]', '["Selenium","Jest","Cypress","Postman","JIRA","Git","CI/CD","Agile"]', 4, 50),
('backend-developer', 'Backend Developer', 'Build robust server-side APIs, microservices, and database architectures.', '["Programming Fundamentals","Object Oriented Programming","Data Structures","Algorithms","Database Management","Computer Networks","Operating Systems","Software Engineering"]', '["Node.js","Python","Java","Express","PostgreSQL","MongoDB","Docker","REST API"]', 5, 60),
('uiux-designer', 'UI/UX Designer', 'Create intuitive, beautiful user interfaces and experiences for digital products.', '["UI/UX Design","Human Computer Interaction","Web Technologies","Computer Graphics","Software Engineering"]', '["Figma","Adobe XD","Prototyping","User Research","Wireframing","Design Systems","HTML/CSS"]', 4, 50),
('devops-engineer', 'DevOps Engineer', 'Streamline development workflows with CI/CD, infrastructure, and cloud automation.', '["Programming Fundamentals","Operating Systems","Computer Networks","Database Management","Software Engineering","Cloud Computing","Distributed Systems"]', '["Docker","Kubernetes","AWS","Terraform","CI/CD","Linux","Bash","Git"]', 6, 65);

CREATE TABLE IF NOT EXISTS `job_analytics` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `job_id` VARCHAR(50) NOT NULL,
    `date` DATE NOT NULL,
    `views` INT NOT NULL DEFAULT 0,
    `responses` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `fk_ja_job` (`job_id`),
    CONSTRAINT `fk_ja_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `jobs`
ADD COLUMN `ai_screening` TINYINT(1) NOT NULL DEFAULT 1,
ADD COLUMN `min_score` INT NOT NULL DEFAULT 60,
ADD COLUMN `role_mapping` VARCHAR(50) DEFAULT 'web-developer';

INSERT INTO `job_analytics` (`job_id`, `date`, `views`, `responses`)
SELECT id, DATE_SUB(CURDATE(), INTERVAL 6 DAY), 18, 1 FROM jobs WHERE company = 'Acme Inc.' LIMIT 1;
INSERT INTO `job_analytics` (`job_id`, `date`, `views`, `responses`)
SELECT id, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 24, 2 FROM jobs WHERE company = 'Acme Inc.' LIMIT 1;
INSERT INTO `job_analytics` (`job_id`, `date`, `views`, `responses`)
SELECT id, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 31, 3 FROM jobs WHERE company = 'Acme Inc.' LIMIT 1;
INSERT INTO `job_analytics` (`job_id`, `date`, `views`, `responses`)
SELECT id, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 22, 1 FROM jobs WHERE company = 'Acme Inc.' LIMIT 1;
INSERT INTO `job_analytics` (`job_id`, `date`, `views`, `responses`)
SELECT id, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 38, 4 FROM jobs WHERE company = 'Acme Inc.' LIMIT 1;
INSERT INTO `job_analytics` (`job_id`, `date`, `views`, `responses`)
SELECT id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 14, 0 FROM jobs WHERE company = 'Acme Inc.' LIMIT 1;
INSERT INTO `job_analytics` (`job_id`, `date`, `views`, `responses`)
SELECT id, CURDATE(), 19, 2 FROM jobs WHERE company = 'Acme Inc.' LIMIT 1;
