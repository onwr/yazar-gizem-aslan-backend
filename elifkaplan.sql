-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 21 Haz 2025, 20:46:37
-- Sunucu sürümü: 10.4.32-MariaDB
-- PHP Sürümü: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `pinarsalman`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`, `created_at`) VALUES
(1, 'admin', '$2b$10$6/7/rrFgf521Bi6xwUl0Au4zJlwvjGe4p7gca8VTCHvAUT65FcQhW', '2025-02-20 08:22:22');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `link` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `announcement_reads`
--

CREATE TABLE `announcement_reads` (
  `id` int(11) NOT NULL,
  `announcement_id` int(11) NOT NULL,
  `user_ip` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `books`
--

CREATE TABLE `books` (
  `kitapId` varchar(50) NOT NULL,
  `kitapAd` varchar(255) NOT NULL,
  `okumaSayi` int(11) DEFAULT 0,
  `aciklama` text DEFAULT NULL,
  `resim` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `sira` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `books`
--

INSERT INTO `books` (`kitapId`, `kitapAd`, `okumaSayi`, `aciklama`, `resim`, `created_at`, `sira`) VALUES
('tqo0nab3o', 'İNFERNO', 48, NULL, 'https://i.ibb.co/whp09kjn/test.jpg', '2025-05-09 12:28:09', 0);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `chapters`
--

CREATE TABLE `chapters` (
  `id` int(11) NOT NULL,
  `bookId` varchar(50) DEFAULT NULL,
  `baslik` varchar(255) NOT NULL,
  `begeniSayi` int(11) DEFAULT 0,
  `content` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `okumaSayi` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `chapters`
--

INSERT INTO `chapters` (`id`, `bookId`, `baslik`, `begeniSayi`, `content`, `created_at`, `okumaSayi`) VALUES
(37, 'tqo0nab3o', 'TEST', 0, '<p>TE</p>', '2025-05-14 14:46:02', 0);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `chapter_comments`
--

CREATE TABLE `chapter_comments` (
  `id` int(11) NOT NULL,
  `chapterId` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `yorum` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `parent_id` int(11) DEFAULT NULL,
  `isAdmin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `line_comments`
--

CREATE TABLE `line_comments` (
  `id` int(11) NOT NULL,
  `chapterId` int(11) NOT NULL,
  `lineNumber` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `yorum` text NOT NULL,
  `isAdmin` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `news_flow`
--

CREATE TABLE `news_flow` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
  `sira` int(11) DEFAULT 0,
  `isActive` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `news_flow`
--

INSERT INTO `news_flow` (`id`, `title`, `image`, `link`, `sira`, `isActive`, `created_at`, `updated_at`) VALUES
(1, 'test', 'https://i.ibb.co/whp09kjn/test.jpg', 'test', 0, 1, '2025-05-09 18:16:05', '2025-05-09 18:16:05'),
(3, 'ASDFASDFASDF', 'http://localhost:5173/images/profil.jpg', 'test', 1, 1, '2025-05-09 18:46:37', '2025-05-09 18:46:37');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `question_answers`
--

CREATE TABLE `question_answers` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `answer` text NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `question_answers`
--

INSERT INTO `question_answers` (`id`, `question_id`, `user_name`, `answer`, `is_admin`, `created_at`) VALUES
(9, 38, '', 'FASDFASDFASDF', 0, '2025-04-06 11:59:37'),
(12, 37, '', 'fasdfsdafasd', 0, '2025-04-06 12:02:17'),
(13, 39, 'salihsadsdafsad', 'asdfasdf', 0, '2025-04-06 12:04:06');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `question_likes`
--

CREATE TABLE `question_likes` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `user_ip` varchar(45) NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `question_likes`
--

INSERT INTO `question_likes` (`id`, `question_id`, `user_ip`, `is_admin`, `created_at`) VALUES
(104, 35, '::1', 0, '2025-04-06 11:55:26'),
(106, 36, '::1', 0, '2025-04-06 11:59:18'),
(107, 37, '::1', 0, '2025-04-06 11:59:19');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `reader_questions`
--

CREATE TABLE `reader_questions` (
  `id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `question` text NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `like_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `reader_questions`
--

INSERT INTO `reader_questions` (`id`, `user_name`, `question`, `is_admin`, `created_at`, `deleted_at`, `like_count`) VALUES
(35, 'asfsadf', 'sdafasdf', 1, '2025-04-06 11:55:24', NULL, 0),
(36, 'fasdfasdf', 'asdfasdf', 0, '2025-04-06 11:56:43', NULL, 0),
(37, 'sadfasdfsda', 'asfdasdf', 0, '2025-04-06 11:56:45', NULL, 0),
(38, 'ASDFASDF', 'ASDF', 0, '2025-04-06 11:59:23', NULL, 0),
(39, 'ASDFASDFASDF', 'ASDF', 0, '2025-04-06 11:59:26', NULL, 0),
(40, 'asdfsadfsadf', 'sadfasdfasdf', 0, '2025-04-06 12:03:39', NULL, 0);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `signing_events`
--

CREATE TABLE `signing_events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `event_date` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `store_books`
--

CREATE TABLE `store_books` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `image_url` text NOT NULL,
  `purchase_url` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo için tablo yapısı `answer_replies`
--

CREATE TABLE `answer_replies` (
  `id` int(11) NOT NULL,
  `answer_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `reply` text NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Tablo için indeksler `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `announcement_reads`
--
ALTER TABLE `announcement_reads`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_read` (`announcement_id`,`user_ip`);

--
-- Tablo için indeksler `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`kitapId`),
  ADD KEY `idx_kitap_ad` (`kitapAd`);

--
-- Tablo için indeksler `chapters`
--
ALTER TABLE `chapters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_book_id` (`bookId`);

--
-- Tablo için indeksler `chapter_comments`
--
ALTER TABLE `chapter_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chapterId` (`chapterId`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Tablo için indeksler `line_comments`
--
ALTER TABLE `line_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chapterId` (`chapterId`);

--
-- Tablo için indeksler `news_flow`
--
ALTER TABLE `news_flow`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `question_answers`
--
ALTER TABLE `question_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `idx_user_time` (`user_name`,`created_at`);

--
-- Tablo için indeksler `answer_replies`
--
ALTER TABLE `answer_replies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `answer_id` (`answer_id`),
  ADD KEY `idx_user_time` (`user_name`,`created_at`);

--
-- Tablo için indeksler `question_likes`
--
ALTER TABLE `question_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_like` (`question_id`,`user_ip`),
  ADD UNIQUE KEY `unique_like` (`question_id`,`user_ip`);

--
-- Tablo için indeksler `reader_questions`
--
ALTER TABLE `reader_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_time` (`user_name`,`created_at`);

--
-- Tablo için indeksler `signing_events`
--
ALTER TABLE `signing_events`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `store_books`
--
ALTER TABLE `store_books`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Tablo için AUTO_INCREMENT değeri `announcement_reads`
--
ALTER TABLE `announcement_reads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Tablo için AUTO_INCREMENT değeri `chapters`
--
ALTER TABLE `chapters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- Tablo için AUTO_INCREMENT değeri `chapter_comments`
--
ALTER TABLE `chapter_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- Tablo için AUTO_INCREMENT değeri `line_comments`
--
ALTER TABLE `line_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Tablo için AUTO_INCREMENT değeri `news_flow`
--
ALTER TABLE `news_flow`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `question_answers`
--
ALTER TABLE `question_answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Tablo için AUTO_INCREMENT değeri `answer_replies`
--
ALTER TABLE `answer_replies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- Tablo için AUTO_INCREMENT değeri `question_likes`
--
ALTER TABLE `question_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- Tablo için AUTO_INCREMENT değeri `reader_questions`
--
ALTER TABLE `reader_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- Tablo için AUTO_INCREMENT değeri `signing_events`
--
ALTER TABLE `signing_events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `store_books`
--
ALTER TABLE `store_books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `announcement_reads`
--
ALTER TABLE `announcement_reads`
  ADD CONSTRAINT `announcement_reads_ibfk_1` FOREIGN KEY (`announcement_id`) REFERENCES `announcements` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `chapters`
--
ALTER TABLE `chapters`
  ADD CONSTRAINT `chapters_ibfk_1` FOREIGN KEY (`bookId`) REFERENCES `books` (`kitapId`);

--
-- Tablo kısıtlamaları `chapter_comments`
--
ALTER TABLE `chapter_comments`
  ADD CONSTRAINT `chapter_comments_ibfk_1` FOREIGN KEY (`chapterId`) REFERENCES `chapters` (`id`),
  ADD CONSTRAINT `chapter_comments_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `chapter_comments` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `line_comments`
--
ALTER TABLE `line_comments`
  ADD CONSTRAINT `line_comments_ibfk_1` FOREIGN KEY (`chapterId`) REFERENCES `chapters` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `question_answers`
--
ALTER TABLE `question_answers`
ADD CONSTRAINT `question_answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `reader_questions` (`id`) ON DELETE CASCADE;

ALTER TABLE `answer_replies`
ADD CONSTRAINT `answer_replies_ibfk_1` FOREIGN KEY (`answer_id`) REFERENCES `question_answers` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `question_likes`
--
ALTER TABLE `question_likes`
  ADD CONSTRAINT `question_likes_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `reader_questions` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
