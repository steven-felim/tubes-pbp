generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") // "postgresql://username:password@localhost/mini_forum_db"
}

model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  email     String   @unique
  password  String
  threads   Thread[]
  posts     Post[]
  likes     PostLike[]
  createdAt DateTime @default(now())
}

model Category {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  description String?
  threads     Thread[]
}

model Thread {
  id          Int      @id @default(autoincrement())
  title       String
  content     String
  user        User     @relation(fields: [userId], references: [id])
  userId      Int
  category    Category? @relation(fields: [categoryId], references: [id])
  categoryId  Int?
  posts       Post[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Post {
  id        Int      @id @default(autoincrement())
  content   String
  thread    Thread   @relation(fields: [threadId], references: [id])
  threadId  Int
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  likes     PostLike[]
  createdAt DateTime @default(now())
}

model PostLike {
  id      Int   @id @default(autoincrement())
  post    Post  @relation(fields: [postId], references: [id])
  postId  Int
  user    User  @relation(fields: [userId], references: [id])
  userId  Int

  @@unique([postId, userId]) // satu user hanya bisa like satu kali
}