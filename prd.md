# PRD — Online Course Learning Management System

## 1. Informasi Dokumen

**Nama Produk:** Online Course LMS  
**Jenis Produk:** Web-based Learning Management System  
**Versi PRD:** 1.0  
**Status:** Draft untuk implementasi  
**Target Platform:** Web Desktop & Mobile Responsive  

### Tech Stack

- Backend: Laravel
- Frontend: React
- Bridge: Inertia.js
- Language Frontend: TypeScript
- Styling: Tailwind CSS
- UI Component Library: shadcn/ui
- Database: MySQL
- Authentication: Laravel Authentication
- Video Provider: YouTube
- Video Delivery: YouTube Embed / YouTube IFrame Player
- File Storage: Laravel Storage / object storage yang kompatibel bila diperlukan

---

# 2. Ringkasan Produk

Website ini merupakan platform online course sederhana yang memungkinkan student untuk:

- membuat akun dan login;
- melihat katalog kelas;
- membuka detail kelas;
- mendaftar kelas dengan satu klik;
- langsung mendapatkan akses kelas tanpa pembayaran dan tanpa approval admin;
- mengikuti materi kelas;
- menonton video YouTube yang di-embed di website;
- membaca textbook;
- mengunduh atau membuka attachment jika tersedia;
- menandai konten sebagai selesai;
- melihat progress belajar;
- melanjutkan pembelajaran dari konten terakhir;
- mengakses perpustakaan e-book.

Website memiliki dua role utama:

1. **Admin**
2. **Student**

Tidak terdapat:

- payment gateway;
- checkout;
- subscription;
- approval enrollment;
- voucher;
- paket berbayar;
- teacher login.

Teacher hanya merupakan data profil pengajar yang dikelola admin.

---

# 3. Tujuan Produk

Tujuan utama sistem adalah menyediakan platform pembelajaran yang sederhana dan mudah digunakan dengan alur:

```text
Register/Login
→ Browse Course
→ Course Detail
→ Daftar Kelas
→ Langsung Mendapatkan Akses
→ Belajar
→ Selesaikan Video/Textbook
→ Progress Otomatis
→ Course Completed
```

Sistem harus mempermudah admin dalam mengelola:

- course;
- kategori course;
- teacher;
- material;
- video;
- textbook;
- student;
- enrollment;
- progress student;
- e-book;
- kategori e-book.

---

# 4. Role dan Hak Akses

## 4.1 Admin

Admin dapat:

- login ke aplikasi;
- mengakses admin dashboard;
- mengelola kategori kelas;
- membuat, mengubah, menghapus, publish, archive course;
- mengelola teacher;
- menghubungkan banyak teacher ke satu course;
- mengelola material dalam course;
- mengatur urutan material;
- mengelola video dan textbook;
- mengatur urutan learning content;
- mengelola e-book;
- mengelola kategori e-book;
- melihat daftar student;
- melihat kelas yang diikuti student;
- melihat progress course student;
- melihat progress material student;
- melihat progress learning content student.

Admin tidak membutuhkan sistem pembayaran atau approval enrollment.

## 4.2 Student

Student dapat:

- register;
- login;
- logout;
- melihat course catalog;
- melakukan pencarian dan filter course;
- melihat detail course;
- mendaftar course dengan satu klik;
- mendapatkan akses course secara langsung;
- melihat kelas yang telah didaftarkan;
- membuka learning page;
- menonton video YouTube di dalam website;
- membaca textbook;
- membuka attachment;
- menyelesaikan learning content;
- melihat progress belajar;
- melanjutkan konten terakhir;
- melihat e-book;
- membuka/download e-book;
- mengelola data profil dasar.

Student tidak dapat:

- membuat course;
- mengubah course;
- melihat admin panel;
- mengelola teacher;
- mengelola user lain;
- memodifikasi progress user lain.

---

# 5. Autentikasi

## 5.1 Register Student

Field minimal:

- name;
- email;
- password;
- password confirmation.

Ketika register berhasil:

- role otomatis `student`;
- password wajib di-hash;
- email wajib unik.

## 5.2 Login

Login menggunakan:

- email;
- password.

Setelah login:

- admin diarahkan ke Admin Dashboard;
- student diarahkan ke Student Dashboard / Home.

## 5.3 User Roles

Enum:

```text
admin
student
```

Semua route admin wajib dilindungi authorization middleware.

---

# 6. Struktur Pembelajaran

Struktur utama LMS:

```text
Course Category
    ↓
Course
    ↓
Course Material
    ↓
Learning Content
    ├── Video
    └── Textbook
```

Hubungan:

- satu kategori dapat mempunyai banyak course;
- satu course hanya mempunyai satu kategori;
- satu course mempunyai banyak material;
- satu material mempunyai banyak learning content;
- learning content dapat berupa `video` atau `textbook`.

---

# 7. Course Category

Course category digunakan untuk mengelompokkan course.

Contoh:

- Web Development
- Mobile Development
- UI/UX
- Data Science

Data:

- name;
- slug;
- description;
- timestamps;
- soft delete.

## Aturan

- `slug` wajib unik;
- course harus memiliki satu kategori;
- kategori yang sudah digunakan course tidak boleh menyebabkan course rusak ketika dihapus;
- penghapusan kategori menggunakan soft delete.

---

# 8. Course

Course merupakan entity utama pembelajaran.

Data course:

- category;
- title;
- slug;
- short description;
- description;
- thumbnail;
- banner;
- level;
- estimated duration;
- status;
- creator;
- published date.

## 8.1 Course Status

Status:

```text
draft
published
archived
```

### Draft

- hanya dapat dilihat admin;
- tidak muncul di katalog student.

### Published

- muncul di katalog student;
- dapat didaftarkan student.

### Archived

- tidak menerima enrollment baru;
- aturan akses untuk student yang sudah pernah enroll tetap dapat dipertahankan.

## 8.2 Course Level

Contoh:

- Beginner
- Intermediate
- Advanced

Field ini menggunakan string agar admin dapat menentukan label sesuai kebutuhan.

## 8.3 Estimated Duration

Disimpan dalam menit.

Nilainya dapat:

- diinput admin; atau
- dihitung dari total video dan estimasi textbook pada pengembangan berikutnya.

---

# 9. Teacher

Teacher tidak merupakan user login.

Data teacher:

- name;
- photo;
- expertise;
- created_at;
- updated_at;
- deleted_at.

Contoh:

```text
Name: Budi Santoso
Expertise: Backend Development
```

## Aturan

- satu course dapat memiliki banyak teacher;
- satu teacher dapat digunakan pada banyak course;
- relasi menggunakan `course_teachers`;
- urutan teacher menggunakan `position`.

---

# 10. Course Material

Course material digunakan sebagai bab/modul pembelajaran.

Contoh:

```text
Laravel Fundamental

1. Introduction
2. Installation
3. Routing
4. Controller
5. Database
```

Data:

- course;
- title;
- description;
- position;
- publish status.

## Aturan

- satu course dapat mempunyai banyak material;
- `position` menentukan urutan material;
- admin dapat mengubah urutan;
- frontend harus menampilkan material berdasarkan `position ASC`;
- material yang belum dipublish tidak muncul untuk student.

---

# 11. Learning Content

Learning content adalah unit pembelajaran terkecil.

Enum:

```text
video
textbook
```

Struktur:

```text
Material
├── Video
├── Textbook
├── Video
└── Textbook
```

Semua content disimpan pada tabel `learning_contents`.

## 11.1 Field Umum

- course_material_id;
- type;
- title;
- description;
- position;
- attachment_url;
- is_published;
- timestamps;
- soft delete.

## 11.2 Video Content

Video hanya berasal dari YouTube.

Field:

- `youtube_url`
- `youtube_video_id`
- `video_duration_seconds`

Contoh:

```text
youtube_url:
https://www.youtube.com/watch?v=abc123

youtube_video_id:
abc123
```

## Aturan YouTube

- admin memasukkan link YouTube;
- backend melakukan validasi URL;
- backend mengekstrak video ID;
- frontend tidak menampilkan YouTube melalui link biasa;
- video harus di-embed di halaman learning;
- embed dapat menggunakan YouTube IFrame Player API;
- student tetap berada di website ketika belajar;
- aplikasi tidak mengupload atau menyimpan file video;
- database hanya menyimpan URL, video ID, dan metadata terkait.

Format URL yang idealnya didukung:

```text
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
https://www.youtube.com/embed/VIDEO_ID
```

Backend harus menormalisasi format tersebut menjadi `youtube_video_id`.

## 11.3 Textbook Content

Textbook merupakan materi berbasis teks.

`textbook_content` dapat berisi rich text/HTML hasil editor.

Textbook dapat mendukung:

- heading;
- paragraph;
- bold;
- italic;
- ordered list;
- unordered list;
- link;
- image jika editor mendukung;
- code block jika diperlukan.

## 11.4 Attachment

`attachment_url` bersifat opsional.

Attachment dapat digunakan untuk:

- PDF;
- source code;
- worksheet;
- ZIP;
- file pendukung lain.

---

# 12. Course Builder Admin

Pengelolaan isi course sebaiknya dilakukan melalui Course Builder.

Contoh:

```text
Laravel Fundamental

Material 1 — Introduction
├── Video — Apa itu Laravel?
├── Textbook — Konsep Dasar
└── Video — Instalasi

Material 2 — Routing
├── Video — Basic Routing
└── Textbook — Routing Guide
```

Admin harus dapat:

- menambahkan material;
- mengedit material;
- menghapus material;
- mengatur urutan material;
- menambahkan video;
- menambahkan textbook;
- mengedit content;
- menghapus content;
- mengatur urutan content;
- publish/unpublish content.

Urutan selalu mengikuti `position`.

---

# 13. Enrollment

Enrollment dilakukan melalui tombol:

```text
Daftar Kelas
```

## Aturan Enrollment

- user wajib login;
- hanya role student yang melakukan enrollment;
- course harus `published`;
- tidak ada pembayaran;
- tidak ada checkout;
- tidak ada approval admin;
- tidak ada voucher;
- ketika student klik daftar, record `course_enrollments` langsung dibuat;
- satu user tidak boleh memiliki duplicate enrollment untuk course yang sama.

Unique constraint:

```text
(user_id, course_id)
```

Setelah enrollment berhasil:

```text
status = enrolled
progress_percentage = 0
enrolled_at = current timestamp
```

Tombol berubah dari:

```text
Daftar Kelas
```

menjadi:

```text
Mulai Belajar
```

atau:

```text
Lanjutkan Belajar
```

---

# 14. Enrollment Status

Enum:

```text
enrolled
in_progress
completed
```

## Enrolled

Digunakan ketika student sudah mendaftar tetapi belum memulai content.

## In Progress

Digunakan ketika student sudah membuka atau menyelesaikan minimal satu learning content tetapi belum menyelesaikan seluruh course.

## Completed

Digunakan ketika semua published learning content dalam semua published material telah selesai.

---

# 15. Learning Progress

Tracking progress menggunakan tabel:

```text
learning_content_progress
```

Tabel ini merupakan sumber utama progress pembelajaran.

Satu record mewakili:

```text
1 Student
+
1 Learning Content
```

Unique:

```text
(user_id, learning_content_id)
```

---

# 16. Content Progress Status

Enum:

```text
not_started
in_progress
completed
```

## Not Started

Student belum membuka content.

## In Progress

Student sudah membuka content tetapi belum selesai.

## Completed

Student sudah menyelesaikan content.

---

# 17. Video Progress

Video menggunakan YouTube embed.

Frontend dapat menggunakan YouTube IFrame Player API untuk membaca:

- current time;
- duration;
- player state.

Data progress:

- watched_seconds;
- progress_percentage;
- first_viewed_at;
- last_viewed_at;
- completed_at.

## Aturan Penyimpanan

Saat video pertama kali dibuka:

```text
status = in_progress
first_viewed_at = now
last_viewed_at = now
```

Ketika progress diperbarui:

```text
watched_seconds = current time
progress_percentage = watched_seconds / duration × 100
last_viewed_at = now
```

## Penyelesaian Video

Versi MVP dapat menyediakan tombol:

```text
Tandai Selesai
```

Student dapat menandai video selesai setelah menonton.

Ketika selesai:

```text
status = completed
progress_percentage = 100
completed_at = now
```

Sistem tidak boleh bergantung sepenuhnya pada histori YouTube karena progress LMS disimpan pada database sendiri.

---

# 18. Textbook Progress

Saat textbook pertama dibuka:

```text
status = in_progress
first_viewed_at = now
```

Textbook memiliki tombol:

```text
Tandai Selesai
```

Ketika student menekan tombol:

```text
status = completed
progress_percentage = 100
completed_at = now
```

---

# 19. Material Progress

Material progress merupakan summary dari semua published learning content dalam material tersebut.

Tabel:

```text
course_material_progress
```

Data:

- total_contents;
- completed_contents;
- progress_percentage;
- status;
- started_at;
- completed_at;
- last_activity_at.

## Formula

```text
progress =
completed_contents / total_contents × 100
```

Contoh:

```text
4 content
3 completed

Progress = 75%
```

## Auto Completion Material

Jika:

```text
completed_contents == total_contents
```

maka:

```text
status = completed
progress_percentage = 100
completed_at = now
```

Student tidak perlu menekan tombol "Selesaikan Material".

---

# 20. Course Progress

Progress course disimpan pada:

```text
course_enrollments.progress_percentage
```

Course progress harus dihitung berdasarkan seluruh published learning content dalam seluruh published material.

Formula:

```text
completed learning content
-------------------------- × 100
total learning content
```

Contoh:

```text
20 total content
15 completed

Course Progress = 75%
```

## Auto Completion Course

Jika seluruh learning content selesai:

```text
status = completed
progress_percentage = 100
completed_at = now
```

Jika sebagian sudah dimulai:

```text
status = in_progress
```

Jika belum ada content yang dimulai:

```text
status = enrolled
```

---

# 21. Last Learning Content

`course_enrollments.last_learning_content_id` digunakan untuk menyimpan posisi belajar terakhir.

Setiap student membuka learning content:

```text
last_learning_content_id = current content id
last_activity_at = now
```

Fitur frontend:

```text
Lanjutkan Belajar
```

harus membuka `last_learning_content_id`.

Jika belum pernah membuka content:

- buka content pertama dari material pertama.

---

# 22. Student Dashboard

Dashboard student minimal menampilkan:

## Summary

- total kelas yang diikuti;
- kelas sedang dipelajari;
- kelas selesai.

## My Learning

Setiap course card menampilkan:

- thumbnail;
- title;
- category;
- teacher;
- progress percentage;
- progress bar;
- enrollment status;
- tombol Mulai/Lanjutkan Belajar.

Contoh:

```text
Laravel Fundamental
65%

[██████░░░░]

Lanjutkan Belajar
```

---

# 23. Course Catalog

Halaman katalog menampilkan semua course berstatus `published`.

Course card minimal:

- thumbnail;
- title;
- category;
- level;
- teacher;
- short description.

Fitur:

- search;
- filter category;
- filter level jika diperlukan;
- pagination.

---

# 24. Course Detail

Halaman course detail menampilkan:

- title;
- thumbnail/banner;
- description;
- category;
- level;
- estimated duration;
- teacher;
- list material;
- jumlah learning content;
- status enrollment.

Jika belum enroll:

```text
Daftar Kelas
```

Jika sudah enroll:

```text
Mulai Belajar
```

atau:

```text
Lanjutkan Belajar
```

---

# 25. Learning Page

Learning page merupakan halaman utama pembelajaran.

Layout desktop yang disarankan:

```text
------------------------------------------------
| Content Area              | Course Sidebar   |
|                           |                  |
| YouTube / Textbook        | Material 1       |
|                           | ✓ Video A        |
|                           | ○ Textbook B     |
|                           |                  |
------------------------------------------------
| Previous | Mark Complete | Next             |
------------------------------------------------
```

## Content Area

Jika type `video`:

- tampilkan YouTube embed;
- tampilkan title;
- tampilkan description;
- tampilkan attachment jika ada.

Jika type `textbook`:

- render textbook content;
- tampilkan attachment jika ada.

## Sidebar

Menampilkan:

- semua material;
- semua learning content;
- status completion;
- progress course.

Contoh:

```text
✓ = completed
○ = not completed
```

## Navigation

Sediakan:

- Previous;
- Next;
- Tandai Selesai.

Next mengikuti `position`.

Setelah content terakhir pada suatu material:

- pindah ke content pertama material berikutnya.

---

# 26. E-Book

E-book berdiri sendiri dan tidak berhubungan dengan course.

Struktur:

```text
Ebook Category
    ↓
Ebook
```

Data e-book:

- category;
- title;
- slug;
- author;
- short description;
- description;
- cover;
- file;
- file name;
- file type;
- file size;
- total pages;
- status;
- creator;
- published date.

Status:

```text
draft
published
archived
```

Student hanya melihat e-book berstatus `published`.

Tidak ada:

- enrollment e-book;
- pembayaran e-book;
- progress e-book pada database versi sekarang;
- hubungan e-book dengan course.

---

# 27. E-Book Categories

Digunakan untuk mengelompokkan e-book.

Contoh:

- Programming
- Career
- Business
- Technology

Data:

- name;
- slug;
- description;
- icon;
- thumbnail;
- active status;
- position.

---

# 28. E-Book Catalog

Student dapat:

- melihat daftar e-book;
- search;
- filter berdasarkan kategori;
- membuka detail e-book.

E-book card:

- cover;
- title;
- author;
- category;
- short description.

---

# 29. E-Book Detail

Menampilkan:

- cover;
- title;
- author;
- description;
- category;
- total pages;
- file information.

Action:

```text
Baca Ebook
```

atau:

```text
Download
```

tergantung implementasi file.

---

# 30. Admin Dashboard

Admin dashboard minimal menampilkan summary:

- total students;
- total courses;
- total published courses;
- total teachers;
- total ebooks;
- total enrollments.

Informasi tambahan dapat ditambahkan tanpa mengubah database utama.

---

# 31. Admin Course Management

Admin dapat:

- list course;
- search course;
- filter status;
- filter category;
- create;
- edit;
- soft delete;
- publish;
- archive;
- membuka Course Builder.

Form course:

- category;
- title;
- slug;
- short description;
- description;
- thumbnail;
- banner;
- level;
- estimated duration;
- status;
- teacher selection.

---

# 32. Admin Teacher Management

Admin dapat:

- melihat teacher;
- menambah teacher;
- mengubah teacher;
- menghapus teacher dengan soft delete;
- memilih teacher ketika mengedit course.

Data:

- photo;
- name;
- expertise.

---

# 33. Admin Student Management

Admin dapat melihat:

- name;
- email;
- registration date;
- jumlah course yang diikuti;
- course selesai;
- last login.

Admin dapat membuka detail student.

Detail student menampilkan:

```text
Student
├── Course A — 80%
├── Course B — 100%
└── Course C — 25%
```

---

# 34. Admin Progress Monitoring

Admin dapat melihat progress berdasarkan:

- student;
- course;
- material;
- learning content.

Contoh detail:

```text
Ian
Laravel Fundamental
Progress: 75%

Introduction — 100%
Routing — 80%
Controller — 50%
Database — 40%
```

Data berasal dari:

- `course_enrollments`;
- `course_material_progress`;
- `learning_content_progress`.

---

# 35. Database Rules

Database mengikuti schema yang telah ditentukan.

## 35.1 Main Tables

```text
users
course_categories
courses
teachers
course_teachers
course_materials
learning_contents
course_enrollments
learning_content_progress
course_material_progress
ebook_categories
ebooks
```

## 35.2 Soft Deletes

Tabel berikut menggunakan `deleted_at`:

- users;
- course_categories;
- courses;
- teachers;
- course_materials;
- learning_contents;
- ebook_categories;
- ebooks.

## 35.3 Unique Rules

Wajib unik:

```text
users.email
course_categories.slug
courses.slug
ebooks.slug
```

Composite unique:

```text
course_teachers(course_id, teacher_id)

course_enrollments(user_id, course_id)

learning_content_progress(
    user_id,
    learning_content_id
)

course_material_progress(
    user_id,
    course_material_id
)
```

---

# 36. Database Relationship

```text
users
 ├── courses.created_by
 ├── course_enrollments
 ├── learning_content_progress
 ├── course_material_progress
 └── ebooks.created_by


course_categories
 └── courses
      ├── course_teachers
      │    └── teachers
      │
      ├── course_materials
      │    └── learning_contents
      │
      ├── course_enrollments
      ├── learning_content_progress
      └── course_material_progress


ebook_categories
 └── ebooks
```

---

# 37. Progress Source of Truth

Sumber utama progress:

```text
learning_content_progress
```

`course_material_progress` adalah summary/cache dari content progress.

`course_enrollments.progress_percentage` adalah summary/cache dari keseluruhan course.

Alur update:

```text
Student completes content
        ↓
Update learning_content_progress
        ↓
Recalculate course_material_progress
        ↓
Recalculate course_enrollments
```

Backend harus menjaga konsistensi tiga level ini.

---

# 38. Progress Recalculation Rules

Setiap terjadi salah satu event berikut:

- learning content completed;
- learning content uncompleted;
- content ditambahkan;
- content dihapus;
- content dipublish;
- content di-unpublish;

backend harus dapat menghitung ulang progress yang terdampak.

Progress hanya memperhitungkan:

- material yang published;
- learning content yang published;
- content yang tidak soft-deleted.

---

# 39. Empty Material Rule

Material tanpa published learning content:

- tidak dihitung dalam progress;
- tidak boleh menyebabkan pembagian dengan nol;
- dapat ditampilkan admin;
- sebaiknya tidak ditampilkan ke student hingga memiliki content.

---

# 40. Course Completion Rule

Course dianggap completed apabila:

- student telah enroll;
- course memiliki minimal satu published learning content;
- seluruh published learning content telah completed oleh student.

Jika admin kemudian menambah learning content baru ke course yang sebelumnya sudah selesai:

- sistem harus dapat menghitung ulang progress;
- status student dapat kembali menjadi `in_progress` jika tidak lagi 100%.

---

# 41. Authorization Rules

## Guest

Dapat:

- melihat public landing page;
- melihat katalog jika dibuat public;
- melihat detail course public.

Tidak dapat:

- enroll;
- membuka learning content;
- membuka student dashboard.

## Student

Dapat:

- mengakses student area;
- enroll;
- belajar;
- melihat progress sendiri.

Tidak dapat mengakses:

```text
/admin/*
```

## Admin

Dapat mengakses seluruh management area.

Laravel Policy/Gate/Middleware harus digunakan untuk authorization.

---

# 42. URL Structure

Contoh routing frontend:

```text
/
 /login
 /register

 /courses
 /courses/{slug}

 /my-learning
 /my-learning/{course-slug}
 /my-learning/{course-slug}/{content-id}

 /ebooks
 /ebooks/{slug}

 /profile
```

Admin:

```text
/admin
/admin/courses
/admin/courses/create
/admin/courses/{id}/edit
/admin/courses/{id}/builder

/admin/course-categories

/admin/teachers

/admin/students
/admin/students/{id}

/admin/ebooks
/admin/ebook-categories
```

---

# 43. Frontend Design Rules

Frontend menggunakan:

- React;
- TypeScript;
- Inertia.js;
- Tailwind CSS;
- shadcn/ui.

Design direction:

- clean;
- modern;
- minimal;
- responsive;
- mudah dipahami;
- fokus pada readability;
- fokus pada learning experience.

Gunakan komponen shadcn/ui jika tersedia sebelum membuat komponen UI sendiri.

Contoh komponen:

- Button;
- Card;
- Dialog;
- Sheet;
- DropdownMenu;
- Tabs;
- Accordion;
- Progress;
- Badge;
- Input;
- Select;
- Textarea;
- Table;
- Pagination;
- Breadcrumb;
- Skeleton;
- AlertDialog.

---

# 44. Responsive Design

Website wajib usable pada:

- desktop;
- tablet;
- mobile.

Learning sidebar pada mobile dapat berubah menjadi:

- drawer;
- sheet;
- accordion.

Video embed harus menggunakan aspect ratio responsif seperti:

```text
16:9
```

---

# 45. File Upload

File yang dapat diupload admin:

- course thumbnail;
- course banner;
- teacher photo;
- attachment learning content;
- ebook cover;
- ebook file.

Database hanya menyimpan path/URL.

File binary tidak disimpan langsung di MySQL.

---

# 46. Validation

## User

- name required;
- email required;
- email valid;
- email unique;
- password minimum sesuai security policy.

## Course

- category required;
- title required;
- slug unique;
- status valid enum.

## Teacher

- name required;
- expertise optional.

## Material

- course required;
- title required.

## Learning Content

Umum:

- material required;
- type required;
- title required.

Jika:

```text
type = video
```

maka:

- youtube_url required;
- valid YouTube URL;
- youtube_video_id harus berhasil diekstrak;
- textbook_content boleh null.

Jika:

```text
type = textbook
```

maka:

- textbook_content required;
- youtube_url null;
- youtube_video_id null.

## Ebook

- category required;
- title required;
- slug unique;
- file required ketika publish;
- cover optional atau required sesuai keputusan UI.

---

# 47. Security Requirements

- semua password wajib di-hash;
- gunakan CSRF protection Laravel;
- gunakan Laravel validation;
- authorization menggunakan middleware/policy;
- user hanya dapat melihat progress sendiri;
- sanitize rich text textbook;
- validasi MIME file upload;
- batasi ukuran file;
- jangan menyimpan secret pada frontend;
- `.env` tidak boleh masuk repository;
- route admin wajib dilindungi;
- input YouTube tidak boleh digunakan sebagai raw iframe HTML dari user.

Untuk YouTube embed, sistem membuat embed berdasarkan `youtube_video_id`, bukan menerima HTML iframe bebas.

---

# 48. Performance Requirements

Target MVP:

- gunakan eager loading untuk relasi;
- hindari N+1 queries;
- gunakan pagination;
- index database mengikuti schema;
- progress summary menggunakan `course_material_progress` dan `course_enrollments`;
- gambar menggunakan ukuran teroptimasi;
- lazy loading untuk image jika sesuai;
- YouTube iframe tidak perlu dimuat sebelum diperlukan jika optimasi dibutuhkan.

---

# 49. Accessibility

Minimal:

- tombol memiliki label jelas;
- form memiliki label;
- navigasi keyboard memungkinkan;
- kontras warna memadai;
- video tidak autoplay;
- state completed tidak hanya dibedakan berdasarkan warna;
- icon penting memiliki text/aria label.

---

# 50. Error Handling

Sistem harus memberikan feedback untuk:

- login gagal;
- register gagal;
- course tidak ditemukan;
- enrollment duplicate;
- YouTube URL invalid;
- upload gagal;
- content tidak ditemukan;
- course belum dipublish;
- unauthorized access;
- server error.

Gunakan toast/alert yang konsisten.

---

# 51. Notifications

MVP cukup menggunakan in-app feedback/toast.

Contoh:

```text
Berhasil mendaftar kelas.

Progress berhasil disimpan.

Materi berhasil ditandai selesai.

Course berhasil dibuat.
```

Email notification tidak menjadi requirement MVP.

---

# 52. Search dan Filter

## Course

Search:

- title.

Filter:

- category;
- level;
- status untuk admin.

## Student Admin

Search:

- name;
- email.

## Teacher

Search:

- name;
- expertise.

## Ebook

Search:

- title;
- author.

Filter:

- category;
- status untuk admin.

---

# 53. Audit Data Dasar

Untuk entity utama tersedia:

```text
created_at
updated_at
```

Untuk entity yang menggunakan soft delete:

```text
deleted_at
```

`created_by` tersedia pada:

- courses;
- ebooks.

Audit log penuh belum termasuk scope MVP.

---

# 54. Out of Scope MVP

Fitur berikut tidak termasuk versi awal:

- payment gateway;
- subscription;
- premium course;
- voucher;
- coupon;
- teacher login;
- teacher dashboard;
- live streaming;
- Zoom integration;
- quiz;
- exam;
- assignment;
- certificate;
- discussion forum;
- comments;
- course rating;
- review;
- wishlist;
- chat;
- email campaign;
- attendance;
- SCORM;
- downloadable offline video;
- hosting video sendiri.

Fitur-fitur tersebut dapat ditambahkan pada fase selanjutnya.

---

# 55. Main User Flow

## Student

```text
Register
↓
Login
↓
Browse Courses
↓
Open Course Detail
↓
Click Daftar Kelas
↓
Enrollment Created
↓
Start Learning
↓
Open Video/Textbook
↓
Mark Completed
↓
Progress Updated
↓
Next Content
↓
All Content Completed
↓
Course Completed
```

## Admin

```text
Login
↓
Admin Dashboard
↓
Create Category
↓
Create Teacher
↓
Create Course
↓
Assign Teacher
↓
Create Materials
↓
Create Video/Textbook
↓
Publish Course
↓
Student Enrolls
↓
Monitor Student Progress
```

---

# 56. Acceptance Criteria

## Authentication

- [ ] Student dapat register.
- [ ] Student dapat login.
- [ ] Admin dapat login.
- [ ] Role admin dan student dibedakan.
- [ ] Student tidak dapat mengakses admin route.

## Course

- [ ] Admin dapat CRUD category.
- [ ] Admin dapat CRUD course.
- [ ] Course dapat draft/published/archived.
- [ ] Student hanya melihat published course.
- [ ] Course memiliki satu category.
- [ ] Course dapat memiliki banyak teacher.

## Teacher

- [ ] Admin dapat CRUD teacher.
- [ ] Teacher tidak membutuhkan akun login.
- [ ] Satu teacher dapat berada pada banyak course.

## Material

- [ ] Course memiliki banyak material.
- [ ] Admin dapat mengatur urutan material.
- [ ] Material unpublished tidak tampil untuk student.

## Learning Content

- [ ] Material memiliki banyak learning content.
- [ ] Content dapat berupa video.
- [ ] Content dapat berupa textbook.
- [ ] Admin dapat mengatur urutan content.
- [ ] Video hanya menggunakan YouTube.
- [ ] URL YouTube divalidasi.
- [ ] Video ID diekstrak.
- [ ] Video di-embed dalam learning page.
- [ ] Textbook dapat menampilkan rich text.
- [ ] Attachment bersifat opsional.

## Enrollment

- [ ] Student dapat enroll dengan satu klik.
- [ ] Tidak ada checkout.
- [ ] Tidak ada pembayaran.
- [ ] Tidak ada admin approval.
- [ ] Duplicate enrollment dicegah.
- [ ] Student langsung mendapatkan akses setelah enroll.

## Progress

- [ ] Opening content membuat progress.
- [ ] Student dapat menandai content selesai.
- [ ] Progress content tersimpan.
- [ ] Material selesai otomatis.
- [ ] Course selesai otomatis.
- [ ] Progress percentage ditampilkan.
- [ ] Last learning content tersimpan.
- [ ] Tombol Lanjutkan Belajar bekerja.
- [ ] Admin dapat melihat progress student.

## Ebook

- [ ] Admin dapat CRUD ebook category.
- [ ] Admin dapat CRUD ebook.
- [ ] E-book berdiri sendiri dari course.
- [ ] Student dapat melihat published e-book.
- [ ] Student dapat membuka/download e-book.

## Responsive

- [ ] Course catalog responsive.
- [ ] Dashboard responsive.
- [ ] Learning page responsive.
- [ ] YouTube embed responsive.
- [ ] Admin dashboard usable pada ukuran layar utama.

---

# 57. Definition of Done

Website dapat dianggap siap untuk MVP jika:

1. authentication admin dan student berjalan;
2. admin dapat membangun course dari category sampai learning content;
3. video YouTube dapat di-embed dan diputar pada website;
4. textbook dapat dibaca;
5. student dapat enroll tanpa pembayaran;
6. student dapat mengakses seluruh course setelah enrollment;
7. progress learning content berjalan;
8. progress material dihitung otomatis;
9. progress course dihitung otomatis;
10. course otomatis completed ketika seluruh content selesai;
11. student dapat melanjutkan pembelajaran terakhir;
12. admin dapat melihat progress student;
13. module e-book berjalan secara mandiri;
14. seluruh authorization berjalan;
15. UI responsive;
16. database mengikuti schema yang telah ditentukan;
17. tidak ada payment flow pada sistem.

---

# 58. Kesimpulan Arsitektur Produk

Struktur LMS:

```text
USER
  │
  ├── ADMIN
  │     ├── Manage Course
  │     ├── Manage Teacher
  │     ├── Manage Student
  │     ├── Manage Ebook
  │     └── Monitor Progress
  │
  └── STUDENT
        │
        ├── Course Enrollment
        │       ↓
        │     Course
        │       ↓
        │     Material
        │       ↓
        │     Learning Content
        │       ├── YouTube Video
        │       └── Textbook
        │
        ├── Progress Tracking
        │       ↓
        │ Content Progress
        │       ↓
        │ Material Progress
        │       ↓
        │ Course Progress
        │
        └── Ebook Library
```

Prinsip utama sistem:

- sederhana untuk student;
- satu klik enrollment;
- tanpa pembayaran;
- teacher hanya data profil;
- YouTube sebagai satu-satunya sumber video;
- video diputar melalui embed;
- learning content menjadi unit terkecil progress;
- material dan course selesai otomatis berdasarkan content;
- e-book berdiri sendiri dari course;
- admin mengelola seluruh konten dari satu panel.
