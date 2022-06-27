-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL,
    `firstname` VARCHAR(100) NULL,
    `lastname` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
