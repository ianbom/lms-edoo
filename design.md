# DESIGN SYSTEM — Online Course LMS

## 1. Tujuan Dokumen

Dokumen ini menjadi acuan visual utama untuk seluruh website Online Course LMS, baik halaman Student maupun Admin.

Seluruh implementasi frontend harus mempertahankan karakter visual dari referensi:

- bersih;
- modern;
- profesional;
- ramah untuk platform edukasi;
- dominan putih;
- aksen biru yang kuat;
- banyak whitespace;
- rounded corners;
- border halus;
- shadow sangat ringan;
- layout terstruktur;
- mudah dibaca;
- fokus pada konten pembelajaran.

Dokumen ini harus menjadi sumber aturan desain ketika membuat komponen baru. Jangan membuat gaya visual baru yang bertentangan dengan sistem ini.

---

# 2. Design Direction

Visual website mengikuti gaya modern educational platform dengan karakter:

```text
Clean
Minimal
Bright
Professional
Friendly
Structured
Accessible
Modern LMS
```

Website **tidak boleh** terlihat seperti:

- dashboard enterprise yang terlalu padat;
- website dengan gradient berlebihan;
- website dengan dark theme dominan;
- website dengan shadow berat;
- UI penuh warna yang tidak konsisten;
- desain glassmorphism;
- desain neon;
- desain brutalist;
- layout terlalu sempit;
- komponen dengan radius terlalu besar.

Prinsip utama:

> White space + strong blue identity + dark navy typography + light borders + clear hierarchy.

---

# 3. Color System

Palet warna berasal dari referensi visual BRI Peduli.

## 3.1 Primary Blue

Warna utama seluruh website.

```text
Primary Blue
#1054D0
```

Digunakan untuk:

- primary button;
- link aktif;
- logo;
- active navigation;
- active category tab;
- progress;
- icon utama;
- harga "Gratis";
- CTA;
- interactive states.

### Primary Hover

```text
#0C46B8
```

Digunakan ketika:

- hover button;
- hover interactive card action;
- hover link penting.

### Primary Pressed

```text
#093B9E
```

---

## 3.2 Secondary / Bright Blue

Digunakan untuk beberapa icon atau aksen ringan.

```text
#2478E4
```

Penggunaan:

- icon circular;
- small accent;
- focus highlight;
- secondary visual emphasis.

Jangan digunakan lebih dominan daripada `Primary Blue`.

---

## 3.3 Navy / Heading

Heading utama menggunakan navy yang sangat gelap.

```text
#070B49
```

Digunakan untuk:

- H1;
- H2;
- card title;
- navigation text penting;
- heading dashboard;
- modal title.

Ini **bukan hitam murni**.

---

## 3.4 Body Text

```text
Primary Body
#59648A
```

Digunakan untuk:

- paragraph;
- description;
- subtitle;
- supporting copy.

### Secondary Text

```text
#7D89A8
```

Digunakan untuk:

- metadata;
- placeholder;
- helper text;
- timestamps;
- inactive labels.

---

## 3.5 White

```text
#FFFFFF
```

Digunakan untuk:

- navbar;
- cards;
- form controls;
- content surface;
- table;
- modal.

---

## 3.6 Page Background

Background halaman bukan abu-abu pekat.

Gunakan:

```text
#FBFCFF
```

atau putih murni pada halaman yang membutuhkan tampilan sangat bersih.

---

## 3.7 Border

Default border:

```text
#E3E8F2
```

Soft border:

```text
#EDF1F7
```

Gunakan border tipis 1px.

Jangan menggunakan border gelap kecuali pada state khusus.

---

## 3.8 Light Blue Surface

Digunakan untuk CTA, icon container, hover lembut, dan selected subtle background.

```text
#DCECFC
```

Alternative lighter:

```text
#EEF6FF
```

---

## 3.9 Orange Accent

Referensi menggunakan aksen orange secara sangat terbatas pada metadata jumlah student.

```text
#F5A500
```

Penggunaan hanya sebagai small semantic/decorative accent seperti:

- icon jumlah student;
- highlight kecil.

Orange **tidak boleh** menjadi warna CTA utama.

---

## 3.10 Semantic Colors

### Success

```text
#16A36A
```

### Success Background

```text
#EAF8F1
```

### Warning

```text
#D99100
```

### Warning Background

```text
#FFF7DD
```

### Error

```text
#D83B3B
```

### Error Background

```text
#FDECEC
```

### Info

Gunakan Primary Blue.

---

# 4. CSS / shadcn Color Tokens

Implementasi disarankan menggunakan semantic tokens.

```css
:root {
  --background: #FBFCFF;
  --foreground: #070B49;

  --card: #FFFFFF;
  --card-foreground: #070B49;

  --popover: #FFFFFF;
  --popover-foreground: #070B49;

  --primary: #1054D0;
  --primary-foreground: #FFFFFF;

  --secondary: #EEF6FF;
  --secondary-foreground: #1054D0;

  --muted: #F5F7FB;
  --muted-foreground: #7D89A8;

  --accent: #DCECFC;
  --accent-foreground: #1054D0;

  --destructive: #D83B3B;
  --destructive-foreground: #FFFFFF;

  --border: #E3E8F2;
  --input: #E3E8F2;
  --ring: #2478E4;

  --radius: 0.75rem;
}
```

Dark mode bukan prioritas dan **tidak perlu dibuat untuk MVP**, kecuali ditentukan kemudian.

---

# 5. Typography

## 5.1 Font Family

Gunakan:

```text
Inter
```

Fallback:

```css
font-family:
  Inter,
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

Gunakan satu keluarga font secara konsisten.

Jangan mencampur font serif atau display font lain.

---

# 6. Typography Scale

## Display / Page Hero

```text
font-size: 40–44px
line-height: 1.1–1.2
font-weight: 700
color: Navy
letter-spacing: -0.02em
```

Contoh:

```text
Kelas Populer
```

---

## H1

Desktop:

```text
36–40px
700
```

Tablet:

```text
32px
```

Mobile:

```text
28px
```

---

## H2

```text
28–32px
700
```

---

## H3

```text
22–24px
700
```

---

## H4 / Card Title

```text
18–20px
700
```

---

## Body Large

```text
17–18px
400–500
line-height: 1.55
```

---

## Body

```text
14–16px
400
line-height: 1.5–1.65
```

---

## Small / Metadata

```text
12–14px
400–500
```

---

## Label

```text
13–14px
600
```

---

# 7. Text Hierarchy

Urutan visual:

```text
Page Title
↓
Page Subtitle
↓
Section Title
↓
Card Title
↓
Description
↓
Metadata
```

Heading menggunakan navy gelap.

Body menggunakan muted blue-gray.

Primary action menggunakan biru.

Jangan menggunakan terlalu banyak font weight `700`.

---

# 8. Layout System

## 8.1 Main Container

Desktop:

```text
max-width: 1360px
margin: 0 auto
padding-left/right: 32px–44px
```

Tailwind recommendation:

```text
max-w-[1360px] mx-auto px-5 md:px-8 xl:px-10
```

---

# 9. Page Spacing

Default vertical spacing:

```text
Navbar → Page Content: 32px
Section → Section: 48–64px
Heading → Content: 20–28px
Card Grid Gap: 20px
```

Gunakan whitespace yang cukup.

Jangan membuat section saling menempel.

---

# 10. Spacing Scale

Gunakan kelipatan 4px.

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
80px
```

Prioritas:

```text
Small UI spacing: 8–12px
Component internal spacing: 16–24px
Section spacing: 40–64px
```

---

# 11. Grid System

## Course Listing

Desktop:

```text
3 columns
gap: 20px
```

Tablet:

```text
2 columns
gap: 18–20px
```

Mobile:

```text
1 column
gap: 16px
```

Contoh Tailwind:

```text
grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5
```

---

# 12. Border Radius

Gunakan radius modern tetapi tidak terlalu bulat.

## Card

```text
12–14px
```

Recommended:

```text
rounded-xl
```

## Buttons

```text
10–12px
```

## Search Field

```text
20–24px
```

Search bar boleh berbentuk pill.

## Filter Pills

```text
9999px
```

## Image

Mengikuti radius card pada sisi yang relevan.

---

# 13. Borders

Gunakan:

```text
1px solid #E3E8F2
```

Cards sebaiknya terlihat melalui border dan bukan shadow besar.

---

# 14. Shadows

Shadow default sangat ringan.

```css
box-shadow:
  0 2px 8px rgba(7, 11, 73, 0.04);
```

Hover:

```css
box-shadow:
  0 8px 24px rgba(7, 11, 73, 0.08);
```

Jangan menggunakan shadow:

- terlalu gelap;
- terlalu blur;
- berlapis-lapis;
- membuat card seolah melayang jauh.

---

# 15. Navbar

Navbar mengikuti referensi.

## Desktop

```text
Height: ±64px
Background: White
Border bottom: subtle
Position: sticky top preferred
```

Komposisi:

```text
Logo
Navigation
Flexible spacer
Search
Login
Primary Register Button
```

Contoh:

```text
[BRI Peduli]

Home
Kelas⌄
Tentang Kami
Untuk Institusi
Blog
Kontak

[ Search........................ ]

Masuk
[Daftar]
```

---

# 16. Navbar Logo

Logo berada di kiri.

Struktur:

```text
Icon
Brand Name
Small Tagline
```

Brand name:

```text
Primary Blue
Bold
```

Tagline:

```text
Small
Muted
```

---

# 17. Navigation Item

Normal:

```text
color: Navy / muted navy
weight: 500
```

Active:

```text
color: Primary Blue
weight: 600
```

Active item mempunyai underline biru tipis.

Jangan menggunakan background block besar untuk active navigation desktop.

---

# 18. Search Bar

Search bar mengikuti tampilan rounded pill.

```text
height: 42–44px
border: 1px Border
background: #FAFCFF
radius: full
```

Komponen:

```text
[Search Icon] Placeholder
```

Placeholder:

```text
Cari kelas, topik, atau keterampilan...
```

Focus:

```text
border blue
ring 2px soft blue
```

---

# 19. Buttons

## Primary Button

```text
background: #1054D0
text: white
height: 42–48px
padding horizontal: 20–28px
font-weight: 600
radius: 10–12px
```

Hover:

```text
background: #0C46B8
```

Contoh:

```text
Daftar
Daftar Sekarang
Daftar Kelas
Mulai Belajar
```

---

## Secondary Button

```text
background: white
border: #E3E8F2
text: #1054D0 atau Navy
```

Hover:

```text
background: #F5F9FF
```

---

## Ghost Button

Tidak mempunyai background kecuali hover.

Digunakan untuk:

- action kecil;
- navigation;
- secondary toolbar.

---

## Circular Action Button

Seperti icon panah pada course card.

```text
width: 40px
height: 40px
border-radius: full
background: #DCECFC
icon: #1054D0
```

Hover:

```text
background: #1054D0
icon: white
```

---

# 20. Filter / Category Pills

Filter kategori menggunakan pill.

Active:

```text
background: Primary Blue
color: White
border: Primary Blue
```

Inactive:

```text
background: White
color: Body/Navy
border: #D9E2F0
```

Dimensions:

```text
height: 42px
padding: 0 28px
```

Spacing:

```text
8–12px
```

---

# 21. Course Card

Course card adalah komponen visual utama.

Struktur:

```text
┌───────────────────────────────┐
│                               │
│ Course Image                  │
│ + optional image tagline      │
│                               │
├───────────────────────────────┤
│ Category                      │
│ Course Title                  │
│ Short Description             │
│                               │
│ metadata                      │
│                               │
│ Gratis                  [ → ] │
└───────────────────────────────┘
```

---

# 22. Course Card Dimensions

Desktop:

```text
width: auto mengikuti grid
min-height: konsisten per row
```

Image ratio:

```text
16:7 sampai 16:8
```

Recommended:

```text
aspect-ratio: 16 / 7
```

atau tinggi sekitar:

```text
185–200px
```

Card:

```text
background: White
border: 1px #E3E8F2
radius: 12px
overflow: hidden
```

---

# 23. Course Image

Image wajib:

```text
object-fit: cover
width: 100%
```

Jangan:

- stretch image;
- membuat image gepeng;
- menggunakan gambar berkualitas rendah.

Jika ada teks promosi di atas image:

- gunakan white;
- bold;
- maksimal 3–4 baris;
- tambahkan dark overlay gradient sangat lembut hanya untuk readability.

Contoh:

```text
Ternak sehat,
hasil maksimal
untuk masa depan
yang berkelanjutan
```

---

# 24. Course Card Content

Padding:

```text
20–24px
```

Category:

```text
13px
600
Primary/Muted Navy Blue
```

Title:

```text
18–20px
700
Navy
```

Description:

```text
14px
400
Body text
2–3 lines
```

Gunakan line clamp agar tinggi card konsisten.

---

# 25. Course Metadata

Metadata menggunakan icon kecil dan text.

Contoh:

```text
[Video Icon] 120+ video
[User Icon] 4.200+ siswa
```

Ukuran:

```text
12–14px
```

Default icon:

```text
blue-gray
```

Student icon boleh menggunakan orange sebagai aksen terbatas.

---

# 26. Free Label

Untuk website tanpa pembayaran, label:

```text
Gratis
```

Style:

```text
font-size: 22–24px
font-weight: 700
color: Primary Blue
```

Jangan menggunakan badge hijau untuk "Gratis" jika ingin konsisten dengan referensi.

---

# 27. Card Hover

Hover course card:

```text
translateY(-2px)
shadow sedikit meningkat
border sedikit lebih blue
```

Animation:

```text
150–200ms ease-out
```

Jangan:

```text
scale besar
rotate
bounce
```

---

# 28. Section Header

Struktur:

```text
Title
Subtitle
```

Contoh:

```text
Kelas Populer
Pilih kelas yang sesuai dengan kebutuhan Anda
```

Desktop boleh menggunakan:

```text
Heading di kiri
Filter di kanan
```

Mobile:

```text
Heading
Subtitle
Filter horizontal scroll
```

---

# 29. CTA Banner

CTA menggunakan light blue surface.

Struktur desktop:

```text
[Icon Circle] Heading + Description      [Primary Button]
```

Background:

```text
#DCECFC
```

Radius:

```text
12–14px
```

Padding:

```text
18–24px
```

Contoh:

```text
Siap meningkatkan keterampilan Anda?
Bergabunglah dan mulai perjalanan belajar Anda hari ini.

[Daftar Sekarang →]
```

---

# 30. Feature Strip

Feature strip seperti pada bagian bawah referensi.

Contoh:

```text
[Book] Pendukung Pemula
[Users] Instruktur Berpengalaman
[Award] Sertifikat Kursus
[Clock] Belajar Fleksibel
```

Untuk proyek LMS ini, teks harus disesuaikan dengan fitur yang benar-benar tersedia.

**Jangan menampilkan "Sertifikat Kursus" apabila fitur sertifikat belum dibuat.**

Gunakan hanya klaim yang benar.

---

# 31. Iconography

Gunakan icon outline modern.

Recommended:

```text
Lucide React
```

Style:

```text
stroke-width: 1.8–2
```

Warna icon default:

```text
Primary Blue
```

Icon tidak boleh:

- 3D;
- multi-color tanpa alasan;
- terlalu detail;
- menggunakan beberapa library icon berbeda.

---

# 32. Images

Visual photography harus:

- realistis;
- bright;
- natural;
- profesional;
- memiliki focal point jelas;
- tidak terlalu saturated.

Untuk course:

- gunakan image yang mewakili isi kelas;
- hindari stock image yang terlalu generik jika tersedia pilihan lebih relevan.

---

# 33. Student Dashboard

Dashboard Student menggunakan sistem visual yang sama.

Layout desktop:

```text
Page Header
↓
Summary Cards
↓
Continue Learning
↓
My Courses
↓
Recommended / Other Courses
```

Summary card:

- white;
- border subtle;
- radius 12px;
- icon dalam light-blue container;
- angka/title navy;
- supporting text muted.

Jangan membuat dashboard terlalu penuh.

---

# 34. Progress Component

Progress bar:

Background:

```text
#E6EDF8
```

Fill:

```text
#1054D0
```

Height:

```text
6–8px
```

Radius:

```text
full
```

Contoh:

```text
Progress Belajar
65%

████████████░░░░░░
```

Completed:

- tetap boleh menggunakan Primary Blue;
- icon check dapat menggunakan success green.

---

# 35. My Learning Course Card

Card harus menampilkan:

- thumbnail;
- title;
- progress;
- last activity;
- CTA "Lanjutkan Belajar".

Prioritaskan progress dibanding metadata marketing.

---

# 36. Course Detail Page

Layout desktop:

```text
Main Content (±65%)
Sidebar Course Summary (±35%)
```

Hero/detail:

- breadcrumb;
- category;
- title;
- description;
- teachers;
- metadata;
- image/banner.

Sidebar:

- card putih;
- border;
- CTA primary;
- information list.

Tidak ada harga atau checkout karena platform gratis.

CTA:

```text
Daftar Kelas
```

Jika sudah enroll:

```text
Lanjutkan Belajar
```

---

# 37. Teacher Display

Teacher menggunakan avatar/foto bundar.

Ukuran umum:

```text
40–56px
```

Data:

```text
Photo
Name
Expertise
```

Jika banyak teacher:

- gunakan list horizontal;
- jangan membuat section yang terlalu besar.

---

# 38. Learning Page

Learning page boleh lebih utilitarian tetapi tetap konsisten.

Desktop:

```text
┌──────────────────────────────┬────────────────────┐
│ Main Learning Content        │ Course Navigation  │
│                              │                    │
│ YouTube / Textbook           │ Materials          │
│                              │ Content            │
└──────────────────────────────┴────────────────────┘
```

Recommended ratio:

```text
Main: 70–75%
Sidebar: 25–30%
```

---

# 39. YouTube Player

Player:

```text
aspect-ratio: 16 / 9
width: 100%
background: black
border-radius: 12px
overflow: hidden
```

Jangan menampilkan player dengan ukuran tidak proporsional.

Container video boleh memiliki background navy/black khusus area player.

---

# 40. Learning Sidebar

Sidebar:

- background white;
- border-left atau card border;
- title course;
- progress;
- accordion material;
- content status.

Status:

```text
Completed → check icon
Current → soft blue background
Not completed → neutral
```

Current learning content:

```text
background: #EEF6FF
color: Primary Blue
```

---

# 41. Textbook Reading Area

Textbook content memiliki:

```text
max-width: 760–840px
```

agar paragraf tidak terlalu lebar.

Typography:

```text
body: 16–17px
line-height: 1.7
```

Heading textbook diberi spacing besar.

Jangan membuat rich text terlalu padat.

---

# 42. Ebook Catalog

Gunakan visual konsisten dengan course catalog tetapi format card dapat lebih vertikal.

Desktop:

```text
4 columns jika cover portrait kecil
atau
3 columns jika card memiliki detail banyak
```

Cover:

```text
aspect-ratio sekitar 3 / 4
```

Card:

- white;
- border;
- radius;
- clean.

---

# 43. Ebook Card

Struktur:

```text
Cover
Category
Title
Author
CTA
```

Tidak perlu menampilkan terlalu banyak metadata.

---

# 44. Forms

Form harus sederhana.

Label:

```text
14px
600
Navy
```

Input:

```text
height: 42–44px
background: white
border: #DDE5F0
radius: 8–10px
```

Focus:

```text
border: #2478E4
ring: soft blue
```

Error:

```text
border: Error
helper text: Error
```

---

# 45. Textarea

Minimum:

```text
min-height: 120px
```

Gunakan radius yang sama dengan input.

---

# 46. Select

Gunakan komponen shadcn/ui Select.

Visual harus konsisten dengan input biasa.

---

# 47. Rich Text Editor

Textbook editor harus berada dalam card/surface putih.

Toolbar:

- sederhana;
- tidak terlalu ramai;
- icon monochrome;
- active icon menggunakan Primary Blue.

---

# 48. Admin Design

Admin menggunakan identity visual yang sama tetapi dapat lebih dense.

Layout:

```text
Sidebar
Header
Main Content
```

Sidebar:

```text
background: White
border-right: #E3E8F2
```

Active menu:

```text
background: #EEF6FF
color: #1054D0
```

Icon:

```text
Primary Blue when active
Muted otherwise
```

Admin tidak menggunakan tema gelap.

---

# 49. Admin Sidebar

Width desktop:

```text
240–260px
```

Menu item:

```text
height: 42–44px
radius: 8px
padding: 12px
```

Group spacing cukup jelas.

---

# 50. Admin Header

Header:

- white;
- border bottom;
- page/context title;
- user menu di kanan.

Tidak perlu shadow berat.

---

# 51. Admin Tables

Table surface:

```text
white
border
radius: 12px
```

Header:

```text
background: #F8FAFD
font-weight: 600
color: Navy
```

Row:

```text
border-bottom: soft
```

Hover:

```text
#FAFCFF
```

Action menggunakan:

- dropdown menu;
- icon buttons;
- bukan banyak tombol besar pada setiap row.

---

# 52. Badges

Status badges menggunakan soft background.

Published:

```text
green soft
```

Draft:

```text
gray/blue soft
```

Archived:

```text
neutral
```

Completed:

```text
green soft
```

In Progress:

```text
blue soft
```

Enrolled:

```text
neutral blue
```

Badge:

```text
font-size: 12px
font-weight: 600
radius: full
```

---

# 53. Modal / Dialog

Dialog:

```text
background: White
radius: 14px
max-width sesuai kebutuhan
```

Heading:

```text
20–24px
700
Navy
```

Overlay:

```text
rgba(7, 11, 73, 0.35)
```

Jangan menggunakan blur overlay berat.

---

# 54. Dropdown Menu

- white;
- border;
- subtle shadow;
- radius 10px;
- item hover light-blue/gray;
- destructive action merah.

---

# 55. Toast

Success:

- icon success;
- clean white card;
- subtle border.

Error:

- error icon;
- jangan membuat seluruh layar merah.

Durasi:

```text
3–5 detik
```

---

# 56. Empty State

Empty state:

- icon sederhana;
- title;
- description singkat;
- satu CTA jika relevan.

Contoh:

```text
Belum ada kelas yang diikuti

Temukan kelas yang ingin Anda pelajari.

[Jelajahi Kelas]
```

---

# 57. Loading / Skeleton

Gunakan skeleton.

Color:

```text
#EEF1F6
```

Jangan menggunakan spinner besar untuk seluruh halaman kecuali initial blocking process.

---

# 58. Pagination

Pagination:

- compact;
- border subtle;
- active page blue;
- radius 8px.

---

# 59. Breadcrumb

Breadcrumb:

```text
13–14px
```

Inactive:

```text
Muted
```

Current:

```text
Navy
```

Separator:

```text
ChevronRight
```

---

# 60. Mobile Navigation

Desktop navbar berubah menjadi:

```text
Logo
Search/Icon optional
Menu Button
```

Menu dibuka melalui:

```text
Sheet / Drawer
```

Primary CTA tetap mudah diakses.

---

# 61. Responsive Breakpoints

Gunakan Tailwind defaults sebagai dasar:

```text
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

Desain utama dioptimalkan untuk:

```text
Desktop: ≥1280px
Tablet: 768–1279px
Mobile: <768px
```

---

# 62. Mobile Course List

Mobile:

```text
1 card per row
```

Heading dan filter:

```text
stack vertical
```

Filter kategori:

```text
horizontal scroll
```

Jangan mengecilkan semua elemen desktop secara paksa.

---

# 63. Mobile Learning Page

Learning player berada di atas.

Course content/sidebar berubah menjadi:

- accordion di bawah player; atau
- Sheet/Drawer.

Previous / Next tetap mudah ditekan.

---

# 64. Interaction & Motion

Motion harus subtle.

Duration:

```text
150ms–250ms
```

Easing:

```text
ease-out
```

Boleh:

- hover translate 1–2px;
- background transitions;
- opacity transitions;
- accordion transitions.

Tidak boleh:

- bounce berlebihan;
- parallax berat;
- card rotation;
- page transition dramatis.

---

# 65. Focus State

Semua interactive element harus mempunyai focus state.

Contoh:

```text
ring-2
ring-[#2478E4]/30
border-[#2478E4]
```

Jangan menghapus focus outline tanpa replacement.

---

# 66. Accessibility

Minimum:

- contrast text cukup;
- semua icon button memiliki aria-label;
- image memiliki alt;
- form memiliki label;
- buttons bukan div clickable;
- keyboard navigation bekerja;
- state tidak hanya dikomunikasikan dengan warna;
- video tidak autoplay;
- ukuran clickable area minimal sekitar 40px.

---

# 67. Content Width

Untuk text-heavy area:

```text
max-width: 760–840px
```

Untuk catalog/dashboard:

```text
max-width: 1360px
```

Jangan membiarkan paragraf full width pada monitor besar.

---

# 68. Component Priority

Gunakan komponen shadcn/ui terlebih dahulu:

```text
Button
Card
Input
Textarea
Select
Dialog
AlertDialog
DropdownMenu
Sheet
Accordion
Tabs
Badge
Progress
Table
Tooltip
Skeleton
Breadcrumb
Pagination
Avatar
```

Custom styling harus mengikuti design tokens dokumen ini.

---

# 69. Tailwind Rules

Hindari arbitrary values jika sudah tersedia token/style reusable.

Gunakan utility yang konsisten.

Contoh card:

```tsx
className="
  overflow-hidden
  rounded-xl
  border
  border-slate-200
  bg-white
  shadow-sm
  transition-all
  duration-200
  hover:-translate-y-0.5
  hover:shadow-md
"
```

Namun warna final sebaiknya menggunakan CSS variables/theme tokens, bukan hardcoded berulang kali.

---

# 70. Recommended Theme Mapping

Konsep Tailwind/shadcn:

```text
background     → #FBFCFF
foreground     → #070B49
primary        → #1054D0
secondary      → #EEF6FF
muted          → #F5F7FB
muted text     → #7D89A8
border         → #E3E8F2
accent         → #DCECFC
```

---

# 71. Visual Hierarchy Rules

Setiap halaman harus mempunyai satu primary visual focus.

Contoh halaman list course:

```text
1. Page title
2. Filters
3. Course grid
4. CTA
```

Jangan mempunyai 3–4 CTA primary dengan bobot visual sama.

---

# 72. Primary CTA Rule

Dalam satu visual area, hanya satu button yang boleh terlihat sebagai primary.

Contoh:

```text
Primary:
Daftar Kelas

Secondary:
Lihat Materi
```

Bukan:

```text
[Daftar Kelas] [Bagikan] [Favorit] [Lihat Teacher]
```

semuanya berwarna biru solid.

---

# 73. Copy Length

Card description:

```text
maksimal 2–3 line
```

Card title:

```text
maksimal 2 line
```

Button:

```text
1–3 kata jika memungkinkan
```

UI harus tetap ringan secara visual.

---

# 74. Image Overlay Rule

Overlay text pada image boleh digunakan untuk marketing-style course cards seperti referensi.

Gunakan:

```css
background:
  linear-gradient(
    to top,
    rgba(0, 0, 0, 0.55),
    rgba(0, 0, 0, 0.05)
  );
```

Gunakan hanya jika image membutuhkan text overlay.

Jangan menaruh deskripsi panjang di atas image.

---

# 75. Data Density

Student-facing UI:

```text
low to medium density
```

Admin UI:

```text
medium density
```

Student experience harus terasa lebih luas dan santai daripada admin panel.

---

# 76. Course Status Visual

Student tidak perlu melihat status internal seperti:

```text
draft
archived
```

Admin saja yang melihatnya.

Student hanya berinteraksi dengan course yang tersedia.

---

# 77. Enrollment State

CTA course harus berubah berdasarkan state.

Belum enroll:

```text
Daftar Kelas
```

Sudah enroll tetapi belum mulai:

```text
Mulai Belajar
```

Sedang belajar:

```text
Lanjutkan Belajar
```

Selesai:

```text
Lihat Kembali Kelas
```

Gunakan style button yang konsisten.

---

# 78. Completed Content

Completed learning content:

```text
CheckCircle icon
Success color atau Primary Blue
```

Jangan memberi strike-through pada judul konten karena mengurangi readability.

---

# 79. Video/Textbook Icon

Video:

```text
Video / PlayCircle icon
```

Textbook:

```text
BookOpen icon
```

Attachment:

```text
Paperclip / File icon
```

---

# 80. No Payment UI

Website tidak mempunyai payment.

Jangan membuat komponen:

- price table;
- checkout;
- cart;
- coupon;
- billing;
- payment badge.

Label `Gratis` pada katalog berfungsi hanya sebagai komunikasi bahwa kelas bebas biaya.

---

# 81. Design Consistency Rules

Semua page harus menggunakan:

- Primary Blue yang sama;
- Navy heading yang sama;
- Inter;
- radius yang sama;
- border yang sama;
- spacing scale yang sama;
- icon library yang sama;
- button style yang sama.

Jangan membuat style khusus halaman yang terlihat seperti website lain.

---

# 82. Things to Avoid

Jangan gunakan:

```text
❌ gradient biru/ungu sebagai background utama
❌ neon
❌ glassmorphism
❌ dark navbar
❌ shadow berat
❌ radius 24–40px pada semua card
❌ button pill untuk semua action
❌ terlalu banyak warna
❌ icon filled acak
❌ lebih dari satu font family
❌ full-width paragraph pada desktop
❌ nested card berlebihan
❌ border hitam
❌ gambar dengan aspect ratio tidak konsisten
```

---

# 83. Reference Page Composition

Halaman Course Listing utama mengikuti proporsi referensi:

```text
┌──────────────────────────────────────────────────────────┐
│ Navbar                                                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Kelas Populer                   [category filters...]    │
│ Pilih kelas sesuai kebutuhan                             │
│                                                          │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐             │
│ │ Course     │ │ Course     │ │ Course     │             │
│ │ Card       │ │ Card       │ │ Card       │             │
│ └────────────┘ └────────────┘ └────────────┘             │
│                                                          │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐             │
│ │ Course     │ │ Course     │ │ Course     │             │
│ └────────────┘ └────────────┘ └────────────┘             │
│                                                          │
│ [ CTA Banner ]            [ Benefit / Feature Strip ]    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

# 84. Design Decision Summary

Gunakan aturan inti berikut jika ada bagian UI yang belum diatur secara eksplisit:

1. Background dominan putih / near-white.
2. Primary action selalu blue `#1054D0`.
3. Heading menggunakan dark navy `#070B49`.
4. Body text menggunakan blue-gray.
5. Border tipis lebih diutamakan daripada shadow.
6. Radius card sekitar 12px.
7. Gunakan whitespace yang cukup.
8. Inter digunakan sebagai font utama.
9. Layout desktop menggunakan container maksimum ±1360px.
10. Catalog menggunakan grid 3 kolom desktop.
11. Semua interactive state harus jelas tetapi subtle.
12. Student UI lebih spacious daripada admin UI.
13. Gunakan shadcn/ui sebagai basis komponen.
14. Gunakan Lucide React sebagai icon system.
15. Jangan membuat elemen visual yang tidak memiliki fungsi.
16. Jangan menampilkan klaim atau fitur yang belum tersedia.
17. Seluruh website harus terasa sebagai satu produk yang sama dengan halaman referensi.

---

# 85. Final Visual Goal

Hasil akhir website harus memberikan impresi:

> Platform belajar online yang terpercaya, modern, ringan, profesional, mudah dipahami, serta memiliki identitas biru-putih yang kuat.

Visual benchmark utama:

```text
White spacious surface
+
Deep navy typography
+
Strong education blue
+
Soft light-blue accents
+
Clean rounded cards
+
Subtle border
+
Realistic imagery
+
Clear learning hierarchy
```

Setiap halaman baru harus dievaluasi terhadap aturan tersebut sebelum dianggap selesai.
